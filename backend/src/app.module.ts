import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './module/auth/auth.module';
import { ProductsModule } from './module/products/products.module';
import { CategoriesModule } from './module/categories/categories.module';
import { CartModule } from './module/cart/cart.module';
import { ReviewsModule } from './module/reviews/reviews.module';
import { CustomThrottlerGuard } from './core/security/throttler/custom-throttler.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './module/users/users.module';
import { CheckoutModule } from './module/checkout/checkout.module';
import { AdminsModule } from './module/admins/admins.module';
import { StaffsModule } from './module/staffs/staffs.module';
import { SellersModule } from './module/sellers/sellers.module';
import { DashboardModule } from './module/admin-dashboard/dashboard.module';
import { MediaModule } from './module/media/media.module';
import { OrdersModule } from './module/orders/orders.module';
import { VouchersModule } from './module/vouchers/vouchers.module';
import { OpensearchModule } from './module/opensearch/opensearch.module';
import { RedisModule } from './module/redis/redis.module';
import { ENV_VARS } from './constants/env.constants';
import * as path from 'path';

const activeEnv = process.env.APP_ENV;
if (!activeEnv) {
  throw new Error('APP_ENV environment variable is required (must be "dev" or "prod")');
}
const targetEnvFile = activeEnv === 'prod' ? '.env.prod' : '.env.dev';

const resolvedEnvPaths = [
  path.resolve(process.cwd(), targetEnvFile),
  path.resolve(process.cwd(), 'backend', targetEnvFile),
  path.resolve(__dirname, '..', targetEnvFile),
];

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 6,
      },
    ]),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolvedEnvPaths,
      expandVariables: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isSsl = config.get<string>(ENV_VARS.DB_SSL) === 'true';
        const dbHost = config.get<string>(ENV_VARS.DB_HOST);
        if (!dbHost) throw new Error('DB_HOST environment variable is required');
        const dbPort = config.get<number>(ENV_VARS.DB_PORT);
        if (!dbPort) throw new Error('DB_PORT environment variable is required');
        const dbUser = config.get<string>(ENV_VARS.DB_USER);
        if (!dbUser) throw new Error('DB_USER environment variable is required');
        const dbPass = config.get<string>(ENV_VARS.DB_PASS);
        if (!dbPass) throw new Error('DB_PASS environment variable is required');
        const dbName = config.get<string>(ENV_VARS.DB_NAME);
        if (!dbName) throw new Error('DB_NAME environment variable is required');

        return {
          type: 'mysql',
          host: dbHost,
          port: Number(dbPort),
          username: dbUser,
          password: dbPass,
          database: dbName,
          autoLoadEntities: true,
          synchronize: true,
          ssl: isSsl ? { rejectUnauthorized: false } : false,
        };
      },
    }),

    AuthModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    ReviewsModule,
    UsersModule,
    CheckoutModule,
    SellersModule,
    AdminsModule,
    StaffsModule,
    DashboardModule,
    MediaModule,
    OrdersModule,
    VouchersModule,
    OpensearchModule,
    RedisModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule { }
