import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ENV_VARS } from 'src/constants/env.constants';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../module/users/entities/user.entity';
import { UserDevice } from '../../../module/users/entities/user-device.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserDevice) private userDeviceRepo: Repository<UserDevice>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.accessToken || null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get<string>(ENV_VARS.JWT_ACCESS_SECRET) as string,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({ where: { id: payload.userId } });

    if (!user || user.tokenVersion !== payload.version) {
      throw new UnauthorizedException('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
    }

    if (payload.deviceId && payload.deviceId !== 'unknown-device') {
      const device = await this.userDeviceRepo.findOne({
        where: { deviceId: payload.deviceId, user: { id: payload.userId } }
      });
      if (device && !device.isActive) {
        throw new UnauthorizedException('Phiên đăng nhập trên thiết bị này đã bị thu hồi');
      }
    }

    return user;
  }
}