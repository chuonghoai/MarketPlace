import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { AuctionsGateway } from './auctions.gateway';
import { Auction } from './entities/auction.entity';
import { AuctionItem } from './entities/auction-item.entity';
import { RedisModule } from '../redis/redis.module';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';

import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { WalletsModule } from '../wallets/wallets.module';
import { Order } from '../checkout/entities/order.entity';
import { OrderItem } from '../checkout/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, AuctionItem, Product, User, Order, OrderItem]),
    RedisModule,
    ProductsModule,
    AuthModule,
    WalletsModule,
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService, AuctionsGateway],
  exports: [AuctionsService]
})
export class AuctionsModule {}
