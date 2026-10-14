import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ESupportRequestStatus } from '../enums/support-request-status.enum';

export class SupportRequestQueryDto {
  @IsOptional()
  @IsEnum(ESupportRequestStatus, { message: 'Trạng thái không hợp lệ' })
  status?: ESupportRequestStatus;

  @IsOptional()
  @IsString()
  assignedStaffId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 10;
}
