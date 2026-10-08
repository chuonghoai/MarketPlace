import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportRequestsService } from './support-requests.service';
import { User } from '../users/entities/user.entity';
import { ENV_VARS } from '../../constants/env.constants';

@Injectable()
@WebSocketGateway({
  namespace: 'support',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class SupportGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SupportGateway.name);

  constructor(
    private readonly supportRequestsService: SupportRequestsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`[SupportGateway] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`[SupportGateway] Client disconnected: ${client.id}`);
  }

  private async resolveUser(client: Socket, data?: any): Promise<User | null> {
    if ((client as any).user?.id) {
      return (client as any).user;
    }

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
          const dbUser = await this.userRepo.findOne({ where: { id: payload.userId } });
          if (dbUser) {
            (client as any).user = dbUser;
            return dbUser;
          }
        }
      } catch (err: any) {
        this.logger.warn(`[SupportGateway] Token verify failed for client ${client.id}: ${err.message}`);
      }
    }

    const candidateUserId = data?.userId || (client.handshake.auth as any)?.userId;
    if (candidateUserId) {
      const dbUser = await this.userRepo.findOne({ where: { id: candidateUserId } });
      if (dbUser) {
        (client as any).user = dbUser;
        return dbUser;
      }
    }

    return null;
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { requestId: string },
  ) {
    if (!data?.requestId) {
      return { event: 'error', message: 'Missing requestId' };
    }
    const room = `support:${data.requestId}`;
    client.join(room);
    this.logger.log(`[SupportGateway] Client ${client.id} joined ${room}`);
    return { event: 'joined', data: { roomId: data.requestId } };
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { requestId: string },
  ) {
    if (!data?.requestId) {
      return { event: 'error', message: 'Missing requestId' };
    }
    const room = `support:${data.requestId}`;
    client.leave(room);
    this.logger.log(`[SupportGateway] Client ${client.id} left ${room}`);
    return { event: 'left', data: { roomId: data.requestId } };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { requestId: string; content: string; token?: string; userId?: string },
  ) {
    try {
      if (!data?.requestId || !data?.content?.trim()) {
        return { status: 'error', message: 'requestId and content are required' };
      }

      const user = await this.resolveUser(client, data);
      if (!user) {
        return { status: 'error', message: 'Unauthorized' };
      }

      const message = await this.supportRequestsService.addMessage(
        data.requestId,
        user,
        { content: data.content.trim() },
      );

      // Broadcast to all participants in this support ticket room
      this.server.to(`support:${data.requestId}`).emit('newMessage', message);

      return { status: 'success', data: message };
    } catch (error: any) {
      this.logger.error(`[SupportGateway] Error in sendMessage: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  broadcastNewMessage(requestId: string, message: any) {
    if (this.server) {
      this.server.to(`support:${requestId}`).emit('newMessage', message);
    }
  }

  broadcastRequestUpdate(requestId: string, request: any) {
    if (this.server) {
      this.server.to(`support:${requestId}`).emit('requestUpdated', request);
    }
  }
}
