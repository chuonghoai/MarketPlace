import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from '../../core/security/jwt/jwt-auth.guard';
import { TopupWalletDto } from './dto/wallet.dto';

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
  async topupWallet(@Req() req: any, @Body() dto: TopupWalletDto) {
    const result = await this.walletsService.topup(req.user.id, dto.amount);
    return {
      success: true,
      message: 'Nạp tiền vào ví thành công',
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
}
