# GIAI ĐOẠN 8 - KIỂM THỬ LIÊN MÔ-ĐUN (CROSS-MODULE TESTING)

Phần này bao gồm các kịch bản kiểm thử toàn trình (end-to-end) trải rộng trên nhiều mô-đun nghiệp vụ để đảm bảo tính toàn vẹn dữ liệu trên toàn hệ thống.

## 1. Sản phẩm -> Giỏ hàng -> Thanh toán -> Đơn hàng -> Doanh thu (Luồng Mua hàng)
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| CROSS_01 | Vòng đời Mua hàng Hoàn chỉnh | Tồn kho = 10, Giá = 100k | 1. Khách thêm Sản phẩm vào giỏ<br>2. Khách tới trang Thanh toán<br>3. Áp dụng Voucher giảm 10%<br>4. Thanh toán COD<br>5. Admin đổi trạng thái thành Đã giao | 1. Đơn hàng được tạo (giá trị = 90k).<br>2. Tồn kho = 9, Đã bán = 1.<br>3. Số lượt dùng Voucher tăng.<br>4. Doanh thu trên Dashboard Admin tăng 90k.<br>5. Lịch sử đơn hàng của Khách được cập nhật. | `products`, `cart_items`, `orders`, `vouchers`, Thống kê |

## 2. Trạng thái Đơn hàng -> Email -> Dashboard (Quy trình Xử lý Đơn)
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| CROSS_02 | Hủy Đơn hàng | Đơn đang chờ (PENDING) | 1. Khách vào Theo dõi đơn hàng<br>2. Nhấn Hủy đơn<br>3. Hệ thống xử lý yêu cầu hủy | 1. Trạng thái chuyển thành ĐÃ HỦY (CANCELLED).<br>2. Tồn kho được hoàn lại (+1).<br>3. Dashboard Admin KHÔNG tính đơn này vào Doanh thu.<br>4. Gửi email xác nhận hủy đơn cho khách. | `orders`, `products`, Thống kê, Mails |

## 3. Đánh giá -> Sản phẩm -> Dashboard (Quản lý Uy tín)
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| CROSS_03 | Đánh giá 5 Sao | Đơn hàng đã giao | 1. Khách vào Theo dõi -> Đánh giá<br>2. Gửi đánh giá 5 sao | 1. Đánh giá hiện trên Trang Chi tiết Sản phẩm.<br>2. Tính lại trung bình đánh giá sản phẩm.<br>3. Sản phẩm dễ lọt vào danh sách "Thịnh hành" hoặc lọc "Đánh giá cao". | `reviews`, `products` |

## 4. Cổng thanh toán -> Trạng thái Đơn hàng
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| CROSS_04 | Thanh toán MoMo Thành công | Đang ở bước Checkout | 1. Khách thanh toán bằng MoMo<br>2. Khách hoàn tất giao dịch trên sandbox MoMo<br>3. MoMo gọi IPN về Backend | 1. Backend xác thực chữ ký IPN.<br>2. Trạng thái đơn hàng chuyển thành ĐÃ THANH TOÁN (PAID).<br>3. Client thăm dò/websocket cập nhật UI thành "Thành công". | `orders`, Log Thanh toán |
| CROSS_05 | Thanh toán MoMo Bị hủy | Đang ở bước Checkout | 1. Khách thanh toán bằng MoMo<br>2. Khách nhấn "Hủy giao dịch" trên cổng MoMo | 1. Khách bị chuyển hướng trở lại trang web.<br>2. Trạng thái đơn hàng giữ nguyên PENDING hoặc PAYMENT_FAILED.<br>3. Tồn kho bị giữ tạm thời (cần timeout) hoặc giải phóng ngay tùy luật nghiệp vụ. | `orders`, `products` (tồn kho) |
