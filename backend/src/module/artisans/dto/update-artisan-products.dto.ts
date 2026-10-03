import { IsArray, IsString } from 'class-validator';

export class UpdateArtisanProductsDto {
  @IsArray()
  @IsString({ each: true })
  productIds: string[];
}
