import type { ApiResponse } from "../../../core/api/apiResponse";
import { userStorageService } from "../../user/services/userStorage.service";
import type { LoginRequest, LoginResponse } from "../dto/login.type";
import type { RegisterRequest } from "../dto/register.type";
import type { ResetPasswordRequest } from "../dto/forgotPassword.type";
import { OtpPurpose } from "../enums/otpPurpose.enum";
import type { AuthRepository } from "../repositories/auth.repository";
import { AuthApiRepository } from "../repositories/authApi.repository";
import { AuthMockRepository } from "../repositories/authMock.repository";
import { USE_MOCK } from "../../../core/config/useMock.config";

export class AuthService {
    private readonly authRepository: AuthRepository;

    constructor(authRepository?: AuthRepository) {
        this.authRepository = authRepository || new AuthApiRepository();
    }

    async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const result = await this.authRepository.login(data);

        if (result.success && result.data) {
            userStorageService.setUser(result.data.user);
        }

        return result;
    }

    async sendOtp(email: string, purpose: OtpPurpose): Promise<ApiResponse<void>> {
        return this.authRepository.sendOtp(email, purpose);
    }

    async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
        const result = await this.authRepository.register(data);
        if (result.success && result.data) {
            userStorageService.setUser(result.data.user);
        }
        return result;
    }

    async logout(): Promise<ApiResponse<null>> {
        userStorageService.removeUser();
        const result = this.authRepository.logout();
        return result;
    }

    async sendOtpForgotPassword(email: string): Promise<ApiResponse<void>> {
        return this.authRepository.sendOtp(email, OtpPurpose.FORGOT_PASSWORD);
    }

    async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
        return this.authRepository.resetPassword(data);
    }
}

export const authService = new AuthService(USE_MOCK ? new AuthMockRepository() : undefined);