import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Auction } from './entities/auction.entity';
import { AuctionItem } from './entities/auction-item.entity';
import { AuctionStatus } from './enums/auction.enum';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { RedisService } from '../redis/redis.service';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { WalletsService } from '../wallets/wallets.service';
import { EWalletStatus } from '../wallets/enums/wallet.enum';
import { Order } from '../checkout/entities/order.entity';
import { OrderItem } from '../checkout/entities/order-item.entity';
import { EOrderStatus } from '../checkout/enums/EOrderStatus.enum';
import { EPaymentStatus } from '../checkout/enums/EPaymentStatus.enum';
import { EPaymentMethod } from '../checkout/enums/EPaymentMethod.enum';

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
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
    private redisService: RedisService,
    private walletsService: WalletsService,
    private dataSource: DataSource,
  ) { }

  async createAuction(dto: CreateAuctionDto) {
    const { title, startTime, endTime, countdownDuration, minStepPrice, auctionItems } = dto;

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
      const product = await this.productRepo.findOne({ where: { id: itemDto.productId } });
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

  // Get all auctions for admin dashboard / listing
  async findAllAuctions() {
    return this.auctionRepo.find({
      relations: ['items', 'items.product', 'items.currentWinner'],
      order: { createdAt: 'DESC' }
    });
  }

  // Find one auction with items & products
  async findOneAuction(id: string) {
    const auction = await this.auctionRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'items.currentWinner'],
    });
    if (!auction) throw new NotFoundException('Không tìm thấy phiên đấu giá');
    return auction;
  }

  // Ensure an auction item is loaded into Redis
  async ensureAuctionItemActiveInRedis(auctionItemId: string) {
    const redis = this.redisService.getClient();
    const key = `auction:${auctionItemId}:state`;
    const state = await redis.hgetall(key);

    if (state && state.currentPrice) {
      return state;
    }

    const item = await this.auctionItemRepo.findOne({
      where: { id: auctionItemId },
      relations: ['auction', 'product', 'currentWinner'],
    });

    if (!item) {
      throw new NotFoundException('Không tìm thấy sản phẩm đấu giá');
    }

    if (item.status === AuctionStatus.CLOSED) {
      throw new BadRequestException('Phiên đấu giá sản phẩm này đã kết thúc');
    }

    const duration = (item.auction?.countdownDuration || 30) * 1000;
    const currentPrice = Number(item.currentPrice || item.startPrice);
    const minStep = Number(item.auction?.minStepPrice || 10000);
    const endTimeMs = Date.now() + duration;

    item.status = AuctionStatus.ACTIVE;
    await this.auctionItemRepo.save(item);

    await redis.hmset(key, {
      currentPrice: currentPrice,
      winnerId: item.currentWinner?.id || '',
      endTimeMs: endTimeMs,
      minStepPrice: minStep,
      countdownDuration: duration,
    });

    return await redis.hgetall(key);
  }

  // Load into Redis to start manually
  async startAuctionItem(auctionItemId: string) {
    const item = await this.auctionItemRepo.findOne({
      where: { id: auctionItemId },
      relations: ['auction']
    });
    if (!item) throw new NotFoundException('Auction item not found');
    if (item.status === AuctionStatus.CLOSED) throw new BadRequestException('Item already closed');

    item.status = AuctionStatus.ACTIVE;
    await this.auctionItemRepo.save(item);

    const redis = this.redisService.getClient();
    const key = `auction:${item.id}:state`;

    const duration = (item.auction?.countdownDuration || 30) * 1000;
    const endTimeMs = Date.now() + duration;

    await redis.hmset(key, {
      currentPrice: Number(item.currentPrice || item.startPrice),
      winnerId: '',
      endTimeMs: endTimeMs,
      minStepPrice: Number(item.auction?.minStepPrice || 10000),
      countdownDuration: duration,
    });

    return { itemId: item.id, startPrice: item.startPrice, endTimeMs };
  }

  // Get current live state of an auction item
  async getAuctionItemState(auctionItemId: string) {
    const item = await this.auctionItemRepo.findOne({
      where: { id: auctionItemId },
      relations: ['auction', 'product', 'currentWinner'],
    });

    if (!item) {
      throw new NotFoundException('Không tìm thấy sản phẩm đấu giá');
    }

    if (item.status === AuctionStatus.CLOSED) {
      return {
        status: AuctionStatus.CLOSED,
        currentPrice: Number(item.currentPrice || item.startPrice),
        winnerId: item.currentWinner?.id || '',
        winnerName: item.currentWinner?.fullName || item.currentWinner?.email || '',
        endTimeMs: 0,
        countdownDuration: item.auction?.countdownDuration || 30,
        isEnded: true,
      };
    }

    const state = await this.ensureAuctionItemActiveInRedis(auctionItemId);

    let winnerName = '';
    if (state.winnerId) {
      const winner = await this.userRepo.findOne({ where: { id: state.winnerId } });
      if (winner) {
        winnerName = winner.fullName || winner.email;
      }
    }

    return {
      status: item.status,
      currentPrice: parseInt(state.currentPrice, 10),
      winnerId: state.winnerId || '',
      winnerName,
      endTimeMs: parseInt(state.endTimeMs, 10),
      minStepPrice: parseInt(state.minStepPrice, 10) || item.auction?.minStepPrice || 10000,
      countdownDuration: Math.round(parseInt(state.countdownDuration, 10) / 1000) || item.auction?.countdownDuration || 30,
      isEnded: false,
    };
  }

  async placeManualBid(
    userId: string,
    auctionItemId: string,
    price: number,
    isAutoBid = false
  ) {
    // 1. Verify user exists
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // 2. Check E-Wallet balance
    const walletInfo = await this.walletsService.getWalletInfo(userId);
    if (!walletInfo || walletInfo.status !== EWalletStatus.ACTIVE) {
      throw new BadRequestException('Ví điện tử của bạn không hoạt động hoặc chưa được kích hoạt');
    }

    if (walletInfo.balance < price) {
      throw new BadRequestException(
        `Số dư ví điện tử không đủ (${walletInfo.balance.toLocaleString()} ₫). Cần tối thiểu ${price.toLocaleString()} ₫ để đặt giá này. Vui lòng nạp thêm tiền vào ví!`
      );
    }

    // 3. Ensure item is active in Redis
    await this.ensureAuctionItemActiveInRedis(auctionItemId);

    const redis = this.redisService.getClient();
    const key = `auction:${auctionItemId}:state`;
    const now = Date.now();

    const script = `
      local state = redis.call('hgetall', KEYS[1])
      if #state == 0 then return {"err", "Auction not active or found"} end
      
      local data = {}
      for i=1, #state, 2 do
          data[state[i]] = state[i+1]
      end
      
      local currentPrice = tonumber(data['currentPrice'])
      local minStep = tonumber(data['minStepPrice'])
      local endTimeMs = tonumber(data['endTimeMs'])
      local duration = tonumber(data['countdownDuration'])
      local winnerId = data['winnerId']
      local now = tonumber(ARGV[1])
      local bidPrice = tonumber(ARGV[2])
      local userId = ARGV[3]
      
      -- If there is already a bid placed and now > endTimeMs, auction has ended
      if winnerId ~= '' and now > endTimeMs then
         return {"err", "Phiên đấu giá đã kết thúc!"}
      end
      
      -- If no previous bid, must be at least currentPrice
      if winnerId == '' then
        if bidPrice < currentPrice then
           return {"err", "Giá đặt phải bằng hoặc lớn hơn giá khởi điểm (" .. currentPrice .. " ₫)"}
        end
      else
        if bidPrice < currentPrice + minStep then
           return {"err", "Giá đặt phải lớn hơn giá hiện tại tối thiểu " .. minStep .. " ₫"}
        end
      end
      
      local newEndTime = now + duration
      
      redis.call('hmset', KEYS[1], 'currentPrice', bidPrice, 'winnerId', userId, 'endTimeMs', newEndTime)
      
      return { "ok", 1, "currentPrice", bidPrice, "winnerId", userId, "endTimeMs", newEndTime, "countdownDuration", duration }
    `;

    const result = await redis.eval(script, 1, key, now, price, userId) as any;

    if (!result || result[0] === 'err') {
      throw new BadRequestException(result ? result[1] : 'Lỗi khi cập nhật giá');
    }

    const bidResult = {
      auctionItemId,
      currentPrice: Number(result[3]),
      winnerId: String(result[5]),
      winnerName: user.fullName || user.email,
      endTimeMs: Number(result[7]),
      countdownDuration: Math.round(Number(result[9]) / 1000) || 30
    };

    // Update current price & winner in DB
    await this.auctionItemRepo.update(auctionItemId, {
      currentPrice: bidResult.currentPrice,
      status: AuctionStatus.ACTIVE
    });

    // Trigger Auto-Bid calculation cascade asynchronously (only for manual bids)
    if (!isAutoBid) {
      this.triggerAutoBidCascade(auctionItemId).catch(err => this.logger.error('AutoBid Cascade Error', err));
    }

    return bidResult;
  }

  // Set Auto Bid configuration for a user with wallet check
  async setAutoBid(
    userId: string,
    auctionItemId: string,
    autoStepPrice: number,
    ceilingPrice: number,
    onBidUpdate?: (result: any) => void
  ) {
    const walletInfo = await this.walletsService.getWalletInfo(userId);
    if (!walletInfo || walletInfo.status !== EWalletStatus.ACTIVE) {
      throw new BadRequestException('Ví điện tử của bạn không hoạt động hoặc chưa được kích hoạt');
    }

    if (walletInfo.balance < ceilingPrice) {
      throw new BadRequestException(
        `Số dư ví điện tử không đủ (${walletInfo.balance.toLocaleString()} ₫) cho mức giá trần Auto-Bid (${ceilingPrice.toLocaleString()} ₫). Vui lòng nạp thêm tiền vào ví!`
      );
    }

    const redis = this.redisService.getClient();
    await this.ensureAuctionItemActiveInRedis(auctionItemId);

    // Save user's auto-bid config
    await redis.hset(`auction:${auctionItemId}:autobid:${userId}`, {
      step: autoStepPrice,
      ceiling: ceilingPrice
    });

    await redis.sadd(`auction:${auctionItemId}:autobidders`, userId);

    this.triggerAutoBidCascade(auctionItemId, onBidUpdate).catch(err => this.logger.error('AutoBid Cascade Error', err));

    return { status: 'success', message: 'Thiết lập Auto-Bid thành công' };
  }

  // Background process to cascade auto-bids
  async triggerAutoBidCascade(auctionItemId: string, onBidUpdate?: (result: any) => void) {
    const redis = this.redisService.getClient();

    let stable = false;
    let maxIterations = 50;

    while (!stable && maxIterations > 0) {
      stable = true;
      maxIterations--;

      const bidders = await redis.smembers(`auction:${auctionItemId}:autobidders`);
      if (!bidders || bidders.length === 0) break;

      const state = await redis.hgetall(`auction:${auctionItemId}:state`);
      if (!state || !state.currentPrice) break;

      const currentPrice = parseInt(state.currentPrice, 10);
      const winnerId = state.winnerId;

      for (const bidderId of bidders) {
        if (bidderId === winnerId) continue;

        const config = await redis.hgetall(`auction:${auctionItemId}:autobid:${bidderId}`);
        if (!config || !config.step) continue;

        const step = parseInt(config.step, 10);
        const ceiling = parseInt(config.ceiling, 10);

        const nextBidPrice = currentPrice + step;

        if (nextBidPrice <= ceiling) {
          try {
            const autoBidResult = await this.placeManualBid(bidderId, auctionItemId, nextBidPrice, true);
            if (onBidUpdate) {
              onBidUpdate(autoBidResult);
            }
            stable = false;
            break;
          } catch (e) {
            // Bid failed, continue
          }
        }
      }
    }
  }

  // End the auction item, deduct winner wallet, and sync back to DB
  async endAuctionItem(auctionItemId: string) {
    const redis = this.redisService.getClient();
    const key = `auction:${auctionItemId}:state`;
    const state = await redis.hgetall(key);

    const item = await this.auctionItemRepo.findOne({
      where: { id: auctionItemId },
      relations: ['auction', 'product', 'currentWinner']
    });

    if (!item || item.status === AuctionStatus.CLOSED) return null;

    const finalPrice = state?.currentPrice ? parseInt(state.currentPrice, 10) : Number(item.currentPrice || item.startPrice);
    const winnerId = state?.winnerId || item.currentWinner?.id;
    let winnerUser: User | null = null;

    if (winnerId) {
      winnerUser = await this.userRepo.findOne({ where: { id: winnerId } });
      if (winnerUser) {
        item.currentWinner = winnerUser;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
          // 1. Trừ tiền ví (có transaction queryRunner để lock)
          await this.walletsService.deductBalance(
            winnerId,
            finalPrice,
            item.id,
            queryRunner
          );
          this.logger.log(`Trừ ${finalPrice} ₫ từ ví của người thắng đấu giá ${winnerId} cho sản phẩm ${item.id}`);

          // 2. Trừ tồn kho sản phẩm
          await queryRunner.manager.decrement(Product, { id: item.product.id }, 'stock', 1);

          // 3. Tự động tạo hóa đơn/đơn hàng cho người dùng sau khi thanh toán thành công qua ví
          const order = queryRunner.manager.create(Order, {
            userId: winnerId,
            totalAmount: finalPrice,
            subTotal: finalPrice,
            walletDeductionAmount: finalPrice,
            status: EOrderStatus.PREPARING,
            paymentStatus: EPaymentStatus.PAID,
            paymentMethod: EPaymentMethod.WALLET,
            note: `Hóa đơn thanh toán tự động cho sản phẩm trúng đấu giá: ${item.product.name} (Phiên: ${item.auction?.title || item.auction?.id})`,
            statusHistory: [{
              status: EOrderStatus.PREPARING,
              updatedAt: new Date().toISOString(),
              updatedBy: 'system',
              note: 'Tạo đơn hàng tự động từ đấu giá'
            }]
          });
          const savedOrder = await queryRunner.manager.save(order);

          const orderItem = queryRunner.manager.create(OrderItem, {
            orderId: savedOrder.id,
            productId: item.product.id,
            productName: item.product.name,
            productImageUrl: item.product.imageUrl || '',
            price: finalPrice,
            quantity: 1
          });
          await queryRunner.manager.save(orderItem);

          await queryRunner.commitTransaction();
          this.logger.log(`Tạo hóa đơn/đơn hàng thành công cho người thắng ${winnerId}: Order ID ${savedOrder.id}`);

        } catch (walletErr) {
          await queryRunner.rollbackTransaction();
          this.logger.error(`Lỗi khi trừ tiền ví hoặc tạo hóa đơn người thắng ${winnerId}: ${walletErr.message}`);
        } finally {
          await queryRunner.release();
        }
      }
    }

    item.currentPrice = finalPrice;
    item.status = AuctionStatus.CLOSED;
    await this.auctionItemRepo.save(item);

    // Clear Redis
    await redis.del(key);

    return {
      item,
      winner: winnerUser,
      finalPrice,
    };
  }

  // Check and end auction if expired
  async checkAndEndAuctionItemIfExpired(auctionItemId: string) {
    const redis = this.redisService.getClient();
    const key = `auction:${auctionItemId}:state`;
    const state = await redis.hgetall(key);
    if (!state || !state.currentPrice) return null;

    const now = Date.now();
    const endTimeMs = parseInt(state.endTimeMs, 10);
    const winnerId = state.winnerId;

    if (winnerId && now >= endTimeMs) {
      return this.endAuctionItem(auctionItemId);
    }
    return null;
  }
}
