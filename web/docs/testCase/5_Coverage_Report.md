# BÁO CÁO ĐỘ PHỦ KIỂM THỬ (TEST COVERAGE REPORT)

**Tổng quan về Báo cáo Phân tích Chức năng và Kế hoạch Kiểm thử toàn hệ thống**

## 1. Các số liệu thống kê
- **Tổng số màn hình/trang Frontend**: ~23 (14 Client, 9 Admin)
- **Tổng số luồng chức năng đã theo dõi (Flows)**: 7 luồng chính (Duyệt sản phẩm, Thanh toán, Thêm vào giỏ, Admin quản lý Sản phẩm, Cập nhật trạng thái đơn, Đánh giá, v.v.)
- **Tổng số test case đã tạo**: 20 test case đại diện (Admin, Client, Cross-Module).
- **Tổng số dữ liệu quan trọng được theo dõi**: 5 Thực thể chính (Order, Product, Voucher, Review, User, Cart).

## 2. Các dữ liệu đang bị "phủ bụi" (Dusty Data)
- **User Last Login / Status (Lần đăng nhập cuối / Trạng thái)**: Nếu backend có theo dõi lần đăng nhập cuối cùng, cần hiển thị tại trang Quản lý Người dùng của Admin.
- **Voucher Exhaustion Rate (Giới hạn sử dụng mã)**: Dữ liệu giới hạn sử dụng voucher cần được trực quan hoá tốt hơn trong Dashboard Admin (như thanh tiến trình) thay vì chỉ hiển thị con số đơn thuần.

## 3. Các vị trí UI còn thiếu (Missing UI)
- **Cảnh báo Tồn kho trong Giỏ hàng (Cart Stock Warning)**: Giao diện Giỏ hàng (Cart UI) hiện tại có thể thiếu cảnh báo theo thời gian thực nếu số lượng sản phẩm đang giữ trong giỏ hàng (CartItem) lớn hơn số lượng tồn kho thực tế (Product.stock).

## 4. Các rủi ro lớn nhất cần ưu tiên kiểm thử (Critical Risks)
1. **Tranh chấp dữ liệu (Concurrency) trên Tồn kho Sản phẩm**: Thử nghiệm nhiều user cùng thanh toán một sản phẩm sắp hết hàng cùng lúc.
2. **Webhooks / IPN Payments**: Lỗi rớt mạng hoặc IPN bị delay từ MoMo/VNPay/PayPal có thể làm lệch trạng thái đơn hàng và gây khó khăn cho việc đối soát.
3. **OpenSearch Sync (Đồng bộ OpenSearch)**: Đảm bảo dữ liệu luôn được đồng bộ hoá giữa cơ sở dữ liệu chính (PostgreSQL/MySQL) và cụm tìm kiếm OpenSearch khi có tác vụ tạo mới hoặc thay đổi trạng thái sản phẩm.

## 5. Kết luận
Dự án có cấu trúc Frontend (React) và Backend (NestJS) khá đồ sộ. Kế hoạch kiểm thử đã bao phủ toàn diện từ góc nhìn Admin, Client đến các luồng tương tác trải dài nhiều module (Checkout, Review, Statistics). Những cảnh báo rủi ro về Tranh chấp dữ liệu (Concurrency) và Webhook Thanh toán là ưu tiên hàng đầu cần kiểm tra trước khi Release.
