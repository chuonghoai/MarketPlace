import { apiClient } from "../../../core/api/apiClient";
import type { AuthRepository } from "./auth.repository";
import type { ApiResponse } from "../../../core/api/apiResponse";
import type { LoginRequest, LoginResponse } from "../dto/login.type";
import type { RegisterRequest } from "../dto/register.type";
import type { OtpPurpose } from "../enums/otpPurpose.enum";
import type { ResetPasswordRequest } from "../dto/forgotPassword.type";

export class AuthApiRepository implements AuthRepository {
    /**
     * POST /auth/login
     * @params (none)
     * @query (none)
     * @body LoginRequest
     * @returns LoginResponse
     * Fix:
     *  - Bấm đăng nhập nhưng data trả về thiếu.....
     */
    async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        return apiClient.post<ApiResponse<LoginResponse>>("/auth/login", data);
    }

    /**
     * POST /auth/register
     * @params email, otp, password, confirmPassword 
     * @query (none)
     * @response accessToken, user: { userId, email, fullname, role}
     */
    async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
        return apiClient.post<ApiResponse<LoginResponse>>("/auth/register", data);
    }

    /**
     * POST /auth/send-otp
     * @params email, purpose
     * @query (none)
     * @response null
     */
    async sendOtp(email: string, purpose: OtpPurpose): Promise<ApiResponse<void>> {
        return apiClient.post<ApiResponse<void>>("/auth/send-otp", { email, purpose });
    }

    /**
     * POST /auth/logout
     * @returns null
     */
    async logout(): Promise<ApiResponse<null>> {
        return apiClient.post<ApiResponse<null>>("/auth/logout");
    }

    /**
     * POST /auth/forgot-password
     * @params
     * @query
     * @body ForgotPasswordRequest
     * @returns void
     */
    async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
        return apiClient.post<ApiResponse<void>>("/auth/forgot-password", data);
    }
}