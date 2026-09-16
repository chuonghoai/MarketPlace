# Kiến trúc Environment Configuration

Tài liệu này giải thích chi tiết về kiến trúc cấu hình môi trường chuẩn hóa của Backend MarketNest, tối giản và phân tách rõ ràng thành 2 môi trường: **Development (`.env.dev`)** và **Production (`.env.prod`)**.

## 1. Các biến Environment Cốt Lõi

Hệ thống sử dụng các biến URL và cấu hình cốt lõi để đảm bảo hoạt động an toàn và độc lập:

### Backend

- **`APP_PUBLIC_URL`**: 
  - **Ý nghĩa**: Đường dẫn công khai tới Frontend đang phục vụ người dùng.
  - **Sử dụng**: Làm URL trả về (`ReturnUrl`) cho các dịch vụ Thanh toán (VNPay, MoMo, PayPal) sau khi User thanh toán xong. Ngoài ra dùng để render link nhúng trong Email thông báo.
  - Dev: `http://localhost:5173` | Prod: `https://marketnestplatform.vercel.app`

- **`BACKEND_PUBLIC_URL`**:
  - **Ý nghĩa**: Đường dẫn công khai tới Backend API.
  - **Sử dụng**: Làm URL cho Swagger, OpenAPI, các đường dẫn tĩnh (Static Files, Uploads).
  - Dev: `http://localhost:3000` | Prod: `https://marketnestplatform.onrender.com`

- **`PAYMENT_CALLBACK_BASE_URL`**:
  - **Ý nghĩa**: Đường dẫn công khai độc lập để các Payment Gateway (VNPay, MoMo, PayPal) gọi IPN / Webhook về Backend.
  - **Sử dụng**: Làm Webhook / IPN URL (`IpnUrl` hoặc `CaptureUrl`).

- **`CORS_ALLOWED_ORIGINS`**:
  - **Ý nghĩa**: Danh sách nguồn gốc (Origins) được phép gọi API qua CORS (phân tách bằng dấu phẩy).
  - **Sử dụng**: Cấu hình trong `app.enableCors()`.
  - Dev: `http://localhost:5173,http://localhost:3000` | Prod: `https://marketnestplatform.vercel.app`

- **`DB_SSL`**:
  - **Ý nghĩa**: Cờ bật/tắt kết nối SSL tới cơ sở dữ liệu MySQL (`true` hoặc `false`).
  - Dev: `false` (phù hợp với MySQL local) | Prod: `true` (kết nối an toàn tới Cloud MySQL).

## 2. Chuẩn Hóa 2 Môi Trường (`APP_ENV`)

Hệ thống tuân thủ nghiêm ngặt nguyên tắc **Strict Isolation**:

- **`.env.dev`** (`APP_ENV=dev`, `NODE_ENV=development`):
  - Dùng cho lập trình, phát triển tính năng hằng ngày trên máy cá nhân.
  - Tự động nạp khi chạy `npm run dev` hoặc `npm run start:dev`.

- **`.env.prod`** (`APP_ENV=prod`, `NODE_ENV=production`):
  - Dùng cho kiểm thử bản build phát hành và triển khai thực tế trên Cloud/Server.
  - Kết nối tới hạ tầng Cloud Database, Cloud Redis và URLs thực tế.
  - Tự động nạp khi chạy `npm run prod` hoặc `npm run start:prod`.

## 3. Bảng Tổng Hợp Cấu Hình (Configuration Matrix)

| APP_ENV / Chế độ | Frontend URL (APP_PUBLIC_URL) | Backend URL (BACKEND_PUBLIC_URL) | Callback URL (PAYMENT_CALLBACK_BASE_URL) | DB_SSL |
| :--- | :--- | :--- | :--- | :--- |
| **Dev** (`.env.dev`) | `http://localhost:5173` | `http://localhost:3000` | `http://localhost:3000` | `false` |
| **Prod** (`.env.prod`) | `https://marketnestplatform.vercel.app` | `https://marketnestplatform.onrender.com` | `https://marketnestplatform.onrender.com` | `true` |
