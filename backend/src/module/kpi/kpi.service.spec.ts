/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { SupportRequest } from '../support-requests/entities/support-request.entity';
import { Staff } from '../staffs/entities/staff.entity';

describe('KpiService', () => {
  let service: KpiService;
  let staffRepo: any;
  let requestRepo: any;

  beforeEach(async () => {
    staffRepo = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
    };

    requestRepo = {
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KpiService,
        {
          provide: getRepositoryToken(SupportRequest),
          useValue: requestRepo,
        },
        {
          provide: getRepositoryToken(Staff),
          useValue: staffRepo,
        },
      ],
    }).compile();

    service = module.get<KpiService>(KpiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Date range validations', () => {
    it('should throw BadRequestException if startDate is invalid', async () => {
      await expect(
        service.getStaffKpi({
          startDate: 'invalid-date',
          endDate: '2026-03-30',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if startDate > endDate', async () => {
      await expect(
        service.getStaffKpi({
          startDate: '2026-04-01',
          endDate: '2026-03-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if date range exceeds 366 days', async () => {
      await expect(
        service.getStaffKpi({
          startDate: '2024-01-01',
          endDate: '2026-01-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getStaffKpi', () => {
    it('should aggregate KPI properly and handle zero division safely', async () => {
      const mockRawRows = [
        {
          staffId: 'staff-1',
          staffName: 'Staff One',
          staffEmail: 'staff1@marketnest.vn',
          totalAssigned: '10',
          totalResolved: '8',
          openBacklog: '2',
          avgFirstResponseMinutes: '45.5',
          avgResolutionMinutes: '120.0',
          slaMetCount: '7',
          respondedCount: '8',
        },
        {
          staffId: 'staff-2',
          staffName: 'Staff Zero',
          staffEmail: 'staff2@marketnest.vn',
          totalAssigned: '0',
          totalResolved: '0',
          openBacklog: '0',
          avgFirstResponseMinutes: null,
          avgResolutionMinutes: null,
          slaMetCount: '0',
          respondedCount: '0',
        },
      ];

      const mockDailyAssigned = [{ date: '2026-03-20', count: '5' }];
      const mockDailyResolved = [{ date: '2026-03-20', count: '4' }];

      const qbStaff: any = {
        innerJoin: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockRawRows),
      };

      const qbAssigned: any = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockDailyAssigned),
      };

      const qbResolved: any = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockDailyResolved),
      };

      staffRepo.createQueryBuilder.mockReturnValue(qbStaff);
      requestRepo.createQueryBuilder
        .mockReturnValueOnce(qbAssigned)
        .mockReturnValueOnce(qbResolved);

      const res = await service.getStaffKpi({
        startDate: '2026-03-01',
        endDate: '2026-03-31',
      });

      expect(res).toBeDefined();
      expect(res.items.length).toBe(2);

      // Staff 1 check
      expect(res.items[0].resolveRate).toBe(80);
      expect(res.items[0].slaMetRate).toBe(87.5);
      expect(res.items[0].avgFirstResponseMinutes).toBe(46);

      // Staff 2 check (division by zero safely handled)
      expect(res.items[1].resolveRate).toBe(0);
      expect(res.items[1].slaMetRate).toBe(0);
      expect(res.items[1].avgFirstResponseMinutes).toBe(0);

      // Summary check
      expect(res.summary.totalStaffs).toBe(2);
      expect(res.summary.totalAssigned).toBe(10);
      expect(res.summary.totalResolved).toBe(8);
      expect(res.summary.overallResolveRate).toBe(80);
    });
  });

  describe('getMyKpi', () => {
    it('should throw NotFoundException if staff profile does not exist', async () => {
      staffRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getMyKpi('user-not-staff', {
          startDate: '2026-03-01',
          endDate: '2026-03-31',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
