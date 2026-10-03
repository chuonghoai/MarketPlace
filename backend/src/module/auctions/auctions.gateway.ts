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
import { UseGuards } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/security/jwt/jwt-auth.guard';

@WebSocketGateway({
  namespace: 'auctions',
  cors: { origin: '*' }
})
export class AuctionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private readonly logger = new Logger(AuctionsGateway.name);

  constructor(private readonly auctionsService: AuctionsService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { auctionItemId: string }) {
    client.join(`auction:${data.auctionItemId}`);
    this.logger.log(`Client ${client.id} joined room auction:${data.auctionItemId}`);
    return { event: 'joined', data: { roomId: data.auctionItemId } };
  }

  @SubscribeMessage('placeBid')
  @UseGuards(JwtAuthGuard)
  async handlePlaceBid(
    @ConnectedSocket() client: Socket, 
    @MessageBody() data: { auctionItemId: string, price: number }
  ) {
    try {
      // client.user should be populated if a WsJwtAuthGuard is properly implemented.
      // Assuming user id is extracted from JWT to client.user or passed in data for now.
      const userId = (client as any).user?.id || (client.handshake as any).user?.id;
      if (!userId) {
         return { status: 'error', message: 'Unauthorized' };
      }
      
      const result = await this.auctionsService.placeManualBid(userId, data.auctionItemId, data.price);
      
      // Broadcast new state to all users in the room
      this.server.to(`auction:${data.auctionItemId}`).emit('bidUpdated', result);
      
      return { status: 'success', data: result };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
