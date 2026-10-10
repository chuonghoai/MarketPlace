import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { JwtAuthGuard } from '../../core/security/jwt/jwt-auth.guard';
import { RolesGuard } from '../../core/security/roles/roles.guard';
import { Roles } from '../../core/security/roles/roles.decorator';
import { EUserRole } from '../users/enums/user.enum';
import { User } from '../users/entities/user.entity';
import { KpiQueryDto } from './dto/kpi-query.dto';
import { ApiResponse } from '../../core/dto/ApiResponse.dto';

interface RequestWithUser {
  user: User;
}

@Controller('kpi')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Get('staffs')
  @Roles(EUserRole.ADMIN)
  async getStaffsKpi(@Query() query: KpiQueryDto) {
    const result = await this.kpiService.getStaffKpi(query);
    const response = new ApiResponse(
      true,
      'Lấy thống kê KPI nhân viên thành công',
      result,
    );
    response.pagination = result.pagination;
    return response;
  }

  @Get('staffs/me')
  @Roles(EUserRole.STAFF)
  async getMyKpi(@Req() req: RequestWithUser, @Query() query: KpiQueryDto) {
    const result = await this.kpiService.getMyKpi(req.user.id, query);
    const response = new ApiResponse(
      true,
      'Lấy KPI cá nhân thành công',
      result,
    );
    response.pagination = result.pagination;
    return response;
  }
}
