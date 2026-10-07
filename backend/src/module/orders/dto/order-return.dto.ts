import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EOrderReturnType } from '../enums/order-return.enum';

export class CreateOrderReturnDto {
  @IsEnum(EOrderReturnType, { message: 'Mục đích yêu cầu phải là EXCHANGE (Đổi món mới) hoặc RETURN_REFUND (Trả hàng hoàn tiền)' })
  @IsNotEmpty({ message: 'Vui lòng chọn mục đích yêu cầu' })
  type: EOrderReturnType;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập tiêu đề yêu cầu' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập nội dung/lý do chi tiết' })
  reason: string;

  @IsOptional()
  @IsArray()
  proofImages?: string[];

  @IsOptional()
  @IsArray()
  proofVideos?: string[];

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  bankAccountNumber?: string;

  @IsOptional()
  @IsString()
  bankAccountHolder?: string;
}

export class AdminProcessReturnDto {
  @IsOptional()
  @IsString()
  adminNote?: string;
}

export class AdminProcessRefundDto {
  @IsOptional()
  @IsString()
  adminNote?: string;

  @IsOptional()
  @IsString()
  refundProofUrl?: string;
}

export class AdminProcessExchangeDto {
  @IsOptional()
  @IsString()
  recipientName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  adminNote?: string;
}
