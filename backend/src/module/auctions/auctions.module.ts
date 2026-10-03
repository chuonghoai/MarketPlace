import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { AuctionsGateway } from './auctions.gateway';
import { Auction } from './entities/auction.entity';
import { AuctionItem } from './entities/auction-item.entity';
import { RedisModule } from '../redis/redis.module';
import { ProductsModule } from '../products/products.module';

import { Product } from '../products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, AuctionItem, Product]),
    RedisModule,
    ProductsModule
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService, AuctionsGateway]
})
export class AuctionsModule {}
