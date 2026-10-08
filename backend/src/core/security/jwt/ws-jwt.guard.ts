import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { ENV_VARS } from 'src/constants/env.constants';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = this.extractTokenFromHeader(client);
      
      if (!token) {
        throw new WsException('Vui lòng đăng nhập để thực hiện');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(ENV_VARS.JWT_ACCESS_SECRET),
      });

      (client as any).user = { id: payload.userId, version: payload.version };
      return true;
    } catch (error) {
      throw new WsException('Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    // 1. Try handshake auth payload (e.g. io(..., { auth: { token } }))
    const authPayloadToken = (client.handshake.auth as any)?.token;
    if (authPayloadToken) return authPayloadToken;

    // 2. Try Authorization header
    const authHeader = client.handshake.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // 3. Try query param
    const queryToken = (client.handshake.query as any)?.token;
    if (queryToken) return queryToken;

    // 4. Try to get from cookies
    const cookieHeader = client.handshake.headers?.cookie;
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, current) => {
        const [key, value] = current.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      
      if (cookies.accessToken) {
        return cookies.accessToken;
      }
    }
    
    return undefined;
  }
}
