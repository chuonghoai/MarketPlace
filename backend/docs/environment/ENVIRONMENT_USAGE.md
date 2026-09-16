# Hướng dẫn Chạy Backend (Developer Guide)

Tài liệu này hướng dẫn cách chuyển đổi mượt mà giữa môi trường phát triển (**Dev**) và môi trường phát hành (**Prod**) trên Backend MarketNest mà không cần phải can thiệp thủ công vào code.

---

## 1. Môi trường Development (`.env.dev`)

**Mục đích**: Dành cho quá trình lập trình hằng ngày, viết code, sửa bug và kiểm thử tính năng ngay trên máy cá nhân với hỗ trợ hot-reload.

**Các bước chạy**:
```bash
# Cách 1: Tại thư mục backend/
npm run dev

# Cách 2: Từ thư mục gốc Monorepo
npm run backend:dev
```

**Kết quả**: 
- Backend tự động nạp cấu hình từ `.env.dev`.
- Server lắng nghe tại `http://localhost:3000`.
- Kết nối tự động tới MySQL (`127.0.0.1:3306`), Redis (`127.0.0.1:6379`), OpenSearch (`127.0.0.1:9200`).

---

## 2. Môi trường Production (`.env.prod`)

**Mục đích**: Khởi chạy phiên bản đã được biên dịch tối ưu (Production Build) để kiểm thử bản release hoặc deploy trên Server/Cloud.

**Các bước chạy**:
1. **Build mã nguồn**:
   ```bash
   # Tại thư mục backend/
   npm run build:prod
   ```
2. **Khởi động Backend Production**:
   ```bash
   # Cách 1: Tại thư mục backend/
   npm run prod

   # Cách 2: Từ thư mục gốc Monorepo
   npm run backend:prod
   ```

**Kết quả**: 
- Backend tự động nạp cấu hình từ `.env.prod`.
- Server chạy bằng Node.js trực tiếp từ thư mục `dist/main.js`.
- Tuyệt đối không nạp nhầm file `.env.dev`.

---

## 3. Tổng kết lệnh chuyển đổi môi trường

| Mục tiêu | Lệnh tại thư mục `backend/` | Lệnh tại Root Monorepo | File Env nạp |
| :--- | :--- | :--- | :--- |
| **Phát triển (Dev)** | `npm run dev` hoặc `npm run start:dev` | `npm run backend:dev` | `.env.dev` |
| **Production** | `npm run prod` hoặc `npm run start:prod` | `npm run backend:prod` | `.env.prod` |
| **Build Dev** | `npm run build:dev` | - | `.env.dev` |
| **Build Prod** | `npm run build:prod` | - | `.env.prod` |
