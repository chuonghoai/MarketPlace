import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from './entities/auction.entity';
import { AuctionItem } from './entities/auction-item.entity';
import { AuctionStatus } from './enums/auction.enum';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { RedisService } from '../redis/redis.service';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class AuctionsService {
  private readonly logger = new Logger(AuctionsService.name);

  constructor(
    @InjectRepository(Auction)
    private auctionRepo: Repository<Auction>,
    @InjectRepository(AuctionItem)
    private auctionItemRepo: Repository<AuctionItem>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private redisService: RedisService,
  ) {}

  async createAuction(dto: CreateAuctionDto) {
    const {
      title,
      startTime,
      endTime,
      countdownDuration,
      minStepPrice,
      auctionItems,
    } = dto;

    const auction = this.auctionRepo.create({
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      countdownDuration,
      minStepPrice,
      status: AuctionStatus.PENDING,
    });

    const items: AuctionItem[] = [];
    for (const itemDto of auctionItems) {
      const product = await this.productRepo.findOne({
        where: { id: itemDto.productId },
      });
      if (!product) {
        throw new NotFoundException(`Product ${itemDto.productId} not found`);
      }

      const item = this.auctionItemRepo.create({
        product,
        startPrice: itemDto.startPrice,
        currentPrice: itemDto.startPrice,
        status: AuctionStatus.PENDING,
      });
      items.push(item);
    }

    auction.items = items;
    await this.auctionRepo.save(auction);
    return auction;
  }

  // Get all auctions for admin dashboard
  async findAllAuctions() {
    return this.auctionRepo.find({
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  // Load into Redis to start
  async startAuctionItem(auctionItemId: string) {
    const item = await this.auctionItemRepo.findOne({
      where: { id: auctionItemId },
      relations: ['auction'],
    });
    if (!item) throw new NotFoundException('Auction item not found');
    if (item.status !== AuctionStatus.PENDING)
      throw new BadRequestException('Item already started or closed');

    item.status = AuctionStatus.ACTIVE;
    await this.auctionItemRepo.save(item);

    const redis = this.redisService.getClient();
    const key = `auction:${item.id}:state`;

    // endTime = current time + countdown
    const endTimeMs = Date.now() + item.auction.countdownDuration * 1000;

    await redis.hmset(key, {
      currentPrice: item.startPrice,
      winnerId: '',
      endTimeMs: endTimeMs,
      minStepPrice: item.auction.minStepPrice,
      countdownDuration: item.auction.countdownDuration * 1000,
    });

    return { itemId: item.id, startPrice: item.startPrice, endTimeMs };
  }

  // Place manual bid using Lua for atomicity
  async placeManualBid(
    userId: string,
    auctionItemId: string,
    price: number,
    isAutoBid = false,
  ) {
    const redis = this.redisService.getClient();
    const key = `auction:${auctionItemId}:state`;
    const now = Date.now();

    const script = `
      local state = redis.call('hgetall', KEYS[1])
      if #state == 0 then return {err="Auction not active or found"} end
      
      local data = {}
      for i=1, #state, 2 do
          data[state[i]] = state[i+1]
      end
      
      local currentPrice = tonumber(data['currentPrice'])
      local minStep = tonumber(data['minStepPrice'])
      local endTimeMs = tonumber(data['endTimeMs'])
      local duration = tonumber(data['countdownDuration'])
      local now = tonumber(ARGV[1])
      local bidPrice = tonumber(ARGV[2])
      local userId = ARGV[3]
      
      if now > endTimeMs then
         return {err="Auction has ended"}
      end
      
      if bidPrice < currentPrice + minStep then
         return {err="Bid price too low"}
      end
      
      local newEndTime = now + duration
      
      redis.call('hmset', KEYS[1], 'currentPrice', bidPrice, 'winnerId', userId, 'endTimeMs', newEndTime)
      
      return {ok=1, currentPrice=bidPrice, winnerId=userId, endTimeMs=newEndTime}
    `;

    const result = (await redis.eval(
      script,
      1,
      key,
      now,
      price,
      userId,
    )) as any;

    if (result[0] === 'err') {
      throw new BadRequestException(result[1]);
    }

    const bidResult = {
      currentPrice: result[3],
      winnerId: result[5],
      endTimeMs: result[7],
    };

    // Trigger Auto-Bid calculation cascade asynchronously
    if (!isAutoBid) {
      this.triggerAutoBidCascade(auctionItemId).catch((err) =>
        this.logger.error('AutoBid Cascade Error', err),
      );
    }

    return bidResult;
  }

  // Set Auto Bid configuration for a user
  async setAutoBid(
    userId: string,
    auctionItemId: string,
    autoStepPrice: number,
    ceilingPrice: number,
  ) {
    const redis = this.redisService.getClient();

    // Check if auction is active
    const state = await redis.hgetall(`auction:${auctionItemId}:state`);
    if (!state || !state.currentPrice) {
      throw new BadRequestException('Auction is not active');
    }

    // Save the user's auto-bid config
    await redis.hset(`auction:${auctionItemId}:autobid:${userId}`, {
      step: autoStepPrice,
      ceiling: ceilingPrice,
    });

    // Add user to the pool of autobidders for this item
    await redis.sadd(`auction:${auctionItemId}:autobidders`, userId);

    // Immediately trigger cascade in case their auto-bid can outbid the current price
    this.triggerAutoBidCascade(auctionItemId).catch((err) =>
      this.logger.error('AutoBid Cascade Error', err),
    );

    return { status: 'success', message: 'Auto-bid registered successfully' };
  }

  // Background process to cascade auto-bids
  private async triggerAutoBidCascade(auctionItemId: string) {
    const redis = this.redisService.getClient();

    let stable = false;
    // Anti-infinite loop safeguard
    let maxIterations = 50;

    while (!stable && maxIterations > 0) {
      stable = true;
      maxIterations--;

      const bidders = await redis.smembers(
        `auction:${auctionItemId}:autobidders`,
      );
      if (!bidders || bidders.length === 0) break;

      const state = await redis.hgetall(`auction:${auctionItemId}:state`);
      if (!state || !state.currentPrice) break;

      const currentPrice = parseInt(state.currentPrice, 10);
      const winnerId = state.winnerId;

      for (const bidderId of bidders) {
        if (bidderId === winnerId) continue; // Already winning

        const config = await redis.hgetall(
          `auction:${auctionItemId}:autobid:${bidderId}`,
        );
        if (!config || !config.step) continue;

        const step = parseInt(config.step, 10);
        const ceiling = parseInt(config.ceiling, 10);

        const nextBidPrice = currentPrice + step;

        if (nextBidPrice <= ceiling) {
          try {
            // Attempt to place auto bid
            await this.placeManualBid(
              bidderId,
              auctionItemId,
              nextBidPrice,
              true,
            );
            stable = false; // The state changed, need to re-evaluate
            break; // Break the inner loop, start while-loop again to fetch latest state
          } catch (e) {
            // Bid failed (e.g. price too low because someone else bid), ignore and continue
          }
        }
      }
    }
  }

  // End the auction item and sync back to DB
  async endAuctionItem(auctionItemId: string) {
    const redis = this.redisService.getClient();
    const key = `auction:${auctionItemId}:state`;
    const state = await redis.hgetall(key);

    if (!state || !state.currentPrice) return null;

    const item = await this.auctionItemRepo.findOne({
      where: { id: auctionItemId },
    });
    if (item) {
      item.currentPrice = parseInt(state.currentPrice, 10);
      item.status = AuctionStatus.CLOSED;
      // Note: we would need a User repo to assign item.currentWinner from state.winnerId
      await this.auctionItemRepo.save(item);
    }

    // Clear Redis
    await redis.del(key);
    return item;
  }
}
