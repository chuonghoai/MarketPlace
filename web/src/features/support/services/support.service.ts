import { apiClient } from '../../../core/api/apiClient';
import type { ApiResponse } from '../../../core/api/apiResponse';
import type {
  AssignStaffPayload,
  CreateSupportMessagePayload,
  CreateSupportRequestPayload,
  SupportRequest,
  SupportRequestMessage,
} from '../models/support.model';

class SupportService {
  private readonly baseUrl = '/support-requests';

  async create(payload: CreateSupportRequestPayload): Promise<ApiResponse<SupportRequest>> {
    return apiClient.post<ApiResponse<SupportRequest>>(this.baseUrl, payload);
  }

  async getMyRequests(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<ApiResponse<SupportRequest[]>> {
    return apiClient.get<ApiResponse<SupportRequest[]>>(`${this.baseUrl}/my`, { params });
  }

  async getAssignedRequests(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<ApiResponse<SupportRequest[]>> {
    return apiClient.get<ApiResponse<SupportRequest[]>>(`${this.baseUrl}/assigned`, { params });
  }

  async getAllRequests(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    assignedStaffId?: string;
  }): Promise<ApiResponse<SupportRequest[]>> {
    return apiClient.get<ApiResponse<SupportRequest[]>>(this.baseUrl, { params });
  }

  async getDetail(id: string): Promise<ApiResponse<SupportRequest>> {
    return apiClient.get<ApiResponse<SupportRequest>>(`${this.baseUrl}/${id}`);
  }

  async addMessage(
    id: string,
    payload: CreateSupportMessagePayload,
  ): Promise<ApiResponse<SupportRequestMessage>> {
    return apiClient.post<ApiResponse<SupportRequestMessage>>(`${this.baseUrl}/${id}/messages`, payload);
  }

  async assignStaff(id: string, payload: AssignStaffPayload): Promise<ApiResponse<SupportRequest>> {
    return apiClient.patch<ApiResponse<SupportRequest>>(`${this.baseUrl}/${id}/assign`, payload);
  }

  async resolve(id: string): Promise<ApiResponse<SupportRequest>> {
    return apiClient.patch<ApiResponse<SupportRequest>>(`${this.baseUrl}/${id}/resolve`);
  }

  async close(id: string): Promise<ApiResponse<SupportRequest>> {
    return apiClient.patch<ApiResponse<SupportRequest>>(`${this.baseUrl}/${id}/close`);
  }
}

export const supportService = new SupportService();
