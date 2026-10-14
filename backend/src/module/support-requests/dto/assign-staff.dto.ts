import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignStaffDto {
  @IsUUID('4', { message: 'Mã nhân viên (staffId) không đúng định dạng UUID' })
  @IsNotEmpty({ message: 'Mã nhân viên không được để trống' })
  staffId: string;
}
