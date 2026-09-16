# 🎨 MarketNest

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/TypeORM-FE0902?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM"/>
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT"/>
  <img src="https://img.shields.io/badge/License-MIT-success?style=for-the-badge" alt="License"/>
</p>

### 🌿 Nền tảng thương mại điện tử sản phẩm thủ công mỹ nghệ - Backend Service

> Kết nối nghệ nhân với khách hàng thông qua nền tảng mua sắm trực tuyến hiện đại, thân thiện và dễ sử dụng. Hệ thống Backend đóng vai trò cốt lõi xử lý toàn bộ logic nghiệp vụ, bảo mật, và dữ liệu cho MarketNest.

---

## 📚 Mục lục

* [Giới thiệu](#-giới-thiệu)
* [Chức năng](#-chức-năng)
* [Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
* [Cấu trúc dự án](#️-cấu-trúc-dự-án)
* [Cài đặt dự án](#️-cài-đặt-dự-án)
* [Cấu hình biến môi trường](#-cấu-hình-biến-môi-trường)
* [Chạy dự án](#️-chạy-dự-án)
* [Hướng dẫn đóng góp](#-hướng-dẫn-đóng-góp)
* [Ghi chú](#-ghi-chú)

---

## 🚀 Giới thiệu

**MarketNest Backend** là xương sống của nền tảng thương mại điện tử dành riêng cho các sản phẩm thủ công mỹ nghệ. Hệ thống được xây dựng với mục tiêu:
- 🎯 **Cung cấp API mạnh mẽ, ổn định** cho nền tảng Frontend Web và Mobile.
- 🛡️ **Bảo mật tối đa** với hệ thống phân quyền chặt chẽ và xác thực JWT.
- ⚡ **Tối ưu hiệu năng** thông qua việc tích hợp OpenSearch cho khả năng tìm kiếm nhanh chóng và linh hoạt.
- 💳 **Thanh toán đa dạng** với sự hỗ trợ của các cổng thanh toán hàng đầu (MoMo, VNPay, PayPal).

Đối tượng sử dụng hệ thống API này bao gồm đội ngũ phát triển Frontend, Mobile App và hệ thống quản trị của doanh nghiệp.

---

## 💻 Chức năng

### 👤 Chức năng dành cho Khách hàng
* 📝 **Đăng ký & Xác thực**: Đăng ký, đăng nhập và bảo mật bằng JWT (Access/Refresh Token).
* 🛍️ **Duyệt sản phẩm**: Hiển thị danh sách sản phẩm, chi tiết sản phẩm.
* 🔎 **Tìm kiếm sản phẩm**: Tìm kiếm toàn văn bản nâng cao với OpenSearch.
* 🏷️ **Lọc theo danh mục**: Phân loại và lọc sản phẩm.
* 🛒 **Quản lý giỏ hàng**: Thêm, sửa, xóa sản phẩm trong giỏ hàng.
* 💳 **Thanh toán đơn hàng**: Hỗ trợ thanh toán qua MoMo, VNPay, PayPal.
* 🚚 **Theo dõi đơn hàng**: Xem lịch sử và trạng thái đơn hàng.
* ⭐ **Đánh giá sản phẩm**: Để lại nhận xét và chấm điểm cho sản phẩm đã mua.
* 🎁 **Sử dụng voucher**: Áp dụng mã giảm giá.
* 👤 **Quản lý hồ sơ cá nhân**: Cập nhật thông tin cá nhân.

### 👨‍💼 Chức năng dành cho Quản trị viên
* 📊 **Dashboard**: Tổng quan hệ thống, thống kê doanh thu và chỉ số quan trọng.
* 📦 **Quản lý sản phẩm**: Thêm mới, cập nhật, xóa sản phẩm và duyệt sản phẩm từ người bán.
* 📑 **Quản lý đơn hàng**: Theo dõi và cập nhật trạng thái đơn hàng toàn hệ thống.
* 🎟️ **Quản lý voucher**: Tạo và quản lý các chiến dịch khuyến mãi.
* 👥 **Quản lý người dùng**: Quản lý danh sách User, Staff, Seller và Admin.
* 🖼️ **Quản lý Media**: Upload hình ảnh an toàn qua Cloudinary.
* 📧 **Hệ thống Email**: Gửi email tự động thông qua Nodemailer.

---

## 🛠️ Công nghệ sử dụng

Hệ thống được phát triển dựa trên các công nghệ và thư viện hiện đại nhất:

| Công nghệ | Vai trò |
| :--- | :--- |
| <img src="https://skillicons.dev/icons?i=nestjs" width="20"/> **NestJS** | Framework chính xây dựng backend, kiến trúc module hóa |
| <img src="https://skillicons.dev/icons?i=typescript" width="20"/> **TypeScript** | Ngôn ngữ lập trình chính, đảm bảo Type Safety |
| <img src="https://skillicons.dev/icons?i=mysql" width="20"/> **MySQL** | Hệ quản trị cơ sở dữ liệu quan hệ |
| 🗄️ **TypeORM** | Object-Relational Mapper (ORM) giao tiếp với Database |
| 🔐 **JWT & Passport** | Hệ thống bảo mật, xác thực và phân quyền người dùng |
| ☁️ **Cloudinary** | Dịch vụ lưu trữ hình ảnh đám mây |
| 📧 **Nodemailer** | Gửi email thông báo tự động (đơn hàng, xác thực) |
| 💳 **MoMo/VNPay/PayPal** | Tích hợp cổng thanh toán trực tuyến |
| 🔎 **OpenSearch** | Search engine mạnh mẽ cho chức năng tìm kiếm sản phẩm |

---

## 🗂️ Cấu trúc dự án

Dự án được tổ chức theo kiến trúc module của NestJS, giúp dễ dàng mở rộng và bảo trì:

```text
src/
├── constants/         # Chứa các hằng số và enums dùng chung cho toàn hệ thống
├── core/              # Các module cốt lõi (Interceptors, Filters, Guards, Decorators)
├── log/               # Cấu hình ghi log hệ thống
├── module/            # Các tính năng chính (Feature modules) của ứng dụng
│   ├── admin-dashboard/ # API cho màn hình thống kê Admin
│   ├── admins/          # Quản lý tài khoản Admin
│   ├── auth/            # Tính năng xác thực & phân quyền
│   ├── cart/            # Logic quản lý giỏ hàng
│   ├── categories/      # Logic quản lý danh mục sản phẩm
│   ├── checkout/        # Logic xử lý thanh toán (MoMo, VNPay, PayPal)
│   ├── mails/           # Dịch vụ gửi email tự động
│   ├── media/           # Xử lý upload file lên Cloudinary
│   ├── opensearch/      # Dịch vụ tìm kiếm nâng cao
│   ├── orders/          # Quản lý đơn hàng
│   ├── products/        # Quản lý thông tin sản phẩm
│   ├── reviews/         # Tính năng đánh giá & nhận xét
│   ├── sellers/         # Chức năng cho người bán
│   ├── staffs/          # Quản lý nhân viên
│   ├── users/           # Quản lý người dùng cuối
│   └── vouchers/        # Quản lý mã giảm giá
├── template/          # Giao diện email (HTML templates)
├── utils/             # Các hàm tiện ích (Helpers) hỗ trợ
├── app.module.ts      # Module gốc tổng hợp toàn bộ các module khác
└── main.ts            # File cấu hình và khởi chạy ứng dụng
```

---

## ⚙️ Cài đặt dự án & Khởi chạy Nhanh

Hệ thống Backend MarketNest yêu cầu **Node.js (v18+)** và các dịch vụ: **MySQL 8.0**, **Redis** và **OpenSearch**.

### 1️⃣ Cài đặt thư viện dependencies
Tại thư mục `backend`:
```bash
npm install
```

---

## 🔑 Cấu hình Biến Môi Trường (Environment Configuration)

Hệ thống được chuẩn hóa tối giản thành **2 file môi trường duy nhất**:
- **`.env.dev`**: Môi trường phát triển cục bộ (Local Development).
- **`.env.prod`**: Môi trường triển khai thực tế (Production Deployment).

> 🔒 **Bảo mật**: Cả 2 file này đều được khai báo trong `.gitignore` để tránh rò rỉ secret lên Git.

### 1. Môi trường Development (`.env.dev`)
Dùng khi phát triển hằng ngày trên máy cá nhân:
```env
PORT=3000
NODE_ENV=development
APP_ENV=dev

APP_PUBLIC_URL=http://localhost:5173
BACKEND_PUBLIC_URL=http://localhost:3000
PAYMENT_CALLBACK_BASE_URL=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB_NAME=marketnest_db
DB_SSL=false

REDIS_URI=redis://127.0.0.1:6379

OPENSEARCH_NODE=http://127.0.0.1:9200
OPENSEARCH_USERNAME=admin
OPENSEARCH_PASSWORD=admin

JWT_ACCESS_SECRET=marketnest_dev_access_secret_key_super_secure_123456
JWT_REFRESH_SECRET=marketnest_dev_refresh_secret_key_super_secure_654321
JWT_ACCESS_EXPIRES_IN=7d
```

### 2. Môi trường Production (`.env.prod`)
Dùng khi build và triển khai sản phẩm thật, trỏ tới hạ tầng Cloud Database, Cloud Redis và Production URLs:
```env
PORT=3000
NODE_ENV=production
APP_ENV=prod

APP_PUBLIC_URL=https://marketnestplatform.vercel.app
BACKEND_PUBLIC_URL=https://marketnestplatform.onrender.com
PAYMENT_CALLBACK_BASE_URL=https://marketnestplatform.onrender.com
CORS_ALLOWED_ORIGINS=https://marketnestplatform.vercel.app

DB_HOST=your_prod_mysql_host
DB_PORT=3306
DB_USER=your_prod_mysql_user
DB_PASS=your_prod_mysql_password
DB_NAME=tmdtdb
DB_SSL=true

REDIS_URI=rediss://default:your_password@your_prod_redis:6379
```

### 3. Bảng danh mục biến môi trường chi tiết

| Biến | Ý nghĩa | Ví dụ Dev | Ví dụ Prod |
| :--- | :--- | :--- | :--- |
| `PORT` | Cổng HTTP Server lắng nghe | `3000` | `3000` |
| `NODE_ENV` | Chế độ Node runtime | `development` | `production` |
| `APP_ENV` | Phân hệ môi trường | `dev` | `prod` |
| `APP_PUBLIC_URL` | URL công khai của Frontend (để chuyển hướng) | `http://localhost:5173` | `https://marketnestplatform.vercel.app` |
| `BACKEND_PUBLIC_URL` | URL công khai của Backend | `http://localhost:3000` | `https://marketnestplatform.onrender.com` |
| `PAYMENT_CALLBACK_BASE_URL` | URL nhận Webhook/IPN thanh toán | `http://localhost:3000` | `https://marketnestplatform.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | Danh sách Origin cho phép gọi API (phân tách bởi dấu phẩy) | `http://localhost:5173,http://localhost:3000` | `https://marketnestplatform.vercel.app` |
| `DB_HOST` | Host máy chủ MySQL | `127.0.0.1` | `mysql-cluster.prod.com` |
| `DB_PORT` | Cổng kết nối MySQL | `3306` | `3306` |
| `DB_USER` | Tên người dùng MySQL | `root` | `prod_user` |
| `DB_PASS` | Mật khẩu MySQL | `root` | `strong_pass` |
| `DB_NAME` | Tên cơ sở dữ liệu | `marketnest_db` | `tmdtdb` |
| `DB_SSL` | Bật/tắt SSL cho kết nối Database | `false` (Local MySQL) | `true` (Cloud DB) |
| `REDIS_URI` | Chuỗi URI kết nối Redis | `redis://127.0.0.1:6379` | `rediss://...` |
| `OPENSEARCH_NODE` | URL máy chủ OpenSearch | `http://127.0.0.1:9200` | `https://...` |
| `OPENSEARCH_USERNAME` | Tên đăng nhập OpenSearch | `admin` | `prod_admin` |
| `OPENSEARCH_PASSWORD` | Mật khẩu OpenSearch | `admin` | `prod_pass` |
| `JWT_ACCESS_SECRET` | Secret mã hóa Access Token | `dev_secret_key` | `prod_secret_key` |
| `JWT_REFRESH_SECRET` | Secret mã hóa Refresh Token | `dev_refresh_key` | `prod_refresh_key` |
| `JWT_ACCESS_EXPIRES_IN`| Thời hạn sống của Access Token | `7d` | `7d` |
| `CLOUDINARY_*` | Bộ cấu hình tải ảnh Cloudinary | `...` | `...` |
| `MAIL_*` | Cấu hình SMTP Nodemailer | `...` | `...` |
| `ADMIN_*` | Thông tin tài khoản Admin khởi tạo ban đầu | `admin@marketnest.com` | `...` |
| `MOMO_*` / `VNP_*` / `PAYPAL_*` | Khóa tích hợp cổng thanh toán | Sandbox credentials | Production credentials |

---

## ▶️ Hướng Dẫn Chạy Dự Án

Hệ thống được thiết kế cơ chế **Strict Isolation** (Cô lập tuyệt đối): Khi chạy lệnh dev thì 100% chỉ nạp `.env.dev`, khi chạy lệnh prod thì 100% chỉ nạp `.env.prod`, không bao giờ xảy ra tình trạng nạp nhầm biến môi trường.

### 1. Chạy Development (Khuyên dùng khi lập trình)

- **Cách 1: Chạy từ thư mục `backend/`:**
  ```bash
  npm run dev
  # hoặc
  npm run start:dev
  ```

- **Cách 2: Chạy từ thư mục gốc Monorepo:**
  ```bash
  npm run backend:dev
  ```

- **Đặc điểm:**
  - Tự động nạp cấu hình từ `.env.dev`.
  - Bật tính năng Hot-reload (tự restart server khi lưu code).
  - Backend chạy tại: `http://localhost:3000`.

---

### 2. Chạy Production (Dùng khi kiểm thử bản release hoặc deploy)

- **Bước 1: Build mã nguồn:**
  ```bash
  npm run build:prod
  ```

- **Bước 2: Khởi chạy server Production:**
  - **Từ thư mục `backend/`:**
    ```bash
    npm run prod
    # hoặc
    npm run start:prod
    ```
  - **Từ thư mục gốc Monorepo:**
    ```bash
    npm run backend:prod
    ```

- **Đặc điểm:**
  - Tự động nạp cấu hình từ `.env.prod`.
  - Chạy bằng Node.js tối ưu hiệu năng từ thư mục `dist/`.

---

## ❓ Khắc phục sự cố thường gặp (Troubleshooting)

1. **Lỗi `REDIS_URI is not defined in environment variables`:**
   - Nguyên nhân: Chưa tạo hoặc thiếu biến `REDIS_URI` trong file `.env.dev`.
   - Khắc phục: Đảm bảo file `.env.dev` có dòng `REDIS_URI=redis://127.0.0.1:6379`.

2. **Lỗi kết nối MySQL `ECONNREFUSED 127.0.0.1:3306`:**
   - Nguyên nhân: MySQL cục bộ chưa được bật hoặc thông số kết nối chưa đúng.
   - Khắc phục: Kiểm tra dịch vụ MySQL đang chạy và kiểm tra lại `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS` trong file `.env.dev`.

3. **Lỗi SSL Handshake khi kết nối Database:**
   - Nguyên nhân: Kết nối tới MySQL local nhưng lại bật SSL.
   - Khắc phục: Đảm bảo biến `DB_SSL=false` trong file `.env.dev`. Khi deploy lên Cloud MySQL (Aiven, RDS), hãy đặt `DB_SSL=true` trong `.env.prod`.

---

## 🤝 Hướng dẫn đóng góp

Chúng tôi luôn hoan nghênh những đóng góp từ cộng đồng. Hãy làm theo các bước sau để đóng góp vào dự án:

- [x] **Fork** repository này về tài khoản cá nhân.
- [x] **Tạo branch mới** chứa tính năng hoặc bản vá lỗi của bạn: `git checkout -b feature/ten-tinh-nang`
- [x] **Commit code** với thông điệp rõ ràng: `git commit -m 'Thêm tính năng đăng nhập bằng Google'`
- [x] **Push branch** lên GitHub: `git push origin feature/ten-tinh-nang`
- [x] **Tạo Pull Request** để chúng tôi review và merge code.

---

## 🌐 Link Deploy

- **Frontend (Vercel):** [https://marketnestplatform.vercel.app](https://marketnestplatform.vercel.app)
- **Backend (Render):** [https://marketnestplatform.onrender.com](https://marketnestplatform.onrender.com)

---

## 📌 Ghi chú

> ⚠️ Đây là dự án được xây dựng phục vụ mục đích học tập, nghiên cứu và thực hành phát triển phần mềm.
>
> 🚫 Không được thiết kế cho môi trường thương mại thực tế.
>
> 🎓 Dự án được phát triển nhằm nâng cao kỹ năng thiết kế hệ thống, lập trình Fullstack, xây dựng API và triển khai ứng dụng web.
