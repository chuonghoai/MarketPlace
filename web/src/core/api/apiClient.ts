import type { AxiosRequestConfig } from "axios";
import { axiosInstance } from "./axios";

class ApiClient {
    async get<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            const response = await axiosInstance.get<T>(url, config);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                const data = error.response.data;
                if (data.error && data.error.message && !data.message) {
                    data.message = data.error.message;
                }
                return data as T;
            }
            throw error;
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
            if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.error && responseData.error.message && !responseData.message) {
                    responseData.message = responseData.error.message;
                }
                return responseData as T;
            }
            throw error;
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
            if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.error && responseData.error.message && !responseData.message) {
                    responseData.message = responseData.error.message;
                }
                return responseData as T;
            }
            throw error;
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
            if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.error && responseData.error.message && !responseData.message) {
                    responseData.message = responseData.error.message;
                }
                return responseData as T;
            }
            throw error;
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
            if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.error && responseData.error.message && !responseData.message) {
                    responseData.message = responseData.error.message;
                }
                return responseData as T;
            }
            throw error;
        }
    }
}

export const apiClient = new ApiClient();