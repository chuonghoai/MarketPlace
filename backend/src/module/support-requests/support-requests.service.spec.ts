/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupportRequestsService } from './support-requests.service';
import { SupportRequest } from './entities/support-request.entity';
import { SupportRequestMessage } from './entities/support-request-message.entity';
import { Staff } from '../staffs/entities/staff.entity';
import { User } from '../users/entities/user.entity';
import { ESupportRequestStatus } from './enums/support-request-status.enum';
import { EUserRole } from '../users/enums/user.enum';
import {
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

describe('SupportRequestsService', () => {
  let service: SupportRequestsService;
  let requestRepo: any;
  let messageRepo: any;
  let staffRepo: any;

  const mockUser: User = {
    id: 'user-1',
    email: 'user1@marketnest.vn',
    fullName: 'Test User',
    role: EUserRole.USER,
  } as User;

  const mockStaffUser: User = {
    id: 'staff-user-1',
    email: 'staff1@marketnest.vn',
    fullName: 'Test Staff',
    role: EUserRole.STAFF,
  } as User;

  const mockStaff: Staff = {
    id: 'staff-1',
    user: mockStaffUser,
  } as Staff;

  const mockAdmin: User = {
    id: 'admin-1',
    email: 'admin@marketnest.vn',
    fullName: 'Admin User',
    role: EUserRole.ADMIN,
  } as User;

  beforeEach(async () => {
    requestRepo = {
      create: jest.fn().mockImplementation((dto) => ({ id: 'req-1', ...dto })),
      save: jest.fn().mockImplementation((req) => Promise.resolve(req)),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    messageRepo = {
      create: jest.fn().mockImplementation((dto) => ({ id: 'msg-1', ...dto })),
      save: jest.fn().mockImplementation((msg) => Promise.resolve(msg)),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
    };

    staffRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportRequestsService,
        {
          provide: getRepositoryToken(SupportRequest),
          useValue: requestRepo,
        },
        {
          provide: getRepositoryToken(SupportRequestMessage),
          useValue: messageRepo,
        },
        {
          provide: getRepositoryToken(Staff),
          useValue: staffRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SupportRequestsService>(SupportRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a support request and initial message', async () => {
      const result = await service.create(mockUser, {
        title: 'Need help',
        content: 'Payment problem',
      });

      expect(requestRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Need help',
          content: 'Payment problem',
          requesterId: 'user-1',
          status: ESupportRequestStatus.OPEN,
        }),
      );
      expect(messageRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          senderId: 'user-1',
          content: 'Payment problem',
        }),
      );
      expect(result.status).toBe(ESupportRequestStatus.OPEN);
    });
  });

  describe('assignStaff', () => {
    it('should assign staff and set ASSIGNED status', async () => {
      const existingReq: SupportRequest = {
        id: 'req-1',
        title: 'Need help',
        content: 'Issue',
        status: ESupportRequestStatus.OPEN,
      } as SupportRequest;

      requestRepo.findOne.mockResolvedValue(existingReq);
      staffRepo.findOne.mockResolvedValue(mockStaff);

      const result = await service.assignStaff('req-1', 'staff-1');

      expect(result.assignedStaffId).toBe('staff-1');
      expect(result.status).toBe(ESupportRequestStatus.ASSIGNED);
      expect(result.assignedAt).toBeDefined();
    });

    it('should throw NotFoundException if staff does not exist', async () => {
      requestRepo.findOne.mockResolvedValue({ id: 'req-1' } as SupportRequest);
      staffRepo.findOne.mockResolvedValue(null);

      await expect(
        service.assignStaff('req-1', 'non-existing'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('resolve', () => {
    it('should resolve if assigned staff resolves', async () => {
      const existingReq: SupportRequest = {
        id: 'req-1',
        assignedStaffId: 'staff-1',
        status: ESupportRequestStatus.IN_PROGRESS,
      } as SupportRequest;

      requestRepo.findOne.mockResolvedValue(existingReq);
      staffRepo.findOne.mockResolvedValue(mockStaff);

      const result = await service.resolve('req-1', mockStaffUser);

      expect(result.status).toBe(ESupportRequestStatus.RESOLVED);
      expect(result.resolvedAt).toBeDefined();
    });

    it('should throw ForbiddenException if another staff tries to resolve', async () => {
      const existingReq: SupportRequest = {
        id: 'req-1',
        assignedStaffId: 'staff-other',
        status: ESupportRequestStatus.IN_PROGRESS,
      } as SupportRequest;

      requestRepo.findOne.mockResolvedValue(existingReq);
      staffRepo.findOne.mockResolvedValue(mockStaff);

      await expect(service.resolve('req-1', mockStaffUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('close', () => {
    it('should allow requester to close ticket', async () => {
      const existingReq: SupportRequest = {
        id: 'req-1',
        requesterId: 'user-1',
        status: ESupportRequestStatus.RESOLVED,
      } as SupportRequest;

      requestRepo.findOne.mockResolvedValue(existingReq);

      const result = await service.close('req-1', mockUser);

      expect(result.status).toBe(ESupportRequestStatus.CLOSED);
      expect(result.closedAt).toBeDefined();
    });

    it('should allow admin to close ticket', async () => {
      const existingReq: SupportRequest = {
        id: 'req-1',
        requesterId: 'user-other',
        status: ESupportRequestStatus.RESOLVED,
      } as SupportRequest;

      requestRepo.findOne.mockResolvedValue(existingReq);

      const result = await service.close('req-1', mockAdmin);

      expect(result.status).toBe(ESupportRequestStatus.CLOSED);
      expect(result.closedAt).toBeDefined();
    });

    it('should throw ForbiddenException if unauthorized user tries to close', async () => {
      const existingReq: SupportRequest = {
        id: 'req-1',
        requesterId: 'user-other',
        status: ESupportRequestStatus.RESOLVED,
      } as SupportRequest;

      requestRepo.findOne.mockResolvedValue(existingReq);

      await expect(service.close('req-1', mockUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('addMessage', () => {
    it('should set firstResponseAt and IN_PROGRESS when assigned staff replies first time', async () => {
      const existingReq: SupportRequest = {
        id: 'req-1',
        requesterId: 'user-1',
        assignedStaffId: 'staff-1',
        status: ESupportRequestStatus.ASSIGNED,
        firstResponseAt: null,
      } as unknown as SupportRequest;

      requestRepo.findOne.mockResolvedValue(existingReq);
      staffRepo.findOne.mockResolvedValue(mockStaff);
      messageRepo.findOne.mockResolvedValue({
        id: 'msg-1',
        content: 'Hello, how can I help?',
      });

      await service.addMessage('req-1', mockStaffUser, {
        content: 'Hello, how can I help?',
      });

      expect(existingReq.status).toBe(ESupportRequestStatus.IN_PROGRESS);
      expect(existingReq.firstResponseAt).toBeDefined();
    });

    it('should throw ForbiddenException if unrelated user attempts to send message', async () => {
      const existingReq: SupportRequest = {
        id: 'req-1',
        requesterId: 'user-1',
        assignedStaffId: 'staff-1',
        status: ESupportRequestStatus.OPEN,
      } as SupportRequest;

      requestRepo.findOne.mockResolvedValue(existingReq);
      staffRepo.findOne.mockResolvedValue(null);

      const hackerUser: User = {
        id: 'hacker-1',
        role: EUserRole.USER,
      } as User;

      await expect(
        service.addMessage('req-1', hackerUser, { content: 'Spam' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('Test A: should reopen RESOLVED ticket to IN_PROGRESS when customer replies', async () => {
      const existingReq: SupportRequest = {
        id: 'req-1',
        requesterId: 'user-1',
        assignedStaffId: 'staff-1',
        status: ESupportRequestStatus.RESOLVED,
      } as SupportRequest;

      requestRepo.findOne.mockResolvedValue(existingReq);
      messageRepo.findOne.mockResolvedValue({
        id: 'msg-1',
        content: 'Tôi vẫn gặp lỗi này, nhờ hỗ trợ thêm',
      });

      const res = await service.addMessage('req-1', mockUser, {
        content: 'Tôi vẫn gặp lỗi này, nhờ hỗ trợ thêm',
      });

      expect(existingReq.status).toBe(ESupportRequestStatus.IN_PROGRESS);
      expect(requestRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: ESupportRequestStatus.IN_PROGRESS }),
      );
      expect((res as any).updatedRequest?.status).toBe(ESupportRequestStatus.IN_PROGRESS);
      expect(res.request?.status).toBe(ESupportRequestStatus.IN_PROGRESS);
    });

    it('Test B: should keep IN_PROGRESS status when customer replies to IN_PROGRESS ticket', async () => {
      const existingReq: SupportRequest = {
        id: 'req-1',
        requesterId: 'user-1',
        assignedStaffId: 'staff-1',
        status: ESupportRequestStatus.IN_PROGRESS,
        firstResponseAt: new Date(),
      } as SupportRequest;

      requestRepo.findOne.mockResolvedValue(existingReq);
      messageRepo.findOne.mockResolvedValue({
        id: 'msg-2',
        content: 'Cảm ơn, tôi đang kiểm tra lại',
      });

      requestRepo.save.mockClear();

      const res = await service.addMessage('req-1', mockUser, {
        content: 'Cảm ơn, tôi đang kiểm tra lại',
      });

      expect(existingReq.status).toBe(ESupportRequestStatus.IN_PROGRESS);
      expect(requestRepo.save).not.toHaveBeenCalled();
      expect(res.content).toBeDefined();
    });

    it('Test C: should keep RESOLVED status when assigned staff or admin replies to RESOLVED ticket', async () => {
      const existingReq: SupportRequest = {
        id: 'req-1',
        requesterId: 'user-1',
        assignedStaffId: 'staff-1',
        status: ESupportRequestStatus.RESOLVED,
        firstResponseAt: new Date(),
      } as SupportRequest;

      requestRepo.findOne.mockResolvedValue(existingReq);
      staffRepo.findOne.mockResolvedValue(mockStaff);
      messageRepo.findOne.mockResolvedValue({
        id: 'msg-staff-resolved',
        content: 'Chúng tôi ghi nhận thêm thông tin từ phía hỗ trợ',
      });

      requestRepo.save.mockClear();

      const resStaff = await service.addMessage('req-1', mockStaffUser, {
        content: 'Chúng tôi ghi nhận thêm thông tin từ phía hỗ trợ',
      });

      expect(existingReq.status).toBe(ESupportRequestStatus.RESOLVED);
      expect(requestRepo.save).not.toHaveBeenCalled();

      // Test with Admin as well
      const resAdmin = await service.addMessage('req-1', mockAdmin, {
        content: 'Admin ghi chú trên ticket đã giải quyết',
      });
      expect(existingReq.status).toBe(ESupportRequestStatus.RESOLVED);
      expect(requestRepo.save).not.toHaveBeenCalled();
    });

    it('Test D: should throw ForbiddenException and not alter ticket when unauthorized user replies', async () => {
      const existingReq: SupportRequest = {
        id: 'req-1',
        requesterId: 'user-1',
        assignedStaffId: 'staff-1',
        status: ESupportRequestStatus.RESOLVED,
      } as SupportRequest;

      requestRepo.findOne.mockResolvedValue(existingReq);
      requestRepo.save.mockClear();
      messageRepo.save.mockClear();

      const unauthorizedCustomer: User = {
        id: 'other-user',
        email: 'other@example.com',
        role: EUserRole.USER,
      } as User;

      await expect(
        service.addMessage('req-1', unauthorizedCustomer, { content: 'Hack reply' }),
      ).rejects.toThrow(ForbiddenException);

      expect(existingReq.status).toBe(ESupportRequestStatus.RESOLVED);
      expect(requestRepo.save).not.toHaveBeenCalled();
      expect(messageRepo.save).not.toHaveBeenCalled();
    });

    it('Test E: should rollback transaction and throw if message persistence or status update fails', async () => {
      const existingReq: SupportRequest = {
        id: 'req-1',
        requesterId: 'user-1',
        assignedStaffId: 'staff-1',
        status: ESupportRequestStatus.RESOLVED,
      } as SupportRequest;

      requestRepo.findOne.mockResolvedValue(existingReq);

      const mockQueryRunner = {
        connect: jest.fn().mockResolvedValue(undefined),
        startTransaction: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockResolvedValue(undefined),
        rollbackTransaction: jest.fn().mockResolvedValue(undefined),
        release: jest.fn().mockResolvedValue(undefined),
        manager: {
          save: jest.fn().mockRejectedValue(new Error('Database write failure')),
          create: jest.fn().mockImplementation((entityClass, dto) => ({ id: 'msg-1', ...dto })),
        },
      };

      const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
      } as any;

      const serviceWithDataSource = new SupportRequestsService(
        requestRepo,
        messageRepo,
        staffRepo,
        { findOne: jest.fn() } as any,
        mockDataSource,
      );

      await expect(
        serviceWithDataSource.addMessage('req-1', mockUser, { content: 'Reply causing DB error' }),
      ).rejects.toThrow('Database write failure');

      expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
    });
  });
});
