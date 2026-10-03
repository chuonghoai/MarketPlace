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

export interface StaffKpiResponseData {
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

export interface KpiQueryParams {
  startDate: string;
  endDate: string;
  staffId?: string;
  page?: number;
  pageSize?: number;
}
