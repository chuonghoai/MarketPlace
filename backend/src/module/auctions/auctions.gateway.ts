import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuctionsService } from './auctions.service';
import { User } from '../users/entities/user.entity';
import { ENV_VARS } from '../../constants/env.constants';

@WebSocketGateway({
  namespace: 'auctions',
  cors: { 
    origin: true,
    credentials: true
  }
})
export class AuctionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private readonly logger = new Logger(AuctionsGateway.name);
  private itemTimers = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly auctionsService: AuctionsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private async resolveUser(client: Socket, data?: any): Promise<{ id: string } | null> {
    if ((client as any).user?.id) {
      return (client as any).user;
    }

    // 1. Try token from data or handshake auth
    let token = data?.token || (client.handshake.auth as any)?.token;
    if (!token && client.handshake.headers?.authorization?.startsWith('Bearer ')) {
      token = client.handshake.headers.authorization.substring(7);
    }
    if (!token && (client.handshake.query as any)?.token) {
      token = (client.handshake.query as any).token;
    }
    if (!token && client.handshake.headers?.cookie) {
      const cookies = client.handshake.headers.cookie.split(';').reduce((acc, current) => {
        const [k, v] = current.trim().split('=');
        acc[k] = v;
        return acc;
      }, {} as Record<string, string>);
      if (cookies.accessToken) token = cookies.accessToken;
    }

    if (token) {
      try {
        const secret = this.configService.get<string>(ENV_VARS.JWT_ACCESS_SECRET);
        const payload = await this.jwtService.verifyAsync(token, { secret });
        if (payload?.userId) {
          (client as any).user = { id: payload.userId };
          return { id: payload.userId };
        }
      } catch (err) {
        this.logger.warn(`Token verification failed for client ${client.id}: ${err.message}`);
      }
    }

    // 2. Fallback: Candidate userId (for dev/test, validates against DB)
    const candidateUserId = data?.userId || (client.handshake.auth as any)?.userId;
    if (candidateUserId) {
      const dbUser = await this.userRepo.findOne({ where: { id: candidateUserId } });
      if (dbUser) {
        (client as any).user = { id: dbUser.id };
        return { id: dbUser.id };
      }
    }

    return null;
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { auctionItemId: string }) {
    if (!data?.auctionItemId) return { event: 'error', message: 'Missing auctionItemId' };

    client.join(`auction:${data.auctionItemId}`);
    this.logger.log(`Client ${client.id} joined room auction:${data.auctionItemId}`);
    
    try {
      const state = await this.auctionsService.getAuctionItemState(data.auctionItemId);
      client.emit('itemState', state);
      return { event: 'joined', data: { roomId: data.auctionItemId, state } };
    } catch (e) {
      return { event: 'joined', data: { roomId: data.auctionItemId } };
    }
  }

  @SubscribeMessage('getItemState')
  async handleGetItemState(@ConnectedSocket() client: Socket, @MessageBody() data: { auctionItemId: string }) {
    try {
      const state = await this.auctionsService.getAuctionItemState(data.auctionItemId);
      return { status: 'success', data: state };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  @SubscribeMessage('placeBid')
  async handlePlaceBid(
    @ConnectedSocket() client: Socket, 
    @MessageBody() data: { auctionItemId: string, price: number, userId?: string, token?: string }
  ) {
    try {
      this.logger.log(`placeBid: client=${client.id} item=${data?.auctionItemId} price=${data?.price}`);

      const user = await this.resolveUser(client, data);
      if (!user?.id) {
        return { status: 'error', message: 'Vui lòng đăng nhập để tham gia đấu giá' };
      }
      
      const result = await this.auctionsService.placeManualBid(
        user.id, 
        data.auctionItemId, 
        Number(data.price)
      );
      
      // ✅ Broadcast bid update to ALL users in the room (including sender)
      this.server.to(`auction:${data.auctionItemId}`).emit('bidUpdated', result);
      this.logger.log(`bidUpdated broadcast: item=${data.auctionItemId} price=${result.currentPrice}`);
      
      // ✅ Reset 30s server-side countdown
      this.scheduleItemCountdown(data.auctionItemId, result.countdownDuration || 30);
      
      // ✅ Trigger auto-bid cascade – any auto-bids are also broadcast
      this.auctionsService.triggerAutoBidCascade(data.auctionItemId, (autoBidResult) => {
        this.server.to(`auction:${data.auctionItemId}`).emit('bidUpdated', autoBidResult);
        this.scheduleItemCountdown(data.auctionItemId, autoBidResult.countdownDuration || 30);
        this.logger.log(`auto-bidUpdated broadcast: item=${data.auctionItemId} price=${autoBidResult.currentPrice}`);
      }).catch(err => this.logger.error('AutoBid Cascade Error:', err));
      
      return { status: 'success', data: result };
    } catch (error) {
      this.logger.error(`Error in handlePlaceBid: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  @SubscribeMessage('checkTimeout')
  async handleCheckTimeout(@ConnectedSocket() client: Socket, @MessageBody() data: { auctionItemId: string }) {
    try {
      const endResult = await this.auctionsService.checkAndEndAuctionItemIfExpired(data.auctionItemId);
      if (endResult) {
        this.server.to(`auction:${data.auctionItemId}`).emit('itemClosed', {
          auctionItemId: data.auctionItemId,
          status: 'CLOSED',
          winnerId: endResult.winner?.id,
          winnerName: endResult.winner?.fullName || endResult.winner?.email || 'Ẩn danh',
          finalPrice: endResult.finalPrice,
        });
        return { status: 'closed', data: endResult };
      }
      return { status: 'running' };
    } catch (e) {
      return { status: 'error', message: e.message };
    }
  }

  // ✅ Server-side countdown: resets on every new bid, closes auction when timer fires
  scheduleItemCountdown(auctionItemId: string, durationSeconds: number) {
    const existing = this.itemTimers.get(auctionItemId);
    if (existing) {
      clearTimeout(existing);
    }

    this.logger.log(`Countdown scheduled: item=${auctionItemId} duration=${durationSeconds}s`);

    const timer = setTimeout(async () => {
      try {
        const endResult = await this.auctionsService.endAuctionItem(auctionItemId);
        if (endResult) {
          this.logger.log(`Auction item CLOSED: ${auctionItemId}. Winner: ${endResult.winner?.id || 'None'}, Price: ${endResult.finalPrice}`);
          this.server.to(`auction:${auctionItemId}`).emit('itemClosed', {
            auctionItemId,
            status: 'CLOSED',
            winnerId: endResult.winner?.id,
            winnerName: endResult.winner?.fullName || endResult.winner?.email || 'Ẩn danh',
            finalPrice: endResult.finalPrice,
          });
        }
      } catch (err) {
        this.logger.error(`Error closing auction item ${auctionItemId}: ${err.message}`);
      } finally {
        this.itemTimers.delete(auctionItemId);
      }
    }, durationSeconds * 1000);

    this.itemTimers.set(auctionItemId, timer);
  }
}
