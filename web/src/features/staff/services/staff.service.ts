import { apiClient } from "../../../core/api/apiClient";
import type { ApiResponse } from "../../../core/api/apiResponse";
import type { User } from "../../user/models/user.model";

export interface Staff {
    id: string;
    position: string;
    salary: number;
    createdAt: string;
    user: User;
}

export interface CreateStaffDto {
    fullName: string;
    email: string;
    phone: string;
    salary: number;
    avatarUrl?: string;
}

export interface UpdateStaffDto {
    fullName?: string;
    email?: string;
    phone?: string;
    salary?: number;
    avatarUrl?: string;
}

export const staffService = {
    getAll: async (page = 1, limit = 20, search = "") => {
        const response = await apiClient.get<ApiResponse<Staff[]>>(`/staffs`, {
            params: { page, limit, search }
        });
        return response;
    },

    getById: async (id: string) => {
        const response = await apiClient.get<ApiResponse<Staff>>(`/staffs/${id}`);
        return response;
    },

    create: async (data: CreateStaffDto) => {
        const response = await apiClient.post<ApiResponse<Staff>>(`/staffs`, data);
        return response;
    },

    update: async (id: string, data: UpdateStaffDto) => {
        const response = await apiClient.put<ApiResponse<Staff>>(`/staffs/${id}`, data);
        return response;
    }
};
