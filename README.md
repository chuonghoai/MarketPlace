# 🎨 MarketNest - Nền Tảng Thương Mại Điện Tử Thủ Công Mỹ Nghệ

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-Monorepo-007ACC?style=for-the-badge&logo=git" alt="Monorepo"/>
  <img src="https://img.shields.io/badge/Frontend-React_19_%7C_Vite_8_%7C_Tailwind_v4-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="Frontend"/>
  <img src="https://img.shields.io/badge/Backend-NestJS_11_%7C_TypeScript-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="Backend"/>
  <img src="https://img.shields.io/badge/Database-MySQL_8_%7C_TypeORM-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="Database"/>
  <img src="https://img.shields.io/badge/Cache-Redis_Valkey-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/>
  <img src="https://img.shields.io/badge/Search-OpenSearch-005FD3?style=for-the-badge&logo=opensearch&logoColor=white" alt="OpenSearch"/>
  <img src="https://img.shields.io/badge/Realtime-Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO"/>
  <img src="https://img.shields.io/badge/Testing-Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright"/>
</p>

---

## 📖 Mục Lục

1. [Mô Tả Chung Dự Án](#1-mô-tả-chung-dự-án)
   - [Giới thiệu](#-giới-thiệu)
   - [Kiến trúc hệ thống & Luồng dữ liệu](#-kiến-trúc-hệ-thống--luồng-dữ-liệu)
   - [Bảng công nghệ sử dụng](#-bảng-công-nghệ-sử-dụng)
   - [Cấu trúc thư mục Monorepo](#-cấu-trúc-thư-mục-monorepo)
2. [Danh Sách Tính Năng Chi Tiết](#2-danh-sách-tính-năng-chi-tiết)
   - [Phân hệ Khách hàng (Buyer / Client)](#-phân-hệ-khách-hàng-buyer--client)
   - [Phân hệ Nhân viên (Staff)](#-phân-hệ-nhân-viên-staff)
   - [Phân hệ Quản trị viên (Admin)](#-phân-hệ-quản-trị-viên-admin)
   - [Hạ tầng kỹ thuật nền tảng](#-hạ-tầng-kỹ-thuật-nền-tảng-core-services)
3. [Hướng Dẫn Cài Đặt & Thiết Lập Môi Trường (Env)](#3-hướng-dẫn-cài-đặt--thiết-lập-môi-trường-env)
   - [Yêu cầu tiên quyết](#-yêu-cầu-tiên-quyết-prerequisites)
   - [Cài đặt Dependencies](#-cài-đặt-dependencies)
   - [Cấu hình biến môi trường Backend (.env.dev)](#-cấu-hình-biến-môi-trường-backend-envdev)
   - [Cấu hình biến môi trường Frontend (.env.dev)](#-cấu-hình-biến-môi-trường-frontend-envdev)
   - [Tài khoản kiểm thử mặc định](#-tài-khoản-kiểm-thử-mặc-định-auto-seeded)
   - [Khởi chạy ứng dụng (Development)](#-khởi-chạy-ứng-dụng-development)
4. [Hướng Dẫn Chạy Kiểm Thử Với Playwright](#4-hướng-dẫn-chạy-kiểm-thử-với-playwright)
   - [Tổng quan bộ kiểm thử tự động](#-tổng-quan-bộ-kiểm-thử-tự-động)
   - [Điều kiện trước khi chạy test](#-điều-kiện-trước-khi-chạy-test)
   - [Các lệnh chạy Playwright từ thư mục Root](#-các-lệnh-chạy-playwright-từ-thư-mục-root)
5. [Hướng Dẫn Xem & Phân Tích Báo Cáo Playwright](#5-hướng-dẫn-xem--phân-tích-báo-cáo-playwright)
   - [Mở giao diện báo cáo HTML Report](#-mở-giao-diện-báo-cáo-html-report)
   - [Cấu trúc kết quả và nội dung báo cáo](#-cấu-trúc-kết-quả-và-nội-dung-báo-cáo)
   - [Sử dụng Playwright Trace Viewer để gỡ lỗi](#-sử-dụng-playwright-trace-viewer-để-gỡ-lỗi-trace-inspection)

---

## 1. Mô Tả Chung Dự Án

### 🌟 Giới thiệu
**MarketNest** (MarketPlace) là nền tảng thương mại điện tử chuyên biệt dành riêng cho các **sản phẩm thủ công mỹ nghệ, làng nghề truyền thống và tác phẩm nghệ nhân** (Handicrafts & Artisan Crafts). 

Hệ thống kết nối trực tiếp những nghệ nhân tài hoa với khách hàng yêu thích các sản phẩm độc bản, mang đậm bản sắc văn hóa dân tộc. Dự án không chỉ dừng lại ở mô hình mua sắm thông thường mà còn tích hợp các giải pháp công nghệ tiên tiến:
- 🏺 **Hồ sơ nghệ nhân & Tác phẩm độc bản:** Tôn vinh câu chuyện sáng tạo và danh tính nghệ nhân gắn liền từng sản phẩm.
- ⚡ **Sàn đấu giá trực tuyến thời gian thực (Real-time Auctions):** Bidding tương tác trực tiếp qua WebSocket, chống tranh chấp bằng Redis Lua Script atomic và cơ chế Auto-Bid Cascade.
- 💼 **Ví điện tử nội bộ (E-Wallet):** Tích hợp nạp tiền, trừ tiền tức thời khi thắng đấu giá, thanh toán đơn hàng và quản lý quy trình rút tiền về ngân hàng.
- 🚚 **Đóng gói thông minh 3D (3D Bin Packing):** Ứng dụng thuật toán tối ưu kích thước gói hàng để tính cước vận chuyển chính xác nhất.
- 🔍 **Tìm kiếm toàn văn bản siêu tốc:** Ứng dụng cụm tìm kiếm OpenSearch cho danh mục sản phẩm lớn.
- 🛡️ **Quản lý phiên & thiết bị đăng nhập:** Tự động giám sát thiết bị truy cập, hỗ trợ cưỡng chế đăng xuất từ xa có xác thực mật khẩu.

---

### 🏗️ Kiến trúc hệ thống & Luồng dữ liệu

Hệ thống được tổ chức dưới dạng **Monorepo** chia tách ranh giới rõ ràng giữa Client, Server và Automation Test Suite:

```mermaid
flowchart TB
    subgraph ClientLayer ["Client Layer (Web Frontend)"]
        Browser["React 19 SPA (Vite + Tailwind CSS v4)"]
        State["State: Zustand + React Context"]
        ApiClient["Axios Client (Repository Pattern)"]
        SocketClient["Socket.IO Client (Realtime Bidding)"]
    end

    subgraph ApiGateway ["API Gateway & Middleware Layer"]
        CORS["CORS & CookieParser"]
        Throttler["Throttler Guard (Rate Limit)"]
        JwtGuard["JWT Auth Guard & Roles Guard (RBAC)"]
        Pipe["ValidationPipe (class-validator DTO)"]
    end

    subgraph ServiceLayer ["Backend Domain Services (NestJS 11)"]
        AuthSvc["Auth & Device Session Service"]
        ProductSvc["Product & Artisan Service"]
        AuctionSvc["Auctions Gateway & Auto-Bid Service"]
        CartCheckoutSvc["Cart & 3D Packing Checkout Service"]
        WalletSvc["E-Wallet & Withdrawal Service"]
        SupportKpiSvc["Support Request & Staff KPI Service"]
    end

    subgraph DataLayer ["Data & Infrastructure Layer"]
        MySQL[("MySQL 8.x (TypeORM Relational Data)")]
        Redis[("Redis / Valkey (Atomic Bidding, Cache, OTP)")]
        OpenSearch[("OpenSearch Engine (Full-text Search)")]
        Cloudinary["Cloudinary (Media & Image CDN)"]
        Nodemailer["SMTP Mail Server (Nodemailer)"]
        PaymentGateways["Gateways: MoMo | VNPay | PayPal"]
    end

    Browser -->|HTTP REST Requests| ApiClient
    Browser -->|WebSocket Connection| SocketClient
    ApiClient --> CORS --> Throttler --> JwtGuard --> Pipe
    SocketClient <-->|Live Bid & Countdown Events| AuctionSvc
    Pipe --> ServiceLayer

    AuthSvc --> MySQL
    AuthSvc --> Redis
    AuthSvc --> Nodemailer
    ProductSvc --> MySQL
    ProductSvc --> OpenSearch
    ProductSvc --> Cloudinary
    AuctionSvc --> Redis
    AuctionSvc --> MySQL
    AuctionSvc --> WalletSvc
    CartCheckoutSvc --> MySQL
    CartCheckoutSvc --> PaymentGateways
    WalletSvc --> MySQL
    SupportKpiSvc --> MySQL
```

---

### 🛠️ Bảng công nghệ sử dụng

| Phân hệ | Công nghệ / Thư viện | Phiên bản | Vai trò & Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **Frontend** | **React** | `19.2.x` | Thư viện UI cốt lõi xây dựng Single Page Application hiện đại |
| | **TypeScript** | `6.0.x` | Đảm bảo tính toàn vẹn kiểu dữ liệu tĩnh (Strict Type Checking) |
| | **Vite** | `8.0.x` | Build tool và bundler thế hệ mới với tốc độ Hot Reload tức thời |
| | **Tailwind CSS** | `4.2.x` | Utility-first CSS framework kết hợp cấu hình theme token hiện đại |
| | **Zustand** | `5.0.x` | Quản lý Global State gọn nhẹ cho Admin, Giỏ hàng, Voucher |
| | **React Router DOM**| `7.15.x` | Điều hướng Client-side SPA, phân quyền Route Guard (`AuthGuard`) |
| | **Axios** | `1.16.x` | HTTP client tiêu chuẩn triển khai theo Repository Pattern |
| | **Socket.IO Client**| `4.8.x` | Đồng bộ dữ liệu phòng đấu giá và sự kiện trực tiếp hai chiều |
| | **Leaflet / React Leaflet** | `1.9.x / 5.0.x` | Bản đồ tương tác trực quan cho chọn địa chỉ giao nhận |
| | **Lucide React** | `1.17.x` | Bộ icon SVG tinh giản, thẩm mỹ cao |
| **Backend** | **NestJS** | `11.0.x` | Framework Node.js kiến trúc module hóa enterprise tiêu chuẩn |
| | **TypeORM** | `0.3.x` | Object-Relational Mapper giao tiếp với MySQL, tự động migrate schema |
| | **MySQL** | `8.x` | Cơ sở dữ liệu quan hệ lưu trữ dữ liệu nghiệp vụ chính |
| | **Redis / Valkey** | `ioredis 5.x` | Cache tốc độ cao, quản lý phiên, Atomic Lua Script cho đấu giá |
| | **OpenSearch** | `3.6.x` | Search engine phân tán hỗ trợ tìm kiếm toàn văn sản phẩm |
| | **Passport & JWT** | `0.7.x / 4.0.x` | Xác thực người dùng qua Access/Refresh Token, phân quyền RBAC |
| | **Socket.IO Gateway**| `4.8.x` | WebSocket gateway xử lý phòng đấu giá thời gian thực (`/auctions`) |
| | **3D Bin Packing** | `bp3d` / `binpackingjs` | Thuật toán đóng gói hộp 3 chiều tính toán chi phí vận chuyển |
| | **Cloudinary** | `2.10.x` | Lưu trữ và phân phối hình ảnh qua CDN đám mây |
| | **Nodemailer** | `8.0.x` | Gửi email kích hoạt, cấp tài khoản và mã OTP đặt lại mật khẩu |
| | **Payment SDKs** | MoMo / VNPay / PayPal | Tích hợp cổng thanh toán trực tuyến đa kênh |
| **Testing** | **Playwright** | `1.63.x` | Khung kiểm thử tự động toàn diện (API, UI và End-to-End E2E) |

---

### 📂 Cấu trúc thư mục Monorepo

```text
MarketPlace/
├── backend/                   # 🚀 Source code Máy chủ Backend (NestJS 11)
│   ├── src/
│   │   ├── constants/         # Enums, ENV keys, hằng số toàn hệ thống
│   │   ├── core/              # Common filters, interceptors, DTOs, JWT Guards
│   │   ├── module/            # Feature Modules (auth, products, auctions, wallets, ...)
│   │   ├── scripts/           # Scripts tiện ích & seed dữ liệu (seed-kpi.ts)
│   │   ├── template/          # Handlebars email templates
│   │   ├── app.module.ts      # Root NestJS Module kết nối DB, Redis, Cron
│   │   └── main.ts            # Khởi chạy server, CORS, Global Pipes, Seeder
│   ├── .env.dev               # Biến môi trường Development Backend
│   └── package.json           # Scripts & Dependencies Backend
│
├── web/                       # 🎨 Source code Ứng dụng Frontend (React 19 + Vite 8)
│   ├── src/
│   │   ├── admin/             # Màn hình & Components Quản trị (Dashboard, KPI, Staff, ...)
│   │   ├── components/        # UI components dùng chung (Layout, Form, Modal, Button, ...)
│   │   ├── core/              # HTTP apiClient, AuthGuard, Base Repositories
│   │   ├── features/          # Domain Logic theo tính năng (auth, cart, products, user, ...)
│   │   ├── pages/             # Các trang dành cho Khách hàng (Marketplace, Detail, Auctions, ...)
│   │   ├── routes/            # Cấu hình định tuyến React Router v7
│   │   ├── index.css          # Tailwind CSS v4 styling & theme tokens
│   │   └── main.tsx           # Mount ứng dụng React vào DOM
│   ├── .env.dev               # Biến môi trường Development Web
│   └── package.json           # Scripts & Dependencies Web
│
├── playwright/                # 🧪 Toàn bộ kịch bản kiểm thử tự động (Automation Tests)
│   ├── api/                   # Kịch bản kiểm thử trực tiếp REST API (*_api.spec.ts)
│   ├── ui/                    # Kịch bản kiểm thử tương tác giao diện (*_ui.spec.ts)
│   ├── e2e/                   # Kịch bản kiểm thử luồng người dùng End-to-End (*_e2e.spec.ts)
│   ├── helpers/               # Tiện ích hỗ trợ test (auth.helper.ts, auto login)
│   ├── playwright-report/     # Báo cáo HTML sau khi chạy kiểm thử
│   └── test-results/          # Traces, video, screenshots khi test thất bại
│
├── docs/                      # 📚 Tài liệu đặc tả Use Case & Test Cases dự án
│   ├── features/              # Đặc tả chi tiết các Use Case (UC06, UC17, UC18, UC19, ...)
│   ├── black_box_testing/     # 100 kịch bản kiểm thử Hộp Đen (MKP_001 -> MKP_100)
│   └── white_box_testing/     # Kịch bản kiểm thử Hộp Trắng
│
├── package.json               # Monorepo Task Runner (backend, web, playwright)
├── playwright.config.ts       # Cấu hình chính thức của Playwright Test Suite
└── README.md                  # Tài liệu hướng dẫn tổng quan dự án
```

---

## 2. Danh Sách Tính Năng Chi Tiết

Dựa trên 100% hiện trạng source code và cấu trúc phân quyền (RBAC: `ADMIN`, `STAFF`, `USER`):

```mermaid
mindmap
  root((MarketNest Features))
    Khách hàng (Client)
      Xác thực & Bảo mật
        Đăng ký / Đăng nhập JWT
        Quên & Đặt lại mật khẩu với OTP
        Quản lý thiết bị đăng nhập & Đăng xuất từ xa
      Khám phá & Mua sắm
        Duyệt sản phẩm Marketplace
        Tìm kiếm toàn văn OpenSearch
        Lọc nâng cao theo Danh mục & Giá
        Chi tiết sản phẩm & Nghệ nhân chế tác
        Wishlist Yêu thích
      Giỏ hàng & Đặt hàng
        Giỏ hàng & Cập nhật tồn kho
        Tính phí ship 3D Bin Packing
        Áp dụng Voucher giảm giá
        Cổng thanh toán MoMo, VNPay, PayPal, COD
      Sàn Đấu Giá Trực Tuyến
        Xem danh sách & Banner phiên mở
        Phòng đấu giá Real-time WebSocket
        Đấu giá thủ công & Auto-Bid Cascade
        Đếm ngược 30s & Atomic Redis Lock
        Tự động trừ ví & Tạo đơn khi trúng giải
      Ví Điện Tử Cá Nhân
        Nạp tiền vào ví
        Thanh toán đơn hàng & Đấu giá
        Yêu cầu rút tiền về ngân hàng
      Dịch Vụ Khách Hàng
        Theo dõi trạng thái đơn hàng
        Đánh giá & Nhận xét sản phẩm
        Yêu cầu đổi hàng / Hoàn tiền 7 ngày
        Gửi Ticket & Nhắn tin hỗ trợ
    Nhân viên (Staff)
      Quản lý Đơn hàng & Vận chuyển
      Tiếp nhận & Xử lý Ticket hỗ trợ
      Xử lý yêu cầu Đổi trả & Hoàn tiền
      Duyệt & Đăng tải ủy nhiệm chi rút tiền ví
      Giám sát & Quản trị phiên đấu giá
      Báo cáo KPI cá nhân (My KPI)
    Quản trị viên (Admin)
      Dashboard Thống kê Doanh thu & Tăng trưởng
      Quản lý Sản phẩm, Danh mục & Biến thể
      Quản lý Hồ sơ Nghệ nhân & Gán tác phẩm
      Quản lý Chiến dịch Voucher & Khuyến mãi
      Quản lý & Cấp tài khoản Nhân viên
      Thống kê & Giám sát KPI nhân viên toàn diện
      Quản lý Dòng tiền & Phê duyệt rút tiền
      Cấu hình Hệ thống & Bán hàng
```

### 👤 Phân hệ Khách hàng (Buyer / Client)

#### 1. Xác thực & Quản lý thiết bị (`auth`, `users`)
- **Đăng ký & Đăng nhập:** Xác thực an toàn bằng mật khẩu mã hóa bcrypt, cấp phát bộ đôi Access Token (thời hạn 7 ngày) và Refresh Token qua HTTP Cookie an toàn.
- **Quên mật khẩu & OTP:** Nhận mã xác thực OTP gửi qua email (Nodemailer + Handlebars) với thời gian hết hạn bảo vệ bởi Redis cooldown.
- **Quản lý thiết bị đăng nhập (UC19):** Theo dõi lịch sử thiết bị đăng nhập (trình duyệt, hệ điều hành, địa chỉ IP, thời gian đăng nhập gần nhất). Cho phép cưỡng chế đăng xuất thiết bị khác từ xa sau khi xác minh lại mật khẩu.

#### 2. Khám phá & Tìm kiếm sản phẩm (`products`, `categories`, `opensearch`)
- **Duyệt Marketplace:** Giao diện responsive hiển thị danh sách sản phẩm đẹp mắt với phân trang và hiệu ứng mượt mà.
- **Bộ lọc đa tiêu chí:** Lọc linh hoạt theo danh mục sản phẩm, khoảng giá (`minPrice` - `maxPrice`), nghệ nhân chế tác và sắp xếp (mới nhất, giá tăng/giảm, bán chạy).
- **Tìm kiếm thông minh (OpenSearch):** Tìm kiếm tức thì theo từ khóa tên sản phẩm, mô tả, gắn thẻ tag với độ chính xác cao.
- **Chi tiết sản phẩm & Nghệ danh (UC21):** Xem mô tả chi tiết, kích thước (dài x rộng x cao), trọng lượng đóng gói, số lượng tồn kho và thông tin người nghệ nhân đã chế tác ra sản phẩm.
- **Danh sách yêu thích (Wishlist):** Thêm và xóa sản phẩm khỏi danh sách yêu thích một cách thuận tiện.

#### 3. Giỏ hàng & Thanh toán đa kênh (`cart`, `checkout`)
- **Quản lý giỏ hàng:** Thêm sản phẩm, điều chỉnh số lượng theo thời gian thực, tự động kiểm tra số lượng tồn kho còn lại (`stock`).
- **Tính toán phí giao hàng thông minh (3D Bin Packing):** Backend tính toán thể tích và kích thước kiện hàng thông qua thuật toán đóng gói 3 chiều (`bp3d`) để đưa ra mức phí vận chuyển tối ưu nhất.
- **Áp dụng Voucher giảm giá:** Kiểm tra điều kiện áp dụng mã giảm giá (giảm theo %, giảm theo tiền mặt, giá trị đơn hàng tối thiểu).
- **Cổng thanh toán đa dạng:**
  - 💳 **MoMo:** Tạo mã QR thanh toán qua cổng MoMo Sandbox.
  - 🏦 **VNPay:** Thanh toán qua cổng VNPAY-QR / Thẻ ATM nội địa.
  - 🌐 **PayPal:** Thanh toán quốc tế qua PayPal Checkout Sandbox.
  - 💼 **Ví điện tử MarketNest:** Trừ tiền trực tiếp vào số dư ví.
  - 💵 **COD (Cash on Delivery):** Thanh toán bằng tiền mặt khi nhận hàng.

#### 4. Đấu giá trực tuyến thời gian thực (Auctions - UC17)
- **Banner phiên trực tiếp:** Khách hàng thấy banner phiên đấu giá đang diễn ra ngay trên trang chủ (`ActiveAuctionBanner`) hoặc trang danh mục đấu giá (`/auctions`).
- **Phòng đấu giá Real-time (WebSocket):** Tham gia phòng đấu giá trực tiếp (`/auctions/:id`), nhận dữ liệu cập nhật giá tức thời qua kênh Socket.IO (`/auctions`).
- **Đặt giá thủ công:** Đặt mức giá cao hơn giá hiện tại, đáp ứng bước giá tối thiểu (`minStepPrice`) và số dư ví điện tử phải đủ khả năng chi trả.
- **Tự động đấu giá (Auto-Bid Cascade):** Cài đặt bước giá tự động (`autoStepPrice`) và giá trần tối đa (`ceilingPrice`). Hệ thống lưu cấu hình trên Redis và tự động kích hoạt nâng giá theo vòng lặp (Auto-Bidder Cascade) nếu bị người khác vượt qua.
- **Bộ đếm ngược 30 giây:** Sau mỗi lượt đặt giá hợp lệ, đồng hồ đếm ngược tự động reset về 30s. Thao tác đặt giá được bảo vệ nguyên tử bằng **Redis Lua Script** chống race-condition.
- **Tự động tạo đơn khi thắng cuộc:** Khi hết giờ đếm ngược, người trả giá cao nhất sẽ thắng phiên. Hệ thống tự động kích hoạt Transaction: trừ tiền từ Ví điện tử, trừ tồn kho và khởi tạo đơn hàng mới ở trạng thái `PREPARING` với phương thức `WALLET`.

#### 5. Ví điện tử nội bộ (E-Wallet - UC18)
- **Quản lý số dư:** Xem số dư khả dụng và lịch sử biến động số dư.
- **Nạp tiền ví:** Nạp tiền vào ví thông qua các cổng thanh toán tương tự đặt hàng.
- **Rút tiền về ngân hàng:** Gửi yêu cầu rút tiền bằng cách nhập số tài khoản, tên chủ tài khoản, tên ngân hàng và số tiền muốn rút.
- **Hoàn tiền:** Nhận tiền hoàn từ các đơn hàng đổi trả trực tiếp vào ví.

#### 6. Theo dõi đơn hàng, Đánh giá & Hỗ trợ (`orders`, `reviews`, `support-requests`)
- **Theo dõi đơn hàng (Order Tracking):** Kiểm tra trạng thái đơn hàng (`PENDING` -> `CONFIRMED` -> `SHIPPING` -> `DELIVERED` -> `CANCELLED` -> `RETURNED`).
- **Đánh giá sản phẩm:** Đánh giá từ 1 đến 5 sao kèm bình luận nhận xét chân thực cho các đơn hàng đã giao thành công.
- **Yêu cầu đổi hàng / Hoàn tiền (UC23):** Trong vòng **7 ngày** kể từ khi nhận hàng, khách hàng có thể gửi yêu cầu hỗ trợ đổi sang sản phẩm mới hoặc trả hàng hoàn tiền kèm hình ảnh/video minh chứng.
- **Gửi Ticket hỗ trợ (UC20):** Gửi yêu cầu trợ giúp kỹ thuật hoặc giải quyết khiếu nại, trao đổi tin nhắn trực tiếp với nhân viên hỗ trợ.

---

### 👨‍💼 Phân hệ Nhân viên (Staff)

- **Quản lý & Xử lý đơn hàng:** Tiếp nhận đơn hàng mới, duyệt đơn, bàn giao đơn vị vận chuyển và cập nhật trạng thái đơn hàng.
- **Xử lý yêu cầu hoàn trả & khiếu nại (UC23):** Xem xét đơn khiếu nại, duyệt đổi hàng mới (tự động tạo đơn hàng thay thế) hoặc duyệt hoàn tiền về ví điện tử sau khi nhận lại hàng.
- **Phê duyệt rút tiền ví điện tử (UC18):** Kiểm tra yêu cầu rút tiền của khách hàng, thực hiện chuyển khoản thủ công, đăng tải hóa đơn ủy nhiệm chi lên hệ thống và hoàn tất yêu cầu.
- **Vận hành đấu giá (UC17):** Tạo các phiên đấu giá, thiết lập vật phẩm đấu giá, giá khởi điểm và kích hoạt phiên vào trạng thái `ACTIVE`.
- **Hỗ trợ khách hàng (Support Center):** Tiếp nhận danh sách ticket hỗ trợ, nhắn tin trao đổi với người mua và đóng ticket khi hoàn thành.
- **Thống kê KPI cá nhân (My KPI - UC22):** Nhân viên tự theo dõi sản lượng công việc của bản thân theo từng kỳ (số đơn đã xử lý, số ticket đã giải quyết).

---

### 👑 Phân hệ Quản trị viên (Admin)

- **Dashboard Tổng quan (Overview):** Thống kê doanh thu theo ngày/tháng, số lượng đơn hàng, số người dùng mới, biểu đồ xu hướng kinh doanh và danh sách sản phẩm bán chạy nhất.
- **Quản lý sản phẩm (Product CRUD):** Thêm mới, chỉnh sửa thông tin, giá bán, số lượng tồn kho, tải hình ảnh lên Cloudinary và xóa sản phẩm.
- **Quản lý nghệ danh (Artisan Management - UC21):** Thêm mới, cập nhật tiểu sử, hình đại diện của nghệ nhân và liên kết các sản phẩm do nghệ nhân đó sáng tác.
- **Quản lý Voucher & Khuyến mãi:** Thiết lập mã giảm giá theo số tiền cố định hoặc phần trăm, thời hạn hiệu lực, số lượt sử dụng tối đa và theo dõi số liệu thống kê sử dụng (`VoucherStatsPage`).
- **Quản lý nhân viên (Staff Management - UC06):** Thêm mới tài khoản nhân viên (hệ thống tự động sinh mật khẩu và gửi email thông báo), khóa/mở khóa tài khoản nhân viên.
- **Giám sát KPI toàn hệ thống (Staff KPI - UC22):** Quản trị viên theo dõi nhật ký hoạt động, hiệu suất làm việc chi tiết của từng nhân viên trên toàn hệ thống.
- **Quản lý tài chính & Dự toán rút tiền (UC18):** Xem tổng số tiền của tất cả yêu cầu rút tiền đang chờ xử lý để ban vận hành chủ động chuẩn bị dòng tiền mặt.
- **Cấu hình hệ thống (Settings):** Tùy chỉnh các thông số vận hành của nền tảng.

---

### ⚙️ Hạ tầng kỹ thuật nền tảng (Core Services)

- **Strict Isolation Environment:** Hệ thống tách bạch tuyệt đối: dev chỉ đọc `.env.dev`, prod chỉ đọc `.env.prod`.
- **Throttler Rate Limiting:** Bảo vệ API khỏi các cuộc tấn công Brute-force và DDoS (giới hạn request linh hoạt cho từng endpoint nhạy cảm như login, OTP).
- **Auto Data Seeding:** Tự động kiểm tra và khởi tạo sẵn 3 tài khoản mẫu với 3 vai trò khác nhau ngay khi Backend khởi động lần đầu.
- **Cloudinary CDN Integration:** Tự động upload và tối ưu hóa hình ảnh thông qua `streamifier` và `Multer`.

---

## 3. Hướng Dẫn Cài Đặt & Thiết Lập Môi Trường (Env)

### 📋 Yêu cầu tiên quyết (Prerequisites)

Trước khi tiến hành cài đặt, đảm bảo máy tính của bạn đã có:
- **Node.js:** Phiên bản `>= 18.x` (Khuyến nghị sử dụng Node.js `20.x` LTS hoặc `22.x`).
- **npm:** Phiên bản `>= 9.x` (đi kèm Node.js).
- **Git:** Đã cài đặt trên máy.
- **Dịch vụ Database & Cloud:**
  - MySQL Server (Local port `3306` hoặc Cloud MySQL).
  - Redis Server (Local port `6379` hoặc Cloud Redis/Valkey).
  - OpenSearch Server (Local port `9200` hoặc Cloud OpenSearch).

> [!NOTE]
> File `.env.dev` trong thư mục `backend/` cần được cấu hình các kết nối Database (MySQL, Valkey/Redis, OpenSearch), Cloudinary và Cổng thanh toán Sandbox trước khi chạy ứng dụng.

---

### 📦 Cài đặt Dependencies

Dự án là một Monorepo với 3 khu vực cần cài đặt thư viện:

```bash
# 1. Cài đặt thư viện tại thư mục gốc Monorepo (Bao gồm Playwright runner)
npm install

# 2. Cài đặt thư viện cho Backend
cd backend
npm install
cd ..

# 3. Cài đặt thư viện cho Frontend Web
cd web
npm install
cd ..
```

---

### 🔑 Cấu hình biến môi trường Backend (`.env.dev`)

Backend tự động nạp cấu hình từ file `backend/.env.dev` khi chạy ở chế độ dev. Kiểm tra hoặc tạo file `backend/.env.dev` với nội dung mẫu chuẩn sau:

```env
# ==========================================
# MARKETNEST BACKEND - ENVIRONMENT: DEV
# ==========================================

# 1. Server Configuration
PORT=3000
NODE_ENV=development
APP_ENV=dev

# 2. Public URLs & CORS
APP_PUBLIC_URL=http://localhost:5173
BACKEND_PUBLIC_URL=http://localhost:3000
PAYMENT_CALLBACK_BASE_URL=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# 3. Database (MySQL)
DB_HOST=localhost # hoặc host Cloud MySQL (VD: mysql-xxx.aivencloud.com)
DB_PORT=3306
DB_USER=root
DB_PASS=your_database_password
DB_NAME=tmdtdb
DB_SSL=false

# 4. Redis / Valkey Cache
REDIS_URI=redis://localhost:6379 # hoặc rediss://default:your_redis_password@valkey-xxx.aivencloud.com:23907

# 5. OpenSearch
OPENSEARCH_NODE=http://localhost:9200 # hoặc https://opensearch-xxx.aivencloud.com:23906
OPENSEARCH_USERNAME=admin
OPENSEARCH_PASSWORD=your_opensearch_password

# 6. Authentication & JWT
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_ACCESS_EXPIRES_IN=7d

# 7. Cloudinary (Media Storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=TMDT_Cloudinary

# 8. Mailer (SMTP / Nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
MAIL_FROM="MarketNest <your_email@gmail.com>"

# 9. Default Administrator Seed
ADMIN_MAIL=admin@marketnest.com
ADMIN_PASSWORD=Admin@123456
ADMIN_FULL_NAME=MarketNest Administrator
ADMIN_AVATAR_URL=https://res.cloudinary.com/demo/image/upload/avatar.png

# 10. Payment Gateways (Sandbox)
MOMO_PARTNER_CODE=your_momo_partner_code
MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret_key
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create

VNP_TMN_CODE=your_vnp_tmn_code
VNP_HASH_SECRET=your_vnp_hash_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret
PAYPAL_ENVIRONMENT=sandbox
```

---

### 🔑 Cấu hình biến môi trường Frontend (`.env.dev`)

Frontend đọc cấu hình từ file `web/.env.dev`. Kiểm tra hoặc tạo file `web/.env.dev`:

```env
# Web Development Environment
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000
```

---

### 👥 Tài khoản kiểm thử mặc định (Auto-Seeded)

Khi Backend khởi động, hàm `seedUsers` trong `backend/src/main.ts` sẽ tự động khởi tạo 3 tài khoản tương ứng với 3 vai trò nếu chưa tồn tại trong cơ sở dữ liệu:

| Vai trò (Role) | Email đăng nhập | Mật khẩu mặc định | Quyền hạn truy cập |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (ADMIN)** | `admin@example.com` | `password123` | Toàn quyền quản trị hệ thống, Dashboard, Quản lý nhân viên, KPI, Sản phẩm, Duyệt rút tiền |
| **Nhân viên (STAFF)** | `staff@example.com` | `password123` | Quản lý đơn hàng, Hỗ trợ khách hàng, Xử lý đổi trả, Quản lý đấu giá, KPI cá nhân |
| **Khách hàng (USER)** | `client@example.com` | `password123` | Mua sắm, Đấu giá, Ví điện tử, Giỏ hàng, Theo dõi đơn, Yêu cầu hỗ trợ |

---

### 🚀 Khởi chạy ứng dụng (Development)

Bạn có thể chạy dự án thông qua **2 cách**:

#### Cách 1: Chạy từ thư mục gốc Monorepo (Khuyên dùng)
Mở 2 cửa sổ Terminal tại thư mục gốc `MarketPlace`:

- **Terminal 1 - Khởi chạy Backend:**
  ```bash
  npm run backend:dev
  ```
  *(Backend lắng nghe tại: `http://localhost:3000`)*

- **Terminal 2 - Khởi chạy Frontend Web:**
  ```bash
  npm run web:dev
  ```
  *(Frontend lắng nghe tại: `http://localhost:5173`)*

#### Cách 2: Chạy trực tiếp từ từng thư mục con
- **Khởi chạy Backend:**
  ```bash
  cd backend
  npm run dev
  ```
- **Khởi chạy Frontend Web:**
  ```bash
  cd web
  npm run dev
  ```

---

## 4. Hướng Dẫn Chạy Kiểm Thử Với Playwright

### 🧪 Tổng quan bộ kiểm thử tự động

Bộ kiểm thử tự động của MarketNest được xây dựng trên nền tảng **Playwright Test** với 3 dự án (projects) độc lập được cấu hình tại `playwright.config.ts`:

```mermaid
graph LR
    Root[Playwright Test Suite] --> API[Project: api - playwright/api]
    Root --> UI[Project: ui - playwright/ui]
    Root --> E2E[Project: e2e - playwright/e2e]
    
    API -->|BaseURL: http://127.0.0.1:3000| Backend[(Backend API Endpoints)]
    UI -->|BaseURL: http://localhost:5173| Web[(Frontend Component & Pages)]
    E2E -->|BaseURL: http://localhost:5173| FullFlow[(Full User Journey & DB Flow)]
```

1. **API Tests (`playwright/api/`):** Kiểm thử tính đúng đắn của toàn bộ các REST API endpoints (Auth, Products, Cart, Orders, KPI, Support, ...) mà không cần mở trình duyệt.
2. **UI Tests (`playwright/ui/`):** Kiểm thử hành vi người dùng trên từng trang giao diện (Login, Register, Marketplace, Cart, Dashboard, Quản lý KPI, ...) đảm bảo hiển thị đúng trạng thái.
3. **E2E Tests (`playwright/e2e/`):** Kiểm thử luồng nghiệp vụ hoàn chỉnh xuyên suốt từ giao diện đến cơ sở dữ liệu (ví dụ: đăng ký -> đăng nhập -> tìm sản phẩm -> thêm vào giỏ -> đặt hàng -> thanh toán).

---

### ⚠️ Điều kiện trước khi chạy test

> [!IMPORTANT]
> - **Backend PHẢI đang chạy** tại `http://localhost:3000` (`npm run backend:dev`).
> - **Frontend Web PHẢI đang chạy** tại `http://localhost:5173` (`npm run web:dev`).
> - **Database & Redis PHẢI sẵn sàng** để các test case có thể tương tác với dữ liệu thực tế.

---

### 💻 Các lệnh chạy Playwright từ thư mục Root

Thực hiện toàn bộ các lệnh dưới đây từ thư mục gốc của dự án (`MarketPlace`):

#### 1. Cài đặt trình duyệt Playwright (Lần đầu tiên)
Nếu chưa tải binary các trình duyệt Chromium/Firefox/WebKit:
```bash
npx playwright install --with-deps chromium
```

#### 2. Chạy toàn bộ Test Suite (API, UI, E2E)
```bash
npm run test:all
# hoặc
npm run test
# hoặc
npx playwright test
```

#### 3. Chạy riêng từng loại Test (Project-based)
- **Chỉ chạy API Automation Test:**
  ```bash
  npm run test:api
  # hoặc: npx playwright test --project=api
  ```
- **Chỉ chạy UI Component Automation Test:**
  ```bash
  npm run test:ui
  # hoặc: npx playwright test --project=ui
  ```
- **Chỉ chạy End-to-End (E2E) Test:**
  ```bash
  npm run test:e2e
  # hoặc: npx playwright test --project=e2e
  ```

#### 4. Chạy một file kiểm thử cụ thể
Để kiểm tra riêng một chức năng (ví dụ đăng nhập hoặc giỏ hàng):
```bash
# Chạy file login_api
npx playwright test playwright/api/login_api.spec.ts

# Chạy file giỏ hàng API
npx playwright test playwright/api/cart_api.spec.ts

# Chạy file login E2E
npx playwright test playwright/e2e/login_e2e.spec.ts

# Cú pháp chạy qua npm script
npm run test -- login_api.spec.ts
```

#### 5. Chạy giao diện tương tác trực quan (UI Mode)
Playwright UI Mode cung cấp giao diện trực quan cho phép xem trực tiếp từng bước test, time travel, xem DOM snapshot và tự động chạy lại khi sửa file test:
```bash
npx playwright test --ui
```

#### 6. Chạy chế độ hiển thị trình duyệt (Headed Mode) & Gỡ lỗi (Debug)
- **Hiển thị cửa sổ trình duyệt khi test đang chạy:**
  ```bash
  npx playwright test --headed
  ```
- **Bật Playwright Inspector để debug từng dòng lệnh test:**
  ```bash
  npx playwright test --debug
  ```

---

## 5. Hướng Dẫn Xem & Phân Tích Báo Cáo Playwright

Sau mỗi lượt thực thi, Playwright tự động tổng hợp toàn bộ kết quả kiểm thử vào thư mục:
- Báo cáo HTML trực quan: `playwright/playwright-report/`
- Dữ liệu vết, log lỗi và trace: `playwright/test-results/`

---

### 🌐 Mở giao diện báo cáo HTML Report

#### Cách 1: Dùng lệnh Playwright CLI tích hợp (Khuyên dùng)
Từ thư mục gốc dự án, chạy lệnh:
```bash
npx playwright show-report playwright/playwright-report
```
Lệnh này sẽ tự động khởi động một Web Server cục bộ (thường tại `http://localhost:9323`) và tự động bật trình duyệt hiển thị báo cáo.

> [!TIP]
> Bạn có thể chỉ định cổng cụ thể nếu cổng mặc định bị trùng:
> ```bash
> npx playwright show-report playwright/playwright-report --port 9333
> ```

#### Cách 2: Mở trực tiếp file HTML
Bạn có thể mở trực tiếp file `playwright/playwright-report/index.html` bằng trình duyệt web hoặc sử dụng tiện ích **Live Server** trong VS Code / IDE.

---

### 📊 Cấu trúc kết quả và nội dung báo cáo

Giao diện báo cáo HTML của Playwright cung cấp thông tin cực kỳ chi tiết:

1. **Bảng thống kê tổng quan (Summary Dashboard):**
   - Số lượng test **Passed** (thành công), **Failed** (thất bại), **Flaky** (chập chờn) và **Skipped** (bỏ qua).
   - Tổng thời gian thực thi của từng Project (`api`, `ui`, `e2e`).
2. **Bộ lọc theo Project & Tag:**
   - Dễ dàng lọc riêng kết quả của API tests hoặc E2E tests.
3. **Chi tiết từng Test Case:**
   - Nhấp vào bất kỳ test case nào để xem chi tiết:
     - **Before Hooks & Setup:** Quá trình chuẩn bị môi trường, đăng nhập lấy token.
     - **Action Steps:** Từng hành động (`page.goto`, `locator.click`, `expect.toBeVisible`, `request.post`).
     - **Duration:** Thời gian thực thi chi tiết của từng bước (tính bằng mili-giây).
4. **Thông tin lỗi chi tiết (Error Details):**
   - Khi một test case bị Failed:
     - Hiển thị rõ ràng đoạn code gây lỗi và Call Stack.
     - So sánh giá trị mong đợi (`expected`) và giá trị thực tế nhận được (`received`).
     - **Error Context Markdown:** Gợi ý ngữ cảnh gây lỗi.
     - **Screenshot:** Ảnh chụp màn hình tại đúng thời điểm xảy ra lỗi.

---

### 🔍 Sử dụng Playwright Trace Viewer để gỡ lỗi (Trace Inspection)

Khi một test case thất bại và được chạy lại (retry), Playwright tự động ghi lại toàn bộ hành trình vào file `trace.zip` trong `playwright/test-results/`.

Để mở và tua lại toàn bộ diễn biến của phiên test bị lỗi:
```bash
npx playwright show-trace playwright/test-results/<tên-thư-mục-test-bị-lỗi>/trace.zip
```

**Tính năng trong Trace Viewer:**
- **Timeline:** Tua lại từng mili-giây quá trình test chạy.
- **Action Snapshot:** Xem ảnh chụp trạng thái DOM trước (before) và sau (after) mỗi click hay gõ phím.
- **Network Tab:** Xem toàn bộ các HTTP Request/Response mà frontend đã gửi lên backend kèm Header và Payload.
- **Console Log:** Xem lại tất cả `console.log` và cảnh báo JavaScript trên trình duyệt tại thời điểm chạy test.

---

<p align="center">
  <b>MarketNest Platform</b> • Được xây dựng với đam mê dành cho sản phẩm thủ công truyền thống Việt Nam 🇻🇳
</p>
