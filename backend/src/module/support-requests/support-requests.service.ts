import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SupportRequest } from './entities/support-request.entity';
import { SupportRequestMessage } from './entities/support-request-message.entity';
import { Staff } from '../staffs/entities/staff.entity';
import { User } from '../users/entities/user.entity';
import { ESupportRequestStatus } from './enums/support-request-status.enum';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { CreateSupportMessageDto } from './dto/create-support-message.dto';
import { SupportRequestQueryDto } from './dto/support-request-query.dto';
import { EUserRole } from '../users/enums/user.enum';

@Injectable()
export class SupportRequestsService {
  constructor(
    @InjectRepository(SupportRequest)
    private readonly requestRepo: Repository<SupportRequest>,
    @InjectRepository(SupportRequestMessage)
    private readonly messageRepo: Repository<SupportRequestMessage>,
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Optional()
    private readonly dataSource?: DataSource,
  ) {}

  async getStaffByUserId(userId: string): Promise<Staff | null> {
    let staff = await this.staffRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!staff) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (user && (user.role === EUserRole.STAFF || user.role === EUserRole.ADMIN)) {
        staff = this.staffRepo.create({
          user,
        });
        staff = await this.staffRepo.save(staff);
      }
    }

    return staff;
  }

  async create(
    user: User,
    dto: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    const request = this.requestRepo.create({
      title: dto.title,
      content: dto.content,
      requesterId: user.id,
      status: ESupportRequestStatus.OPEN,
    });

    const savedRequest = await this.requestRepo.save(request);

    // Lưu tin nhắn mở đầu từ requester
    const initialMessage = this.messageRepo.create({
      requestId: savedRequest.id,
      senderId: user.id,
      content: dto.content,
    });
    await this.messageRepo.save(initialMessage);

    return savedRequest;
  }

  async findMyRequests(
    userId: string,
    query: SupportRequestQueryDto,
  ): Promise<{
    items: SupportRequest[];
    totalItems: number;
    totalPages: number;
  }> {
    const { page = 1, pageSize = 10, status } = query;
    const qb = this.requestRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.assignedStaff', 'staff')
      .leftJoinAndSelect('staff.user', 'staffUser')
      .where('r.requesterId = :userId', { userId });

    if (status) {
      qb.andWhere('r.status = :status', { status });
    }

    qb.orderBy('r.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, totalItems] = await qb.getManyAndCount();
    return {
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  async findAssignedRequests(
    userId: string,
    query: SupportRequestQueryDto,
  ): Promise<{
    items: SupportRequest[];
    totalItems: number;
    totalPages: number;
  }> {
    const staff = await this.getStaffByUserId(userId);
    if (!staff) {
      return {
        items: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    const { page = 1, pageSize = 10, status } = query;
    const qb = this.requestRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.requester', 'requester')
      .where('r.assignedStaffId = :staffId', { staffId: staff.id });

    if (status) {
      qb.andWhere('r.status = :status', { status });
    }

    qb.orderBy('r.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, totalItems] = await qb.getManyAndCount();
    return {
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  async findAll(query: SupportRequestQueryDto): Promise<{
    items: SupportRequest[];
    totalItems: number;
    totalPages: number;
  }> {
    const { page = 1, pageSize = 10, status, assignedStaffId } = query;
    const qb = this.requestRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.requester', 'requester')
      .leftJoinAndSelect('r.assignedStaff', 'staff')
      .leftJoinAndSelect('staff.user', 'staffUser');

    if (status) {
      qb.andWhere('r.status = :status', { status });
    }

    if (assignedStaffId) {
      qb.andWhere('r.assignedStaffId = :assignedStaffId', { assignedStaffId });
    }

    qb.orderBy('r.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, totalItems] = await qb.getManyAndCount();
    return {
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  async findOne(
    id: string,
    user: { id: string; role: EUserRole },
  ): Promise<SupportRequest> {
    const request = await this.requestRepo.findOne({
      where: { id },
      relations: [
        'requester',
        'assignedStaff',
        'assignedStaff.user',
        'messages',
        'messages.sender',
      ],
      order: {
        messages: {
          createdAt: 'ASC',
        },
      },
    });

    if (!request) {
      throw new NotFoundException(`Không tìm thấy yêu cầu hỗ trợ #${id}`);
    }

    // Kiểm tra quyền
    if (user.role === EUserRole.ADMIN) {
      return request;
    }

    if (user.role === EUserRole.USER || user.role === EUserRole.SELLER) {
      if (request.requesterId !== user.id) {
        throw new ForbiddenException(
          'Bạn không có quyền xem yêu cầu hỗ trợ này',
        );
      }
      return request;
    }

    if (user.role === EUserRole.STAFF) {
      const staff = await this.getStaffByUserId(user.id);
      if (!staff || request.assignedStaffId !== staff.id) {
        throw new ForbiddenException(
          'Bạn không được phân công xử lý yêu cầu hỗ trợ này',
        );
      }
      return request;
    }

    throw new ForbiddenException('Quyền hạn không hợp lệ');
  }

  async assignStaff(
    requestId: string,
    staffId: string,
  ): Promise<SupportRequest> {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
    });
    if (!request) {
      throw new NotFoundException(
        `Không tìm thấy yêu cầu hỗ trợ #${requestId}`,
      );
    }

    if (request.status === ESupportRequestStatus.CLOSED) {
      throw new BadRequestException(
        'Không thể phân công nhân viên cho yêu cầu đã đóng',
      );
    }

    const staff = await this.staffRepo.findOne({
      where: { id: staffId },
      relations: ['user'],
    });
    if (!staff) {
      throw new NotFoundException(`Không tìm thấy nhân viên với ID ${staffId}`);
    }

    request.assignedStaffId = staff.id;
    request.assignedAt = new Date();
    request.status = ESupportRequestStatus.ASSIGNED;

    return this.requestRepo.save(request);
  }

  async addMessage(
    requestId: string,
    user: { id: string; role: EUserRole },
    dto: CreateSupportMessageDto,
  ): Promise<SupportRequestMessage> {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: ['assignedStaff', 'assignedStaff.user'],
    });

    if (!request) {
      throw new NotFoundException(
        `Không tìm thấy yêu cầu hỗ trợ #${requestId}`,
      );
    }

    if (request.status === ESupportRequestStatus.CLOSED) {
      throw new BadRequestException(
        'Yêu cầu hỗ trợ đã đóng, không thể gửi thêm tin nhắn',
      );
    }

    let isAssignedStaff = false;

    if (user.role === EUserRole.ADMIN) {
      // Admin luôn có quyền gửi tin nhắn
    } else if (user.role === EUserRole.USER || user.role === EUserRole.SELLER) {
      if (request.requesterId !== user.id) {
        throw new ForbiddenException(
          'Bạn không có quyền gửi tin nhắn trong yêu cầu này',
        );
      }
    } else if (user.role === EUserRole.STAFF) {
      const staff = await this.getStaffByUserId(user.id);
      if (!staff || request.assignedStaffId !== staff.id) {
        throw new ForbiddenException(
          'Bạn không được phân công xử lý yêu cầu hỗ trợ này',
        );
      }
      isAssignedStaff = true;
    } else {
      throw new ForbiddenException('Quyền hạn không hợp lệ');
    }

    const isStaffOrAdmin = isAssignedStaff || user.role === EUserRole.ADMIN;
    const isCustomer = !isStaffOrAdmin && request.requesterId === user.id;

    let needsRequestUpdate = false;

    // Khi staff hoặc admin gửi tin nhắn đầu tiên thì set firstResponseAt và chuyển sang IN_PROGRESS
    if (isStaffOrAdmin && !request.firstResponseAt) {
      request.firstResponseAt = new Date();
      if (
        request.status === ESupportRequestStatus.ASSIGNED ||
        request.status === ESupportRequestStatus.OPEN
      ) {
        request.status = ESupportRequestStatus.IN_PROGRESS;
      }
      needsRequestUpdate = true;
    } else if (isCustomer && request.status === ESupportRequestStatus.RESOLVED) {
      // MKP-069: Reopen resolved ticket when customer sends a new message
      request.status = ESupportRequestStatus.IN_PROGRESS;
      needsRequestUpdate = true;
    }

    let updatedRequest: SupportRequest | null = null;
    let savedMessageId: string;

    if (this.dataSource) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        if (needsRequestUpdate) {
          updatedRequest = await queryRunner.manager.save(SupportRequest, request);
        }

        const message = queryRunner.manager.create(SupportRequestMessage, {
          requestId: request.id,
          senderId: user.id,
          content: dto.content,
        });

        const savedMessage = await queryRunner.manager.save(
          SupportRequestMessage,
          message,
        );
        savedMessageId = savedMessage.id;

        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    } else {
      if (needsRequestUpdate) {
        updatedRequest = await this.requestRepo.save(request);
      }

      const message = this.messageRepo.create({
        requestId: request.id,
        senderId: user.id,
        content: dto.content,
      });

      const savedMessage = await this.messageRepo.save(message);
      savedMessageId = savedMessage.id;
    }

    const foundMessage = await this.messageRepo.findOne({
      where: { id: savedMessageId },
      relations: ['sender'],
    });

    if (foundMessage && updatedRequest) {
      (foundMessage as any).updatedRequest = updatedRequest;
      foundMessage.request = updatedRequest;
    }

    return foundMessage as SupportRequestMessage;
  }

  async resolve(
    requestId: string,
    user: { id: string; role: EUserRole },
  ): Promise<SupportRequest> {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: ['assignedStaff', 'assignedStaff.user'],
    });

    if (!request) {
      throw new NotFoundException(
        `Không tìm thấy yêu cầu hỗ trợ #${requestId}`,
      );
    }

    if (request.status === ESupportRequestStatus.CLOSED) {
      throw new BadRequestException('Yêu cầu hỗ trợ đã bị đóng');
    }

    if (user.role === EUserRole.STAFF) {
      const staff = await this.getStaffByUserId(user.id);
      if (!staff || request.assignedStaffId !== staff.id) {
        throw new ForbiddenException(
          'Bạn không có quyền đánh dấu giải quyết yêu cầu này',
        );
      }
    } else if (user.role !== EUserRole.ADMIN) {
      throw new ForbiddenException(
        'Chỉ nhân viên phụ trách hoặc quản trị viên mới có quyền giải quyết',
      );
    }

    request.status = ESupportRequestStatus.RESOLVED;
    request.resolvedAt = new Date();

    return this.requestRepo.save(request);
  }

  async close(
    requestId: string,
    user: { id: string; role: EUserRole },
  ): Promise<SupportRequest> {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException(
        `Không tìm thấy yêu cầu hỗ trợ #${requestId}`,
      );
    }

    // ADMIN hoặc requester: đóng request (CLOSED)
    if (user.role !== EUserRole.ADMIN && request.requesterId !== user.id) {
      throw new ForbiddenException(
        'Chỉ người tạo yêu cầu hoặc Quản trị viên mới có quyền đóng yêu cầu này',
      );
    }

    request.status = ESupportRequestStatus.CLOSED;
    request.closedAt = new Date();

    return this.requestRepo.save(request);
  }
}
