# DTOs & Domain Models (Web Frontend)

Tài liệu này quy định cách định nghĩa TypeScript Types, DTOs và Enums trong hệ thống Web Frontend.

---

## 1. Vị trí lưu trữ

Mọi định nghĩa kiểu dữ liệu (Types) phải được đặt trong thư mục feature tương ứng:
- `src/features/<feature>/dto/`: Kiểu dữ liệu Request / Response của các thao tác API.
- `src/features/<feature>/enums/`: Các Enums nghiệp vụ (ví dụ: `otpPurpose.enum.ts`, `orderStatus.enum.ts`).
- `src/features/<feature>/models/`: Định nghĩa kiểu của các Domain Entities hiển thị (ví dụ: `user.model.ts`, `product.model.ts`).

---

## 2. Quy tắc định nghĩa DTOs

### 2.1 Sử dụng `type` hoặc `interface` tường minh
- Sử dụng tiền tố/hậu tố rõ ràng: `LoginRequest`, `LoginResponse`, `CreateProductRequest`, `ProductDetailResponse`.
- Sử dụng `export type` hoặc `export interface` rõ ràng.

```typescript
// features/auth/dto/login.type.ts
import type { User } from "../../user/models/user.model";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
```

### 2.2 Generic API Response (`src/core/api/apiResponse.ts`)
Mọi phản hồi từ backend đều được bao bọc bởi interface chuẩn:

```typescript
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
  };
}
```

---

## 3. Quy tắc đặt tên Enums

- Đặt tên Enum theo chuẩn PascalCase kèm hậu tố Enum hoặc tiền tố `E` (ví dụ: `EUserRole`, `OtpPurpose`, `OrderStatus`).
- File name: `<domain>.enum.ts`.

```typescript
// features/user/models/user.model.ts
export enum EUserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  SELLER = 'SELLER',
  USER = 'USER',
}

export interface User {
  id: string;
  email: string;
  fullname: string;
  role: EUserRole;
  avatarUrl?: string;
}
```

---

## 4. Ràng buộc bất di bất dịch

1. **Tuyệt đối KHÔNG sử dụng `any`** cho dữ liệu nhận từ API hoặc truyền qua Props/State. Hãy định nghĩa đầy đủ interface hoặc dùng `unknown` khi chưa xác định được kiểu.
2. Khi Backend thay đổi cấu trúc DTO, phải cập nhật đồng bộ các file DTO trong `web/src/features/<feature>/dto/`.
