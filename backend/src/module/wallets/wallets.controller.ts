import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  Ip,
  BadRequestException,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from '../../core/security/jwt/jwt-auth.guard';
import { RolesGuard } from '../../core/security/roles/roles.guard';
import { Roles } from '../../core/security/roles/roles.decorator';
import { EUserRole } from '../users/enums/user.enum';
import {
  TopupWalletDto,
  CreateWithdrawalDto,
  CompleteWithdrawalDto,
  RejectWithdrawalDto,
} from './dto/wallet.dto';
import { EWalletWithdrawalStatus } from './enums/wallet.enum';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('me')
  async getMyWallet(@Req() req: any) {
    const data = await this.walletsService.getWalletInfo(req.user.id);
    return {
      success: true,
      message: 'Lấy thông tin ví thành công',
      data,
    };
  }

  @Post('topup')
  async topupWallet(@Req() req: any, @Body() dto: TopupWalletDto, @Ip() ip: string) {
    const ipAddr = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || ip || '127.0.0.1';
    const result = await this.walletsService.topup(
      req.user.id,
      dto.amount,
      dto.paymentMethod || 'DIRECT',
      ipAddr,
    );
    return {
      success: true,
      message: result.paymentRequired ? 'Tạo link nạp tiền thành công' : 'Nạp tiền vào ví thành công',
      data: result,
    };
  }

  @Get('vnpay/verify')
  async verifyVnpayTopup(@Req() req: any, @Query() query: any) {
    const isValid = this.walletsService.verifyVnpaySignature(query);
    if (!isValid) {
      throw new BadRequestException('Chữ ký xác thực thanh toán không hợp lệ');
    }

    if (query.vnp_ResponseCode !== '00') {
      return {
        success: false,
        message: 'Giao dịch nạp tiền qua VNPay không thành công hoặc đã bị hủy',
      };
    }

    const amount = Number(query.vnp_Amount) / 100;
    const txRef = query.vnp_TxnRef;

    const result = await this.walletsService.topup(
      req.user.id,
      amount,
      'DIRECT',
      '127.0.0.1',
      `Nạp tiền qua VNPay (${txRef})`,
    );

    return {
      success: true,
      message: 'Nạp tiền qua VNPay thành công',
      data: result,
    };
  }

  @Get('transactions')
  async getTransactions(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const data = await this.walletsService.getTransactions(
      req.user.id,
      Number(page) || 1,
      Number(limit) || 20,
    );
    return {
      success: true,
      message: 'Lấy lịch sử giao dịch thành công',
      data,
    };
  }

  // --- RÚT TIỀN PHÍA KHÁCH HÀNG (UC18) ---

  @Post('withdraw')
  async createWithdrawal(@Req() req: any, @Body() dto: CreateWithdrawalDto) {
    const result = await this.walletsService.createWithdrawal(req.user.id, dto);
    return result;
  }

  @Get('withdrawals/me')
  async getMyWithdrawals(@Req() req: any) {
    const data = await this.walletsService.getUserWithdrawals(req.user.id);
    return {
      success: true,
      message: 'Lấy danh sách yêu cầu rút tiền thành công',
      data,
    };
  }

  // --- QUẢN TRỊ DUYỆT RÚT TIỀN (ADMIN / STAFF - UC18) ---

  @Get('admin/withdrawals')
  @UseGuards(RolesGuard)
  @Roles(EUserRole.ADMIN, EUserRole.STAFF)
  async getAdminWithdrawals(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: EWalletWithdrawalStatus,
  ) {
    const data = await this.walletsService.getAdminWithdrawals(
      Number(page) || 1,
      Number(limit) || 20,
      status,
    );
    return {
      success: true,
      message: 'Lấy danh sách yêu cầu rút tiền thành công',
      data,
    };
  }

  @Patch('admin/withdrawals/:id/complete')
  @UseGuards(RolesGuard)
  @Roles(EUserRole.ADMIN, EUserRole.STAFF)
  async completeWithdrawal(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: CompleteWithdrawalDto,
  ) {
    const data = await this.walletsService.completeWithdrawal(id, req.user.id, dto);
    return {
      success: true,
      message: 'Hoàn tất yêu cầu rút tiền thành công',
      data,
    };
  }

  @Patch('admin/withdrawals/:id/reject')
  @UseGuards(RolesGuard)
  @Roles(EUserRole.ADMIN, EUserRole.STAFF)
  async rejectWithdrawal(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: RejectWithdrawalDto,
  ) {
    const data = await this.walletsService.rejectWithdrawal(id, req.user.id, dto);
    return {
      success: true,
      message: 'Từ chối yêu cầu rút tiền và hoàn trả số dư thành công',
      data,
    };
  }
}
