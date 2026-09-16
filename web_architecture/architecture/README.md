# Frontend Architecture Overview (`web/src`)

Kiến trúc Web Frontend được xây dựng theo mô hình **Feature-Driven Architecture** kết hợp với **Layered Repository Pattern**. Cách tiếp cận này giúp mã nguồn có tính module hóa cao, dễ mở rộng, dễ kiểm thử và cho phép chuyển đổi linh hoạt giữa Live API và Mock Data.

---

## 1. Cấu trúc thư mục Source Code (`web/src`)

```text
web/src/
├── admin/                 # Phân hệ quản trị (Admin & Staff)
│   ├── layout/            # Layout riêng cho Admin (Sidebar, Header, AdminLayout)
│   └── pages/             # Các trang quản trị (Overview, Products, Orders, Vouchers)
├── assets/                # Hình ảnh tĩnh, SVG, icons
├── components/            # UI Components dùng chung toàn ứng dụng
│   ├── common/            # Buttons, Inputs, Spinners, Badges, Modals
│   └── layout/            # MainLayout, Header, Footer, Navbar
├── core/                  # Hạ tầng dùng chung (Cross-cutting infrastructure)
│   ├── api/               # apiClient singleton, axios instance, ApiResponse interface
│   ├── auth/              # AuthGuard, kiểm tra role và token
│   ├── config/            # Cấu hình môi trường (USE_MOCK, API_URL)
│   ├── constants/         # App-wide constants, regex, routes
│   ├── exceptions/        # Custom error classes
│   ├── interceptors/      # Axios request/response interceptors
│   └── storage/           # LocalStorage / SessionStorage wrappers
├── features/              # Các Domain Feature Modules
│   ├── auth/              # Đăng nhập, đăng ký, OTP, đổi mật khẩu
│   ├── cart/              # Giỏ hàng và CartContext
│   ├── category/          # Danh mục sản phẩm
│   ├── media/             # Upload hình ảnh
│   ├── order/             # Đặt hàng, theo dõi đơn hàng
│   ├── products/          # Danh sách, chi tiết sản phẩm, đánh giá
│   ├── review/            # Đánh giá và nhận xét
│   ├── seller/            # Kênh người bán
│   ├── user/              # Profile người dùng, địa chỉ
│   └── voucher/           # Mã khuyến mãi
├── pages/                 # Các Page Components phía Client
│   ├── auth/              # LoginPage, RegisterPage, ForgotPasswordPage
│   ├── cart/              # CartPage
│   ├── marketplace/       # Trang chủ sàn thương mại điện tử
│   ├── order-checkout/    # Trang thanh toán
│   ├── product/           # Chi tiết sản phẩm
│   └── profile/           # Trang thông tin cá nhân và đơn mua
├── routes/                # Cấu hình Router (React Router v7) và AppRoutes
├── utils/                 # Các hàm tiện ích (format tiền tệ, ngày tháng, validate)
├── App.tsx                # Root App Component
├── index.css              # TailwindCSS v4 theme tokens và custom utilities
└── main.tsx               # Điểm khởi chạy React DOM
```

---

## 2. Cấu trúc chuẩn của một Feature Module (`src/features/<feature>/`)

Mỗi feature trong `src/features/` được tổ chức khép kín theo các tầng:

```text
features/<feature>/
├── dto/                   # Request & Response TypeScript Interfaces / Types
│   ├── <action>.type.ts
├── enums/                 # Enums thuộc domain nghiệp vụ
│   ├── <feature>.enum.ts
├── repositories/          # Tầng giao tiếp dữ liệu
│   ├── <feature>.repository.ts      # Interface định nghĩa hợp đồng API
│   ├── <feature>Api.repository.ts   # Implementation gọi Live API qua apiClient
│   └── <feature>Mock.repository.ts  # Implementation dữ liệu Mock
├── services/              # Business Service điều phối nghiệp vụ & state
│   └── <feature>.service.ts
└── contexts/ / hooks/     # (Optional) React Context hoặc Custom Hooks của feature
```

---

## 3. Các tài liệu quy tắc chi tiết

- [Data Flow & Luồng dữ liệu](data_flow.md)
- [UI & Component Rules](ui.md)
- [Services & Repositories Pattern](services_and_repositories.md)
- [DTOs & Domain Models](dto_and_models.md)
- [State Management (Zustand & Context)](state_management.md)
- [Realtime WebSocket (Socket.IO)](realtime_socket_rules.md)
