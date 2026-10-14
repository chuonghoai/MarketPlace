import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffQueryDto } from './dto/staff-query.dto';
import { Roles } from 'src/core/security/roles/roles.decorator';
import { EUserRole } from '../users/enums/user.enum';
import { JwtAuthGuard } from 'src/core/security/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/core/security/roles/roles.guard';

@Controller('staffs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(EUserRole.ADMIN)
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @Post()
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffsService.create(createStaffDto);
  }

  @Get()
  findAll(@Query() query: StaffQueryDto) {
    return this.staffsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffsService.update(id, updateStaffDto);
  }
}
