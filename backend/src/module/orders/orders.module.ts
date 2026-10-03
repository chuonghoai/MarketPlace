import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrderTrackingController } from './order-tracking.controller';
import { OrdersService } from './orders.service';
import { Order } from '../checkout/entities/order.entity';
import { OrderItem } from '../checkout/entities/order-item.entity';
import { OrderReturnRequest } from './entities/order-return-request.entity';
import { MailModule } from '../mails/mail.module';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { CheckoutModule } from '../checkout/checkout.module';
import { WalletsModule } from '../wallets/wallets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      User,
      Product,
      OrderReturnRequest,
    ]),
    MailModule,
    CheckoutModule,
    WalletsModule,
  ],
  controllers: [OrdersController, OrderTrackingController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
