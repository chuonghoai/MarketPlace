import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { StaffsController } from './staffs.controller';
import { StaffsService } from './staffs.service';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mails/mail.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, User]), UsersModule, MailModule],
  controllers: [StaffsController],
  providers: [StaffsService],
  exports: [StaffsService],
})
export class StaffsModule {}
