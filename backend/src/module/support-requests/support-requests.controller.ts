import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SupportRequestsService } from './support-requests.service';
import { SupportGateway } from './support.gateway';
import { JwtAuthGuard } from '../../core/security/jwt/jwt-auth.guard';
import { RolesGuard } from '../../core/security/roles/roles.guard';
import { Roles } from '../../core/security/roles/roles.decorator';
import { EUserRole } from '../users/enums/user.enum';
import { User } from '../users/entities/user.entity';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { CreateSupportMessageDto } from './dto/create-support-message.dto';
import { AssignStaffDto } from './dto/assign-staff.dto';
import { SupportRequestQueryDto } from './dto/support-request-query.dto';
import { ApiResponse } from '../../core/dto/ApiResponse.dto';

interface RequestWithUser {
  user: User;
}

@Controller('support-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportRequestsController {
  constructor(
    private readonly supportRequestsService: SupportRequestsService,
    private readonly supportGateway: SupportGateway,
  ) {}

  @Post()
  @Roles(EUserRole.USER, EUserRole.SELLER, EUserRole.ADMIN)
  async create(
    @Req() req: RequestWithUser,
    @Body() dto: CreateSupportRequestDto,
  ) {
    const data = await this.supportRequestsService.create(req.user, dto);
    return new ApiResponse(true, 'Tạo yêu cầu hỗ trợ thành công', data);
  }

  @Get('my')
  @Roles(EUserRole.USER, EUserRole.SELLER, EUserRole.ADMIN, EUserRole.STAFF)
  async getMyRequests(
    @Req() req: RequestWithUser,
    @Query() query: SupportRequestQueryDto,
  ) {
    const result = await this.supportRequestsService.findMyRequests(
      req.user.id,
      query,
    );
    const res = new ApiResponse(
      true,
      'Lấy danh sách yêu cầu của tôi thành công',
      result.items,
    );
    res.pagination = {
      page: Number(query.page) || 1,
      pageSize: Number(query.pageSize) || 10,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    };
    return res;
  }

  @Get('assigned')
  @Roles(EUserRole.STAFF)
  async getAssignedRequests(
    @Req() req: RequestWithUser,
    @Query() query: SupportRequestQueryDto,
  ) {
    const result = await this.supportRequestsService.findAssignedRequests(
      req.user.id,
      query,
    );
    const res = new ApiResponse(
      true,
      'Lấy danh sách yêu cầu được phân công thành công',
      result.items,
    );
    res.pagination = {
      page: Number(query.page) || 1,
      pageSize: Number(query.pageSize) || 10,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    };
    return res;
  }

  @Get()
  @Roles(EUserRole.ADMIN)
  async getAll(@Query() query: SupportRequestQueryDto) {
    const result = await this.supportRequestsService.findAll(query);
    const res = new ApiResponse(
      true,
      'Lấy tất cả yêu cầu hỗ trợ thành công',
      result.items,
    );
    res.pagination = {
      page: Number(query.page) || 1,
      pageSize: Number(query.pageSize) || 10,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    };
    return res;
  }

  @Get(':id')
  async getOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    const data = await this.supportRequestsService.findOne(id, req.user);
    return new ApiResponse(
      true,
      'Lấy chi tiết yêu cầu hỗ trợ thành công',
      data,
    );
  }

  @Patch(':id/assign')
  @Roles(EUserRole.ADMIN)
  async assignStaff(@Param('id') id: string, @Body() dto: AssignStaffDto) {
    const data = await this.supportRequestsService.assignStaff(id, dto.staffId);
    this.supportGateway.broadcastRequestUpdate(id, data);
    return new ApiResponse(true, 'Phân công nhân viên xử lý thành công', data);
  }

  @Post(':id/messages')
  async addMessage(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: CreateSupportMessageDto,
  ) {
    const data = await this.supportRequestsService.addMessage(
      id,
      req.user,
      dto,
    );
    this.supportGateway.broadcastNewMessage(id, data);
    if ((data as any)?.updatedRequest) {
      this.supportGateway.broadcastRequestUpdate(id, (data as any).updatedRequest);
    }
    return new ApiResponse(true, 'Gửi tin nhắn thành công', data);
  }

  @Patch(':id/resolve')
  @Roles(EUserRole.STAFF, EUserRole.ADMIN)
  async resolve(@Req() req: RequestWithUser, @Param('id') id: string) {
    const data = await this.supportRequestsService.resolve(id, req.user);
    this.supportGateway.broadcastRequestUpdate(id, data);
    return new ApiResponse(true, 'Đánh dấu đã giải quyết thành công', data);
  }

  @Patch(':id/close')
  async close(@Req() req: RequestWithUser, @Param('id') id: string) {
    const data = await this.supportRequestsService.close(id, req.user);
    this.supportGateway.broadcastRequestUpdate(id, data);
    return new ApiResponse(true, 'Đóng yêu cầu hỗ trợ thành công', data);
  }
}
