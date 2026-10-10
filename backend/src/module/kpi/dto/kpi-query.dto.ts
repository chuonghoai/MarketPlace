import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class KpiQueryDto {
  @IsNotEmpty({ message: 'startDate là bắt buộc (định dạng YYYY-MM-DD)' })
  @IsDateString(
    {},
    { message: 'startDate phải là định dạng ngày hợp lệ (YYYY-MM-DD)' },
  )
  startDate: string;

  @IsNotEmpty({ message: 'endDate là bắt buộc (định dạng YYYY-MM-DD)' })
  @IsDateString(
    {},
    { message: 'endDate phải là định dạng ngày hợp lệ (YYYY-MM-DD)' },
  )
  endDate: string;

  @IsOptional()
  @IsString()
  staffId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;
}
