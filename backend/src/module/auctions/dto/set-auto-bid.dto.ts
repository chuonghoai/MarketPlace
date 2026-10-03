import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class SetAutoBidDto {
  @IsNotEmpty()
  auctionItemId: string;

  @IsNumber()
  @Min(1000)
  ceilingPrice: number;

  @IsNumber()
  @Min(1000)
  autoStepPrice: number;
}
