import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateArtisanDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
