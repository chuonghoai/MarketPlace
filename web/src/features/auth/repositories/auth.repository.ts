import type { ApiResponse } from "../../../core/api/apiResponse";
import type { LoginRequest, LoginResponse } from "../dto/login.type";
import type { RegisterRequest } from "../dto/register.type";
import type { OtpPurpose } from "../enums/otpPurpose.enum";
import type { ResetPasswordRequest } from "../dto/forgotPassword.type";

export interface AuthRepository {
    login(data: LoginRequest): Promise<ApiResponse<LoginResponse>>;

    register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>>;
    sendOtp(email: string, purpose: OtpPurpose): Promise<ApiResponse<void>>;

    resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>>;

    logout(): Promise<ApiResponse<null>>;
}
