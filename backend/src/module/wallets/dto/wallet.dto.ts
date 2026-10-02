import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class TopupWalletDto {
  @IsNumber()
  @Min(1000, { message: 'Số tiền nạp tối thiểu là 1.000 ₫' })
  @IsNotEmpty({ message: 'Vui lòng nhập số tiền nạp' })
  amount: number;
}
