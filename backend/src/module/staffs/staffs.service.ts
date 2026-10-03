import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { User } from '../users/entities/user.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffQueryDto } from './dto/staff-query.dto';
import { EUserRole } from '../users/enums/user.enum';
import { CustomException } from 'src/core/exceptions/custom.exception';
import { ApiResponse } from 'src/core/dto/ApiResponse.dto';
import { MailService } from '../mails/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffsService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  private generatePassword(): string {
    return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  }

  async create(createStaffDto: CreateStaffDto): Promise<ApiResponse<Staff>> {
    const { fullName, email, phone, salary, avatarUrl } = createStaffDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new CustomException(HttpStatus.BAD_REQUEST, 'EMAIL_EXISTED', 'Email đã tồn tại trong hệ thống');
    }

    const password = this.generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    const finalAvatarUrl = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`;

    const user = this.userRepository.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: EUserRole.STAFF,
      avatarUrl: finalAvatarUrl,
    });
    const savedUser = await this.userRepository.save(user);

    const staff = this.staffRepository.create({
      user: savedUser,
      salary,
    });
    const savedStaff = await this.staffRepository.save(staff);

    await this.mailService.sendStaffAccountMail({
      email,
      fullName,
      password,
      phone,
      salary,
    });

    return new ApiResponse(true, 'Tạo nhân viên thành công', savedStaff);
  }

  async findAll(query: StaffQueryDto): Promise<ApiResponse<any>> {
    const { search, page, limit } = query;
    const pageNumber = page || 1;
    const sizeNumber = limit || 20;
    const skip = (pageNumber - 1) * sizeNumber;

    const queryBuilder = this.staffRepository
      .createQueryBuilder('staff')
      .leftJoinAndSelect('staff.user', 'user')
      .where('user.role = :role', { role: EUserRole.STAFF });

    if (search) {
      queryBuilder.andWhere(
        '(user.fullName LIKE :search OR user.email LIKE :search OR user.phone LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [staffs, totalItems] = await queryBuilder
      .skip(skip)
      .take(sizeNumber)
      .orderBy('staff.createdAt', 'DESC')
      .getManyAndCount();

    const response = new ApiResponse(true, 'Lấy danh sách thành công', staffs);
    response.pagination = {
      page: pageNumber,
      pageSize: sizeNumber,
      totalItems,
      totalPages: Math.ceil(totalItems / sizeNumber),
    };

    return response;
  }

  async findOne(id: string): Promise<ApiResponse<Staff>> {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!staff) {
      throw new CustomException(HttpStatus.NOT_FOUND, 'STAFF_NOT_FOUND', 'Không tìm thấy nhân viên');
    }

    return new ApiResponse(true, 'Lấy thông tin nhân viên thành công', staff);
  }

  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<ApiResponse<Staff>> {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!staff) {
      throw new CustomException(HttpStatus.NOT_FOUND, 'STAFF_NOT_FOUND', 'Không tìm thấy nhân viên');
    }

    const { fullName, email, phone, salary, avatarUrl } = updateStaffDto;

    if (email && email !== staff.user.email) {
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new CustomException(HttpStatus.BAD_REQUEST, 'EMAIL_EXISTED', 'Email đã tồn tại trong hệ thống');
      }
      staff.user.email = email;
    }

    if (fullName) staff.user.fullName = fullName;
    if (phone) staff.user.phone = phone;
    if (avatarUrl !== undefined) staff.user.avatarUrl = avatarUrl;
    if (salary !== undefined) staff.salary = salary;

    const password = this.generatePassword();
    staff.user.password = await bcrypt.hash(password, 10);

    await this.userRepository.save(staff.user);
    const updatedStaff = await this.staffRepository.save(staff);

    await this.mailService.sendStaffAccountMail({
      email: staff.user.email,
      fullName: staff.user.fullName,
      password,
      phone: staff.user.phone,
      salary: staff.salary,
    });

    return new ApiResponse(true, 'Cập nhật nhân viên thành công', updatedStaff);
  }
}
