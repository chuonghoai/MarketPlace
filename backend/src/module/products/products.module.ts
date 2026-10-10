import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Favorite } from './entities/favorite.entity';
import { Category } from '../categories/entities/category.entity';
import { Artisan } from '../artisans/entities/artisan.entity';
import { MediaModule } from '../media/media.module';
import { OpensearchModule } from '../opensearch/opensearch.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Favorite, Category, Artisan]),
    MediaModule,
    OpensearchModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
