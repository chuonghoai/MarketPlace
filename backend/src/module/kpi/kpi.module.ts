import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportRequest } from '../support-requests/entities/support-request.entity';
import { Staff } from '../staffs/entities/staff.entity';
import { KpiService } from './kpi.service';
import { KpiController } from './kpi.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SupportRequest, Staff])],
  controllers: [KpiController],
  providers: [KpiService],
  exports: [KpiService],
})
export class KpiModule {}
