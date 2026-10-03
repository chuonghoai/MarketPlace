import { Module } from '@nestjs/common';
import { ArtisansService } from './artisans.service';
import { ArtisansController } from './artisans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artisan } from './entities/artisan.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artisan, Product])],
  controllers: [ArtisansController],
  providers: [ArtisansService],
})
export class ArtisansModule {}
