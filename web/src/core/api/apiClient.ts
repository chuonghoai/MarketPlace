import type { AxiosRequestConfig } from "axios";
import { axiosInstance } from "./axios";

class ApiClient {
    private formatErrorResponse<T>(error: any): T {
        if (error.response && error.response.data) {
            const responseData = error.response.data;
            if (responseData.error && responseData.error.message) {
                responseData.message = responseData.error.message;
            }
            if (responseData.success === undefined) {
                responseData.success = false;
            }
            return responseData as T;
        }
        throw error;
    }

    async get<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            const response = await axiosInstance.get<T>(url, config);
            return response.data;
        } catch (error: any) {
            return this.formatErrorResponse<T>(error);
        }
    }

    async post<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            const response = await axiosInstance.post<T>(url, data, config);
            return response.data;
        } catch (error: any) {
            return this.formatErrorResponse<T>(error);
        }
    }

    async put<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            const response = await axiosInstance.put<T>(url, data, config);
            return response.data;
        } catch (error: any) {
            return this.formatErrorResponse<T>(error);
        }
    }

    async patch<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            const response = await axiosInstance.patch<T>(url, data, config);
            return response.data;
        } catch (error: any) {
            return this.formatErrorResponse<T>(error);
        }
    }

    async delete<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            const response = await axiosInstance.delete<T>(url, config);
            return response.data;
        } catch (error: any) {
            return this.formatErrorResponse<T>(error);
        }
    }
}

export const apiClient = new ApiClient();