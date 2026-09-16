# Services & Repositories Pattern (Web Frontend)

Tài liệu này mô tả chi tiết cách áp dụng **Repository Pattern** và **Service Layer** trong ứng dụng React của Marketplace.

---

## 1. Tầng Repository (`features/<feature>/repositories/*`)

Tầng Repository chịu trách nhiệm đóng gói toàn bộ giao tiếp dữ liệu (HTTP API hoặc Mock Data).

### 1.1 Repository Interface (`<feature>.repository.ts`)
Định nghĩa hợp đồng dữ liệu rõ ràng với TypeScript interface:

```typescript
// features/auth/repositories/auth.repository.ts
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
```

### 1.2 API Repository Implementation (`<feature>Api.repository.ts`)
Thực thi interface bằng cách gọi `apiClient`:

```typescript
// features/auth/repositories/authApi.repository.ts
import { apiClient } from "../../../core/api/apiClient";
import type { AuthRepository } from "./auth.repository";
import type { ApiResponse } from "../../../core/api/apiResponse";
import type { LoginRequest, LoginResponse } from "../dto/login.type";

export class AuthApiRepository implements AuthRepository {
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<ApiResponse<LoginResponse>>("/auth/login", data);
  }

  // Các method khác...
}
```

### 1.3 Mock Repository Implementation (`<feature>Mock.repository.ts`)
Cung cấp mock data khi phát triển giao diện hoặc khi backend chưa sẵn sàng (`USE_MOCK = true`):

```typescript
// features/auth/repositories/authMock.repository.ts
import type { AuthRepository } from "./auth.repository";
import type { ApiResponse } from "../../../core/api/apiResponse";

export class AuthMockRepository implements AuthRepository {
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return {
      success: true,
      message: "Đăng nhập mock thành công",
      data: {
        accessToken: "mock-token",
        user: { id: "u1", email: data.email, fullname: "Mock User", role: "USER" },
      },
    };
  }
}
```

---

## 2. Tầng Service (`features/<feature>/services/*.service.ts`)

Tầng Service điều phối logic nghiệp vụ phía Client:
- Khởi tạo Repository tương ứng dựa trên cờ cấu hình `USE_MOCK`.
- Thao tác với `userStorageService` (lưu token/user vào LocalStorage).
- Chuyển đổi dữ liệu hoặc kích hoạt các side effects cần thiết.

```typescript
// features/auth/services/auth.service.ts
import type { ApiResponse } from "../../../core/api/apiResponse";
import { userStorageService } from "../../user/services/userStorage.service";
import type { LoginRequest, LoginResponse } from "../dto/login.type";
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

  async logout(): Promise<ApiResponse<null>> {
    userStorageService.removeUser();
    return this.authRepository.logout();
  }
}

export const authService = new AuthService(USE_MOCK ? new AuthMockRepository() : undefined);
```

---

## 3. Lợi ích & Nguyên tắc thực thi

1. **Testability:** Có thể mock và test service dễ dàng mà không phụ thuộc HTTP connection.
2. **Switching:** Chuyển đổi giữa Mock Mode và Live API chỉ bằng 1 biến cấu hình trong `useMock.config.ts`.
3. **Decoupling:** UI Component hoàn toàn không biết chi tiết endpoint hay axios config bên dưới.
