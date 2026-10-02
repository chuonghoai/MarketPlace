import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class TopupWalletDto {
  @IsNumber()
  @Min(1000, { message: 'Số tiền nạp tối thiểu là 1.000 ₫' })
  @IsNotEmpty({ message: 'Vui lòng nhập số tiền nạp' })
  amount: number;

  @IsOptional()
  @IsString()
  paymentMethod?: 'DIRECT' | 'VNPAY';
}

export class CreateWithdrawalDto {
  @IsNumber()
  @Min(10000, { message: 'Số tiền rút tối thiểu là 10.000 ₫' })
  @IsNotEmpty({ message: 'Vui lòng nhập số tiền muốn rút' })
  amount: number;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập tên ngân hàng' })
  bankName: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập số tài khoản' })
  accountNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập tên chủ tài khoản' })
  accountHolder: string;
}

export class CompleteWithdrawalDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng đính kèm đường dẫn hóa đơn chuyển khoản' })
  billProofUrl: string;

  @IsOptional()
  @IsString()
  adminNote?: string;
}

export class RejectWithdrawalDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập lý do từ chối yêu cầu rút tiền' })
  reason: string;
}
