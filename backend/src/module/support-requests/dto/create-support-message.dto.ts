import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupportMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Nội dung tin nhắn không được để trống' })
  content: string;
}
