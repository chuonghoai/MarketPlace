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
      expect(res.summary.overallSlaMetRate).toBe(87.5);
    });

    describe('MKP-076: overallSlaMetRate weighted calculation', () => {
      const setupMockStaffKpi = (mockRawRows: any[]) => {
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
          getRawMany: jest.fn().mockResolvedValue([]),
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
          getRawMany: jest.fn().mockResolvedValue([]),
        };

        staffRepo.createQueryBuilder.mockReturnValue(qbStaff);
        requestRepo.createQueryBuilder
          .mockReturnValueOnce(qbAssigned)
          .mockReturnValueOnce(qbResolved);
      };

      it('Test A - Unequal ticket counts: should calculate overallSlaMetRate weighted by ticket counts (66.7% vs old 66.3%)', async () => {
        // Staff A: 7 SLA-compliant / 10 responded (70%)
        // Staff B: 5 SLA-compliant / 8 responded (62.5%)
        // Old arithmetic average: (70 + 62.5) / 2 = 66.25% -> 66.3%
        // Correct weighted: (7 + 5) / (10 + 8) * 100 = 12 / 18 * 100 = 66.666...% -> 66.7%
        setupMockStaffKpi([
          {
            staffId: 'staff-a',
            staffName: 'Staff A',
            staffEmail: 'a@marketnest.vn',
            totalAssigned: '10',
            totalResolved: '8',
            openBacklog: '2',
            avgFirstResponseMinutes: '30',
            avgResolutionMinutes: '100',
            slaMetCount: '7',
            respondedCount: '10',
          },
          {
            staffId: 'staff-b',
            staffName: 'Staff B',
            staffEmail: 'b@marketnest.vn',
            totalAssigned: '8',
            totalResolved: '6',
            openBacklog: '2',
            avgFirstResponseMinutes: '40',
            avgResolutionMinutes: '110',
            slaMetCount: '5',
            respondedCount: '8',
          },
        ]);

        const res = await service.getStaffKpi({
          startDate: '2026-03-01',
          endDate: '2026-03-31',
        });

        expect(res.items[0].slaMetRate).toBe(70);
        expect(res.items[1].slaMetRate).toBe(62.5);
        expect(res.summary.overallSlaMetRate).toBe(66.7);
      });

      it('Test B - Equal ticket counts: should calculate correct weighted SLA rate without regression', async () => {
        // Staff A: 7 / 10 = 70%
        // Staff B: 5 / 10 = 50%
        // Weighted: (7 + 5) / (10 + 10) * 100 = 12 / 20 * 100 = 60.0%
        setupMockStaffKpi([
          {
            staffId: 'staff-a',
            staffName: 'Staff A',
            staffEmail: 'a@marketnest.vn',
            totalAssigned: '10',
            totalResolved: '8',
            openBacklog: '2',
            avgFirstResponseMinutes: '30',
            avgResolutionMinutes: '100',
            slaMetCount: '7',
            respondedCount: '10',
          },
          {
            staffId: 'staff-b',
            staffName: 'Staff B',
            staffEmail: 'b@marketnest.vn',
            totalAssigned: '10',
            totalResolved: '7',
            openBacklog: '3',
            avgFirstResponseMinutes: '45',
            avgResolutionMinutes: '120',
            slaMetCount: '5',
            respondedCount: '10',
          },
        ]);

        const res = await service.getStaffKpi({
          startDate: '2026-03-01',
          endDate: '2026-03-31',
        });

        expect(res.items[0].slaMetRate).toBe(70);
        expect(res.items[1].slaMetRate).toBe(50);
        expect(res.summary.overallSlaMetRate).toBe(60);
      });

      it('Test C - Zero eligible tickets: should return 0 and never return NaN or Infinity', async () => {
        setupMockStaffKpi([
          {
            staffId: 'staff-a',
            staffName: 'Staff A',
            staffEmail: 'a@marketnest.vn',
            totalAssigned: '0',
            totalResolved: '0',
            openBacklog: '0',
            avgFirstResponseMinutes: null,
            avgResolutionMinutes: null,
            slaMetCount: '0',
            respondedCount: '0',
          },
          {
            staffId: 'staff-b',
            staffName: 'Staff B',
            staffEmail: 'b@marketnest.vn',
            totalAssigned: '0',
            totalResolved: '0',
            openBacklog: '0',
            avgFirstResponseMinutes: null,
            avgResolutionMinutes: null,
            slaMetCount: '0',
            respondedCount: '0',
          },
        ]);

        const res = await service.getStaffKpi({
          startDate: '2026-03-01',
          endDate: '2026-03-31',
        });

        expect(res.summary.overallSlaMetRate).toBe(0);
        expect(Number.isNaN(res.summary.overallSlaMetRate)).toBe(false);
        expect(Number.isFinite(res.summary.overallSlaMetRate)).toBe(true);

        // Also test empty staff list
        setupMockStaffKpi([]);
        const emptyRes = await service.getStaffKpi({
          startDate: '2026-03-01',
          endDate: '2026-03-31',
        });
        expect(emptyRes.summary.overallSlaMetRate).toBe(0);
      });

      it('Test D - Staff with zero eligible responses: should not distort overall rate', async () => {
        // Staff A: 7 / 8 = 87.5%
        // Staff B: 0 / 0 (totalAssigned: 5, but respondedCount: 0)
        // With old code: Staff B was included in staffsWithSla because totalAssigned > 0, producing (87.5 + 0) / 2 = 43.8%
        // With ticket totals: 7 / 8 * 100 = 87.5%
        setupMockStaffKpi([
          {
            staffId: 'staff-a',
            staffName: 'Staff A',
            staffEmail: 'a@marketnest.vn',
            totalAssigned: '10',
            totalResolved: '8',
            openBacklog: '2',
            avgFirstResponseMinutes: '30',
            avgResolutionMinutes: '100',
            slaMetCount: '7',
            respondedCount: '8',
          },
          {
            staffId: 'staff-b',
            staffName: 'Staff B',
            staffEmail: 'b@marketnest.vn',
            totalAssigned: '5',
            totalResolved: '0',
            openBacklog: '5',
            avgFirstResponseMinutes: null,
            avgResolutionMinutes: null,
            slaMetCount: '0',
            respondedCount: '0',
          },
        ]);

        const res = await service.getStaffKpi({
          startDate: '2026-03-01',
          endDate: '2026-03-31',
        });

        expect(res.items[0].slaMetRate).toBe(87.5);
        expect(res.items[1].slaMetRate).toBe(0);
        expect(res.summary.overallSlaMetRate).toBe(87.5);
      });

      it('Test E - Multiple staff members: calculates overall SLA from sum of actual ticket counts across all staff', async () => {
        // Staff 1: 10 / 12 (83.3%)
        // Staff 2: 2 / 20 (10%)
        // Staff 3: 50 / 50 (100%)
        // Total SLA met = 10 + 2 + 50 = 62
        // Total responded = 12 + 20 + 50 = 82
        // Overall SLA rate = 62 / 82 * 100 = 75.6097...% -> 75.6%
        // (Old arithmetic average: (83.3 + 10 + 100) / 3 = 64.4%)
        setupMockStaffKpi([
          {
            staffId: 'staff-1',
            staffName: 'Staff 1',
            staffEmail: 'staff1@marketnest.vn',
            totalAssigned: '15',
            totalResolved: '12',
            openBacklog: '3',
            avgFirstResponseMinutes: '20',
            avgResolutionMinutes: '80',
            slaMetCount: '10',
            respondedCount: '12',
          },
          {
            staffId: 'staff-2',
            staffName: 'Staff 2',
            staffEmail: 'staff2@marketnest.vn',
            totalAssigned: '25',
            totalResolved: '18',
            openBacklog: '7',
            avgFirstResponseMinutes: '150',
            avgResolutionMinutes: '300',
            slaMetCount: '2',
            respondedCount: '20',
          },
          {
            staffId: 'staff-3',
            staffName: 'Staff 3',
            staffEmail: 'staff3@marketnest.vn',
            totalAssigned: '50',
            totalResolved: '50',
            openBacklog: '0',
            avgFirstResponseMinutes: '15',
            avgResolutionMinutes: '45',
            slaMetCount: '50',
            respondedCount: '50',
          },
        ]);

        const res = await service.getStaffKpi({
          startDate: '2026-03-01',
          endDate: '2026-03-31',
        });

        expect(res.summary.overallSlaMetRate).toBe(75.6);
      });
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
