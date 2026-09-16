# GIAI ĐOẠN 9 - PHÂN TÍCH RỦI RO BUG

Phần này đánh giá mức độ rủi ro của các chức năng khác nhau trong hệ thống, nêu chi tiết lý do và mức độ ưu tiên kiểm thử.

## 1. Các Module Rủi ro Cao / Nghiêm trọng (High Risk / Critical)

### 1.1. Tích hợp Cổng thanh toán & Xử lý IPN (MoMo, VNPay, PayPal)
- **Mức độ rủi ro**: **NGHIÊM TRỌNG (CRITICAL)**
- **Lý do**: 
  - Lỗi mạng trong quá trình chuyển hướng thanh toán.
  - Webhook IPN (Thông báo thanh toán tức thì) từ các nhà cung cấp bị trễ.
  - Người dùng can thiệp vào các tham số URL trước khi chuyển hướng về lại website.
- **Kiểm thử ưu tiên**: 
  - Mô phỏng IPN bị trễ sau khi người dùng đã rời khỏi trang web.
  - Kiểm tra việc từ chối giao dịch do sai lệch chữ ký bảo mật (chống giả mạo).

### 1.2. Quản lý Tồn kho & Xử lý Đồng thời (Concurrency)
- **Mức độ rủi ro**: **CAO (HIGH)**
- **Lý do**: 
  - Nhiều người dùng thêm cùng một mặt hàng có số lượng ít vào giỏ hàng cùng một lúc.
  - Tình trạng tranh chấp (race conditions) khi hai người dùng cùng bấm "Thanh toán" vào cùng một mili-giây.
- **Kiểm thử ưu tiên**: 
  - Kiểm thử đồng thời: Gửi 5 yêu cầu thanh toán song song cho một mặt hàng chỉ có `stock = 1`. Đảm bảo chính xác 1 yêu cầu thành công và 4 yêu cầu thất bại.

### 1.3. Giới hạn Sử dụng Mã giảm giá (Voucher)
- **Mức độ rủi ro**: **TRUNG BÌNH đến CAO (MEDIUM to HIGH)**
- **Lý do**:
  - Một voucher có `limit = 100` bị dùng tới 101 lần do lỗi tranh chấp dữ liệu (race conditions).
  - Voucher được áp dụng nhưng đơn hàng thất bại, dẫn đến việc voucher bị "khóa" một cách vô lý.
- **Kiểm thử ưu tiên**:
  - Kiểm thử việc hoàn trả (rollback) lại lượt dùng voucher đối với các đơn hàng thất bại.
  - Kiểm thử đồng thời (concurrency) quá trình áp dụng voucher.

---

## 2. Các Module Rủi ro Trung bình (Medium Risk)

### 2.1. Đồng bộ hóa OpenSearch
- **Mức độ rủi ro**: **TRUNG BÌNH (MEDIUM)**
- **Lý do**: 
  - `Product` được tạo trong cơ sở dữ liệu nhưng quá trình đánh chỉ mục (indexing) lên OpenSearch thất bại.
  - Người dùng tìm kiếm một sản phẩm mới tạo nhưng không thấy.
- **Kiểm thử ưu tiên**: 
  - Kiểm thử cơ chế thử lại (retry) hoặc logic dự phòng (fallback) nếu OpenSearch bị sập trong lúc đang tạo sản phẩm.

### 2.2. Phân trang và Sắp xếp
- **Mức độ rủi ro**: **THẤP đến TRUNG BÌNH (LOW to MEDIUM)**
- **Lý do**: 
  - Các vấn đề về hiệu suất trên các tập dữ liệu lớn nếu các truy vấn cơ sở dữ liệu thiếu chỉ mục (indexes).
  - Kết quả sắp xếp không nhất quán nếu dữ liệu bị thay đổi trong lúc người dùng chuyển trang.
- **Kiểm thử ưu tiên**: 
  - Kiểm thử tải (load test) với 10,000 sản phẩm.

---

## 3. Các Module Rủi ro Thấp (Low Risk)

### 3.1. Cập nhật Hồ sơ Người dùng
- **Mức độ rủi ro**: **THẤP (LOW)**
- **Lý do**: 
  - Các thao tác CRUD (Tạo, Đọc, Sửa, Xóa) đơn giản được giới hạn và cô lập cho từng người dùng riêng biệt.
- **Kiểm thử ưu tiên**: 
  - Các thao tác xác thực form cơ bản (standard validation).
