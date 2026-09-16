import type { ApiResponse } from "../../../core/api/apiResponse";
import { UnauthorizedException } from "../../../core/exceptions/unauthorized.exception";
import type { LoginRequest, LoginResponse } from "../dto/login.type";
import type { ResetPasswordRequest } from "../dto/forgotPassword.type";
import type { RegisterRequest } from "../dto/register.type";
import { OtpPurpose } from "../enums/otpPurpose.enum";
import type { AuthRepository } from "./auth.repository";
import { ApiException } from "../../../core/exceptions/api.exception";
import { EUserRole, type UserRole } from "../../user/models/user.model";

export class AuthMockRepository implements AuthRepository {
    async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        let roleResponse: UserRole = EUserRole.ADMIN;
        if (data.email === "111" && data.password === "111") {
            roleResponse = EUserRole.USER;
        }
        else if (data.email === "222" && data.password === "222") {
            roleResponse = EUserRole.ADMIN;
        } else {
            throw new UnauthorizedException("Sai email hoặc mật khẩu");
        }

        return {
            success: true,
            message: "Đăng nhập thành công",
            data: {
                accessToken: "mock_token_123",
                user: {
                    id: "1",
                    email: "manggia098@gmail.com",
                    fullName: "manggia",
                    role: roleResponse,
                    avatarUrl: ""
                }
            },
        };
    }

    async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
        if (data.otp != "123456") {
            throw new ApiException("Mã OTP không đúng", 400);
        }
        if (data.password != data.confirmPassword) {
            throw new ApiException("Mật khẩu và xác nhận mật khẩu không khớp", 400);
        }

        return {
            success: true,
            message: "Đăng ký thành công",
            data: {
                accessToken: "mock_token_123",
                user: {
                    id: "1",
                    email: data.email,
                    fullName: "Hong Hac",
                    role: "USER",
                    avatarUrl: ""
                }
            },
        };
    }

    async sendOtp(email: string, purpose: OtpPurpose): Promise<ApiResponse<void>> {
        if (purpose == OtpPurpose.FORGOT_PASSWORD) {
            return {
                success: true,
                message: `Mã OTP thay đổi mật khẩu đã được gửi đến email ${email} của bạn`,
                data: undefined as void,
            };
        }
        else if (purpose == OtpPurpose.REGISTER) {
            return {
                success: true,
                message: `Mã OTP đăng ký tài khoản đã được gửi đến email ${email} của bạn`,
                data: undefined as void,
            };
        }
        return {
            success: false,
            message: "Mục đích gửi OTP không hợp lệ",
            data: undefined as void,
        };
    }

    async logout(): Promise<ApiResponse<null>> {
        return {
            success: true,
            message: "Đăng xuất thành công",
            data: null,
        };
    }

    async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
        const { otp } = data;

        if (!/^\d+$/.test(otp)) {
            throw new Error("OTP chỉ được chứa số.");
        }
        if (otp.length !== 6) {
            throw new Error("OTP phải đủ 6 chữ số.");
        }
        if (otp !== "123456") {
            throw new Error("Mã OTP không đúng hoặc đã hết hạn.");
        }
        return {
            success: true,
            message: "Đặt lại mật khẩu thành công",
            data: undefined as void,
        };
    }
}