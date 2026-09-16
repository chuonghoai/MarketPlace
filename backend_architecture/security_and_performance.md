# Security & Performance Guidelines (NestJS Backend)

Tài liệu này quy định các tiêu chuẩn bắt buộc về bảo mật và tối ưu hóa hiệu năng trong hệ thống Backend Marketplace.

---

## 1. Authentication & Session Management

### 1.1 JWT (JSON Web Token) Flow
- **Cơ chế truyền Token:** Hỗ trợ song song 2 cách truyền JWT:
  1. Cookie `accessToken` (được parse tự động qua `cookie-parser`).
  2. Header `Authorization: Bearer <token>` (cho Mobile App / API Client).
- **Strategy & Guard:**
  - `JwtStrategy`: Giải mã và xác thực token với secret từ `ConfigService.get('JWT_ACCESS_SECRET')`.
  - `JwtAuthGuard`: Bắt buộc token hợp lệ, trả về `401 Unauthorized` nếu thiếu hoặc sai token.
  - `OptionalJwtAuthGuard`: Cho phép truy cập ẩn danh, nhưng nếu có token hợp lệ thì gắn user vào `req.user`.
- **Hủy phiên đăng nhập (Token Invalidation):**
  - Quản lý phiên làm việc qua trường `tokenVersion` trên Entity `User`.
  - Khi user đổi mật khẩu hoặc đăng xuất khỏi tất cả thiết bị, tăng `tokenVersion` lên 1 đơn vị. Token cũ chứa `version` không khớp sẽ bị từ chối ngay lập tức tại `JwtStrategy.validate()`.

---

## 2. Authorization & Role-based Access Control (RBAC)

- **Định nghĩa Role:** Enum `EUserRole` (`ADMIN`, `STAFF`, `SELLER`, `USER`).
- **Phân quyền Endpoint:**
  ```typescript
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.ADMIN, EUserRole.STAFF)
  ```
- **Ràng buộc:** `RolesGuard` **BẮT BUỘC** đi sau `JwtAuthGuard`. Không đặt `RolesGuard` đứng một mình vì cần `req.user` đã được xác thực trước.

---

## 3. Rate Limiting & Throttler

- **Mục tiêu:** Ngăn chặn Brute Force attack, DDOS và spam endpoint nhạy cảm (như Login, Send OTP, Reset Password).
- **Cấu hình:** Sử dụng `@nestjs/throttler` và `CustomThrottlerGuard` cung cấp mức giới hạn toàn cục và khả năng tùy biến theo IP / User ID.
- **Quy tắc:** Các API gửi email/OTP hoặc xác thực phải được bọc giới hạn tần suất nghiêm ngặt.

---

## 4. Quản lý Bí mật & Mã hóa (Secrets & Cryptography)

- **Môi trường & Biến nhạy cảm:**
  - **TUYỆT ĐỐI KHÔNG hard-code** secret, key, URL, password trong mã nguồn.
  - Tất cả phải được định nghĩa trong file `.env` (`.env.local`, `.env.lan`, `.env.preview`) và nạp qua `ConfigModule` / `ConfigService`.
- **Mã hóa mật khẩu:**
  - Mật khẩu người dùng **BẮT BUỘC** được băm (hash) bằng thư viện `bcrypt` với Salt Rounds tiêu chuẩn (>= 10) trước khi lưu vào DB.
  - **KHÔNG BAO GIỜ** lưu mật khẩu plain text hoặc dùng thuật toán MD5 / SHA đơn thuần cho mật khẩu.

---

## 5. Redis Caching & In-Memory Storage

- **OTP Cooldown & Verification:**
  - Lưu mã OTP đăng ký / quên mật khẩu vào Redis kèm TTL (thời gian hết hạn, ví dụ: 5 phút).
  - Đặt cờ Cooldown trong Redis (ví dụ: 60 giây) để chặn người dùng spam bấm gửi OTP liên tục.
- **Cache dữ liệu tĩnh / ít thay đổi:**
  - Cache danh mục sản phẩm (`categories`), cấu hình hệ thống, banner trang chủ trong Redis để giảm tải cho MySQL.
  - Xóa cache tương ứng khi có thao tác Create / Update / Delete trên danh mục.

---

## 6. Tối ưu hóa Database & Query (TypeORM & MySQL)

- **Tránh N+1 Query Problem:**
  - Sử dụng `relations: ['category', 'images']` trong `find/findOne` hoặc dùng `QueryBuilder.leftJoinAndSelect()` khi cần lấy dữ liệu quan hệ.
  - Tránh duyệt vòng lặp `for` để gọi `repo.findOne()` bên trong.
- **Chỉ Select các cột cần thiết:**
  - Tránh `select *` nếu entity có chứa trường dung lượng lớn (như JSON data, mô tả dài). Sử dụng option `select` của TypeORM.
- **Indexing:**
  - Thêm `@Index()` vào các trường thường xuyên `WHERE`, `ORDER BY`, hoặc `JOIN` (ví dụ: `slug`, `categoryId`, `sellerId`, `status`, `createdAt`).
- **Pagination (Phân trang):**
  - Mọi API danh sách (Products, Orders, Reviews, Users) **BẮT BUỘC** áp dụng phân trang (`page`, `pageSize` / `limit`, `skip`).
  - Trả về metadata: `totalItems`, `totalPages`, `page`, `pageSize`.

---

## 7. OpenSearch cho Full-text Search

- Tách biệt logic tìm kiếm nâng cao (fuzzy search, gợi ý autocomplete, lọc đa tiêu chí sản phẩm) sang OpenSearch Cluster.
- Đồng bộ dữ liệu sản phẩm từ MySQL sang OpenSearch thông qua hook/service khi tạo mới hoặc cập nhật sản phẩm.
