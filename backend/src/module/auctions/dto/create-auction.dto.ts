import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';

export class AuctionItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1000)
  startPrice: number;
}

export class CreateAuctionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsInt()
  @Min(5)
  countdownDuration: number;

  @IsNumber()
  @Min(1000)
  minStepPrice: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AuctionItemDto)
  auctionItems: AuctionItemDto[];
}
