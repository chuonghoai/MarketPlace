import { Controller, Get, Param, Patch, Body, Query, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetOrdersFilterDto, UpdateOrderStatusDto } from './dto/orders.dto';
import { AdminProcessExchangeDto, AdminProcessReturnDto } from './dto/order-return.dto';
import { EOrderReturnStatus } from './enums/order-return.enum';
import { JwtAuthGuard } from '../../core/security/jwt/jwt-auth.guard';
import { RolesGuard } from '../../core/security/roles/roles.guard';
import { Roles } from '../../core/security/roles/roles.decorator';
import { EUserRole } from '../users/enums/user.enum';
import { ApiResponse } from '../../core/dto/ApiResponse.dto';

@Controller('admin/order')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(EUserRole.ADMIN, EUserRole.STAFF)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrdersByStatus(@Query() filterDto: GetOrdersFilterDto) {
    const data = await this.ordersService.getOrdersByStatus(filterDto);
    return new ApiResponse(true, 'Lấy danh sách đơn hàng thành công', data);
  }

  @Get('status-count')
  async getOrderStatusCounts() {
    const data = await this.ordersService.getOrderStatusCounts();
    return new ApiResponse(true, 'Lấy thống kê trạng thái đơn hàng thành công', data);
  }

  // Quản lý hoàn trả, đổi hàng (UC23)

  @Get('return-requests')
  async getReturnRequests(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: EOrderReturnStatus,
  ) {
    const data = await this.ordersService.getAdminReturnRequests(Number(page) || 1, Number(limit) || 20, status);
    return new ApiResponse(true, 'Lấy danh sách yêu cầu đổi trả thành công', data);
  }

  @Patch('return-requests/:id/exchange')
  async processExchange(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: AdminProcessExchangeDto,
  ) {
    const data = await this.ordersService.adminProcessExchange(id, req.user.id, dto);
    return new ApiResponse(true, 'Xử lý đổi đơn hàng mới thành công', data);
  }

  @Patch('return-requests/:id/pickup')
  async processPickup(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { step: 'PICKING_UP' | 'RECEIVED'; note?: string },
  ) {
    const data = await this.ordersService.adminProcessPickupStep(id, body.step, req.user.id, body.note);
    return new ApiResponse(true, 'Cập nhật tiến trình lấy hàng thành công', data);
  }

  @Patch('return-requests/:id/refund')
  async processRefund(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { note?: string },
  ) {
    const data = await this.ordersService.adminProcessRefund(id, req.user.id, body?.note);
    return new ApiResponse(true, 'Hoàn tiền vào ví điện tử của khách hàng thành công', data);
  }

  @Get(':id')
  async getOrderDetailById(@Param('id') id: string) {
    const data = await this.ordersService.getOrderDetailById(id);
    return new ApiResponse(true, 'Lấy chi tiết đơn hàng thành công', data);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ) {
    const data = await this.ordersService.updateOrderStatus(id, updateDto);
    return new ApiResponse(true, 'Cập nhật trạng thái đơn hàng thành công', data);
  }
}
