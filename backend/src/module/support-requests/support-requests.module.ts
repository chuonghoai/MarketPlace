import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportRequest } from './entities/support-request.entity';
import { SupportRequestMessage } from './entities/support-request-message.entity';
import { Staff } from '../staffs/entities/staff.entity';
import { User } from '../users/entities/user.entity';
import { SupportRequestsService } from './support-requests.service';
import { SupportRequestsController } from './support-requests.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupportRequest,
      SupportRequestMessage,
      Staff,
      User,
    ]),
  ],
  controllers: [SupportRequestsController],
  providers: [SupportRequestsService],
  exports: [SupportRequestsService, TypeOrmModule],
})
export class SupportRequestsModule {}
