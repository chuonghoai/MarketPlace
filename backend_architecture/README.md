# Backend Architecture (`MarketPlace Backend`)

Backend của hệ thống Marketplace được xây dựng bằng **NestJS 11** với **TypeScript**, thiết kế theo kiến trúc Module hóa (Modular Architecture) và phân tầng rõ ràng (Layered / N-Tier Architecture) nhằm đảm bảo tính mở rộng, bảo mật và hiệu năng cao.

---

## 1. Công nghệ & Stack cốt lõi (Tech Stack)

- **Framework:** NestJS 11 (Node.js runtime)
- **Ngôn ngữ:** TypeScript 5.7+
- **Database & ORM:** MySQL 8.x + TypeORM 0.3.x (`autoLoadEntities: true`, `synchronize: true` trong môi trường phát triển)
- **Caching & In-Memory:** Redis (`ioredis`, `@nestjs/cache-manager`)
- **Full-text Search:** OpenSearch (`@opensearch-project/opensearch`)
- **Realtime / WebSocket:** Socket.IO (`@nestjs/websockets`, `@nestjs/platform-socket.io`)
- **Authentication & Security:** Passport JWT (`@nestjs/passport`, `passport-jwt`), Role-based Access Control (RBAC), Throttler rate-limiting (`@nestjs/throttler`), `cookie-parser`, `bcrypt`
- **Validation & Serialization:** `class-validator`, `class-transformer`
- **Storage & Media:** Cloudinary, Multer, Streamifier
- **Mail Service:** `@nestjs-modules/mailer`, Nodemailer, Handlebars templates
- **Scheduling / Cron:** `@nestjs/schedule`

---

## 2. Kiến trúc phân tầng & Luồng dữ liệu (API Data Flow)

Luồng xử lý chuẩn của mọi HTTP Request trong hệ thống Backend:

```mermaid
graph TD
    Client[Client / Web / Mobile Request] --> Middleware[CookieParser / CORS / TrustProxy]
    Middleware --> Guards[Guards: ThrottlerGuard -> JwtAuthGuard -> RolesGuard]
    Guards --> InterceptorIn[LoggingInterceptor (Request)]
    InterceptorIn --> Validation[ValidationPipe: class-validator DTO]
    Validation --> Controller[NestJS Controller]
    Controller --> Service[Business Service Layer]
    Service --> TypeORM[TypeORM Repository / DataSource]
    TypeORM --> Database[(MySQL Database)]
    Service --> Redis[(Redis Cache / Session / OTP)]
    Service --> Search[(OpenSearch Engine)]
    Service --> External[External Services: Cloudinary / Mailer]
    Service --> Controller
    Controller --> InterceptorOut[LoggingInterceptor (Response)]
    InterceptorOut --> ClientResponse[Client Response: ApiResponse<T>]
    
    Service -.->|Exception Thrown| ExceptionFilter[HttpExceptionFilter]
    ExceptionFilter --> ErrorResponse[Standard Error JSON: { success: false, error }]
```

---

## 3. Cấu trúc thư mục Source Code (`src/`)

```text
src/
├── constants/             # Enums, ENV constants, App-wide constants
├── core/                  # Hạ tầng dùng chung (Cross-cutting Concerns)
│   ├── common/
│   │   ├── filters/       # HttpExceptionFilter (Standard error response)
│   │   └── interceptors/ # LoggingInterceptor
│   ├── dto/               # ApiResponse.dto.ts (Chuẩn hóa response)
│   ├── exceptions/        # CustomException.ts
│   └── security/          # JWT Strategy, JwtAuthGuard, RolesGuard, CustomThrottlerGuard
├── module/                # Domain Feature Modules
│   ├── admin-dashboard/   # Dashboard thống kê cho Admin
│   ├── admins/            # Quản trị viên
│   ├── auth/              # Đăng nhập, đăng ký, refresh token, reset password, OTP
│   ├── cart/              # Giỏ hàng người dùng
│   ├── categories/        # Danh mục sản phẩm
│   ├── checkout/          # Quy trình thanh toán và đặt hàng
│   ├── mails/             # Template & Service gửi email
│   ├── media/             # Upload ảnh lên Cloudinary
│   ├── opensearch/        # Module tìm kiếm nâng cao OpenSearch
│   ├── orders/            # Đơn hàng, lịch sử đơn hàng
│   ├── products/          # Sản phẩm, biến thể, tồn kho, yêu thích
│   ├── redis/             # Quản lý Redis connection, cache, OTP cooldown
│   ├── reviews/           # Đánh giá sản phẩm
│   ├── sellers/           # Kênh người bán
│   ├── staffs/            # Nhân viên hỗ trợ
│   ├── users/             # Quản lý tài khoản, profile, địa chỉ
│   └── vouchers/          # Mã giảm giá, khuyến mãi
├── template/              # Mail templates (Handlebars)
├── utils/                 # Các hàm tiện ích (hashing, formatting, parser)
├── app.module.ts          # Root Module kết nối DB, Redis, Throttler & các feature modules
└── main.ts                # Bootstrap app, CORS, CookieParser, Global Pipes & Filters
```

---

## 4. Module tham chiếu chuẩn (Source of Truth)

Khi triển khai feature mới hoặc sửa đổi code, Agent **BẮT BUỘC** tham khảo:
1. **Authentication & Security:** `src/module/auth/` và `src/core/security/`
2. **CRUD & Feature Flow:** `src/module/products/`
3. **Response & Error Handling:** `src/core/dto/ApiResponse.dto.ts` & `src/core/common/filters/http-exception.filter.ts`

---

## 5. Tài liệu chi tiết liên quan

- [API Rules & Layer Conventions](api_rules.md)
- [Security & Performance Guidelines](security_and_performance.md)
- [Development Workflow & Lifecycle](workflow.md)
