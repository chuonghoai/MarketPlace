import { apiClient } from '../../../core/api/apiClient';
import type { ApiResponse } from '../../../core/api/apiResponse';
import type { KpiQueryParams, StaffKpiResponseData } from '../models/kpi.model';

class KpiService {
  private readonly baseUrl = '/kpi';

  async getStaffsKpi(params: KpiQueryParams): Promise<ApiResponse<StaffKpiResponseData>> {
    return apiClient.get<ApiResponse<StaffKpiResponseData>>(`${this.baseUrl}/staffs`, { params });
  }

  async getMyKpi(params: KpiQueryParams): Promise<ApiResponse<StaffKpiResponseData>> {
    return apiClient.get<ApiResponse<StaffKpiResponseData>>(`${this.baseUrl}/staffs/me`, { params });
  }
}

export const kpiService = new KpiService();
