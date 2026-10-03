import { Controller, Post, Body, Param, Patch, UseGuards, Req, Get } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { SetAutoBidDto } from './dto/set-auto-bid.dto';
import { JwtAuthGuard } from '../../core/security/jwt/jwt-auth.guard';
import { RolesGuard } from '../../core/security/roles/roles.guard';
import { Roles } from '../../core/security/roles/roles.decorator';
import { EUserRole } from '../users/enums/user.enum';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.ADMIN, EUserRole.STAFF)
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.createAuction(createAuctionDto);
  }

  @Get()
  findAll() {
    return this.auctionsService.findAllAuctions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionsService.findOneAuction(id);
  }

  @Get('items/:itemId/state')
  getItemState(@Param('itemId') itemId: string) {
    return this.auctionsService.getAuctionItemState(itemId);
  }

  @Patch(':itemId/start')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.ADMIN, EUserRole.STAFF)
  startItem(@Param('itemId') itemId: string) {
    return this.auctionsService.startAuctionItem(itemId);
  }

  @Post('auto-bid')
  @UseGuards(JwtAuthGuard)
  setAutoBid(@Req() req: any, @Body() dto: SetAutoBidDto) {
    // req.user is injected by JwtAuthGuard
    return this.auctionsService.setAutoBid(req.user.id, dto.auctionItemId, dto.autoStepPrice, dto.ceilingPrice);
  }
}
