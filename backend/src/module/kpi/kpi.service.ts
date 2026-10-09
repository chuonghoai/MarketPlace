import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportRequest } from '../support-requests/entities/support-request.entity';
import { Staff } from '../staffs/entities/staff.entity';
import { KpiQueryDto } from './dto/kpi-query.dto';

export interface StaffKpiItem {
  staffId: string;
  staffName: string;
  staffEmail: string;
  totalAssigned: number;
  totalResolved: number;
  resolveRate: number;
  openBacklog: number;
  avgFirstResponseMinutes: number;
  avgResolutionMinutes: number;
  slaMetRate: number;
}

export interface KpiSummary {
  totalStaffs: number;
  totalAssigned: number;
  totalResolved: number;
  overallResolveRate: number;
  totalBacklog: number;
  avgFirstResponseMinutes: number;
  avgResolutionMinutes: number;
  overallSlaMetRate: number;
  slaThresholdMinutes: number;
}

export interface TimeSeriesPoint {
  date: string;
  assignedCount: number;
  resolvedCount: number;
}

export interface StaffKpiResponse {
  items: StaffKpiItem[];
  summary: KpiSummary;
  timeSeries: TimeSeriesPoint[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

interface RawStaffKpiRow {
  staffId: string;
  staffName: string;
  staffEmail: string;
  totalAssigned: string | number;
  totalResolved: string | number;
  openBacklog: string | number;
  avgFirstResponseMinutes: string | number | null;
  avgResolutionMinutes: string | number | null;
  slaMetCount: string | number;
  respondedCount: string | number;
}

interface RawDailyRow {
  date: string;
  count: string | number;
}

@Injectable()
export class KpiService {
  constructor(
    @InjectRepository(SupportRequest)
    private readonly requestRepo: Repository<SupportRequest>,
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
  ) {}

  private validateAndParseDates(
    startDateStr: string,
    endDateStr: string,
  ): { start: Date; end: Date } {
    const start = new Date(`${startDateStr}T00:00:00.000Z`);
    const end = new Date(`${endDateStr}T23:59:59.999Z`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException(
        'Định dạng startDate hoặc endDate không hợp lệ',
      );
    }

    if (start > end) {
      throw new BadRequestException('startDate không được lớn hơn endDate');
    }

    const diffMs = end.getTime() - start.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays > 366) {
      throw new BadRequestException(
        'Khoảng thời gian thống kê tối đa không quá 366 ngày',
      );
    }

    return { start, end };
  }

  async getStaffKpi(query: KpiQueryDto): Promise<StaffKpiResponse> {
    const { start, end } = this.validateAndParseDates(
      query.startDate,
      query.endDate,
    );
    const slaMinutes =
      Number(process.env.SUPPORT_SLA_FIRST_RESPONSE_MINUTES) || 120;
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.max(1, Number(query.pageSize) || 10);

    // 1. Query KPI từng nhân viên
    const staffQb = this.staffRepo
      .createQueryBuilder('s')
      .innerJoin('s.user', 'u')
      .leftJoin(
        SupportRequest,
        'r',
        'r.assignedStaffId = s.id AND (r.assignedAt BETWEEN :start AND :end OR (r.assignedAt IS NULL AND r.createdAt BETWEEN :start AND :end))',
        { start, end },
      )
      .select('s.id', 'staffId')
      .addSelect('COALESCE(u.fullName, u.email)', 'staffName')
      .addSelect('u.email', 'staffEmail')
      .addSelect('COUNT(r.id)', 'totalAssigned')
      .addSelect(
        "SUM(CASE WHEN r.resolvedAt IS NOT NULL OR r.status IN ('RESOLVED', 'CLOSED') THEN 1 ELSE 0 END)",
        'totalResolved',
      )
      .addSelect(
        "SUM(CASE WHEN r.status NOT IN ('RESOLVED', 'CLOSED') THEN 1 ELSE 0 END)",
        'openBacklog',
      )
      .addSelect(
        'AVG(CASE WHEN r.firstResponseAt IS NOT NULL THEN TIMESTAMPDIFF(MINUTE, COALESCE(r.assignedAt, r.createdAt), r.firstResponseAt) ELSE NULL END)',
        'avgFirstResponseMinutes',
      )
      .addSelect(
        'AVG(CASE WHEN r.resolvedAt IS NOT NULL THEN TIMESTAMPDIFF(MINUTE, COALESCE(r.assignedAt, r.createdAt), r.resolvedAt) ELSE NULL END)',
        'avgResolutionMinutes',
      )
      .addSelect(
        `SUM(CASE WHEN r.firstResponseAt IS NOT NULL AND TIMESTAMPDIFF(MINUTE, COALESCE(r.assignedAt, r.createdAt), r.firstResponseAt) <= :slaMinutes THEN 1 ELSE 0 END)`,
        'slaMetCount',
      )
      .addSelect(
        'SUM(CASE WHEN r.firstResponseAt IS NOT NULL THEN 1 ELSE 0 END)',
        'respondedCount',
      )
      .setParameter('slaMinutes', slaMinutes)
      .groupBy('s.id')
      .addGroupBy('u.fullName')
      .addGroupBy('u.email');

    if (query.staffId) {
      staffQb.where('s.id = :staffId', { staffId: query.staffId });
    }

    const rawStats: RawStaffKpiRow[] = await staffQb.getRawMany();

    const allItems: StaffKpiItem[] = rawStats.map((row) => {
      const totalAssigned = Number(row.totalAssigned) || 0;
      const totalResolved = Number(row.totalResolved) || 0;
      const openBacklog = Number(row.openBacklog) || 0;
      const avgFirstResponseMinutes = Math.round(
        Number(row.avgFirstResponseMinutes) || 0,
      );
      const avgResolutionMinutes = Math.round(
        Number(row.avgResolutionMinutes) || 0,
      );
      const slaMetCount = Number(row.slaMetCount) || 0;
      const respondedCount = Number(row.respondedCount) || 0;

      const resolveRate =
        totalAssigned > 0
          ? Math.round((totalResolved / totalAssigned) * 100 * 10) / 10
          : 0;

      const slaMetRate =
        respondedCount > 0
          ? Math.round((slaMetCount / respondedCount) * 100 * 10) / 10
          : 0;

      return {
        staffId: row.staffId,
        staffName: row.staffName,
        staffEmail: row.staffEmail,
        totalAssigned,
        totalResolved,
        resolveRate,
        openBacklog,
        avgFirstResponseMinutes,
        avgResolutionMinutes,
        slaMetRate,
      };
    });

    // Sắp xếp theo số lượng đã giải quyết giảm dần
    allItems.sort((a, b) => b.totalResolved - a.totalResolved);

    const totalItems = allItems.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const pagedItems = allItems.slice((page - 1) * pageSize, page * pageSize);

    // 2. Summary
    const totalAssignedSum = allItems.reduce(
      (acc, cur) => acc + cur.totalAssigned,
      0,
    );
    const totalResolvedSum = allItems.reduce(
      (acc, cur) => acc + cur.totalResolved,
      0,
    );
    const totalBacklogSum = allItems.reduce(
      (acc, cur) => acc + cur.openBacklog,
      0,
    );

    const overallResolveRate =
      totalAssignedSum > 0
        ? Math.round((totalResolvedSum / totalAssignedSum) * 100 * 10) / 10
        : 0;

    const staffsWithResponses = allItems.filter(
      (i) => i.avgFirstResponseMinutes > 0,
    );
    const avgFirstResponseMinutesOverall =
      staffsWithResponses.length > 0
        ? Math.round(
            staffsWithResponses.reduce(
              (acc, cur) => acc + cur.avgFirstResponseMinutes,
              0,
            ) / staffsWithResponses.length,
          )
        : 0;

    const staffsWithResolutions = allItems.filter(
      (i) => i.avgResolutionMinutes > 0,
    );
    const avgResolutionMinutesOverall =
      staffsWithResolutions.length > 0
        ? Math.round(
            staffsWithResolutions.reduce(
              (acc, cur) => acc + cur.avgResolutionMinutes,
              0,
            ) / staffsWithResolutions.length,
          )
        : 0;

    const staffsWithSla = allItems.filter((i) => i.totalAssigned > 0);
    const overallSlaMetRate =
      staffsWithSla.length > 0
        ? Math.round(
            (staffsWithSla.reduce((acc, cur) => acc + cur.slaMetRate, 0) /
              staffsWithSla.length) *
              10,
          ) / 10
        : 0;

    const summary: KpiSummary = {
      totalStaffs: totalItems,
      totalAssigned: totalAssignedSum,
      totalResolved: totalResolvedSum,
      overallResolveRate,
      totalBacklog: totalBacklogSum,
      avgFirstResponseMinutes: avgFirstResponseMinutesOverall,
      avgResolutionMinutes: avgResolutionMinutesOverall,
      overallSlaMetRate,
      slaThresholdMinutes: slaMinutes,
    };

    // 3. Time Series theo ngày
    const timeSeriesMap = new Map<
      string,
      { assignedCount: number; resolvedCount: number }
    >();

    // Tạo sẵn các ngày liên tục
    const curDate = new Date(start);
    while (curDate <= end) {
      const dateStr = curDate.toISOString().slice(0, 10);
      timeSeriesMap.set(dateStr, { assignedCount: 0, resolvedCount: 0 });
      curDate.setUTCDate(curDate.getUTCDate() + 1);
    }

    const assignedDailyQb = this.requestRepo
      .createQueryBuilder('r')
      .select(
        "DATE_FORMAT(COALESCE(r.assignedAt, r.createdAt), '%Y-%m-%d')",
        'date',
      )
      .addSelect('COUNT(r.id)', 'count')
      .where(
        '(r.assignedAt BETWEEN :start AND :end OR (r.assignedAt IS NULL AND r.createdAt BETWEEN :start AND :end))',
        { start, end },
      );

    if (query.staffId) {
      assignedDailyQb.andWhere('r.assignedStaffId = :staffId', {
        staffId: query.staffId,
      });
    }

    const rawAssignedDaily: RawDailyRow[] = await assignedDailyQb
      .groupBy("DATE_FORMAT(COALESCE(r.assignedAt, r.createdAt), '%Y-%m-%d')")
      .getRawMany();

    for (const row of rawAssignedDaily) {
      if (row.date && timeSeriesMap.has(row.date)) {
        const item = timeSeriesMap.get(row.date);
        if (item) {
          item.assignedCount = Number(row.count) || 0;
        }
      }
    }

    const resolvedDailyQb = this.requestRepo
      .createQueryBuilder('r')
      .select("DATE_FORMAT(r.resolvedAt, '%Y-%m-%d')", 'date')
      .addSelect('COUNT(r.id)', 'count')
      .where('r.resolvedAt BETWEEN :start AND :end', { start, end });

    if (query.staffId) {
      resolvedDailyQb.andWhere('r.assignedStaffId = :staffId', {
        staffId: query.staffId,
      });
    }

    const rawResolvedDaily: RawDailyRow[] = await resolvedDailyQb
      .groupBy("DATE_FORMAT(r.resolvedAt, '%Y-%m-%d')")
      .getRawMany();

    for (const row of rawResolvedDaily) {
      if (row.date && timeSeriesMap.has(row.date)) {
        const item = timeSeriesMap.get(row.date);
        if (item) {
          item.resolvedCount = Number(row.count) || 0;
        }
      }
    }

    const timeSeries: TimeSeriesPoint[] = Array.from(
      timeSeriesMap.entries(),
    ).map(([date, counts]) => ({
      date,
      assignedCount: counts.assignedCount,
      resolvedCount: counts.resolvedCount,
    }));

    return {
      items: pagedItems,
      summary,
      timeSeries,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
    };
  }

  async getMyKpi(
    userId: string,
    query: KpiQueryDto,
  ): Promise<StaffKpiResponse> {
    const staff = await this.staffRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!staff) {
      throw new NotFoundException(
        'Không tìm thấy thông tin nhân viên cho tài khoản này',
      );
    }

    return this.getStaffKpi({
      ...query,
      staffId: staff.id,
    });
  }
}
