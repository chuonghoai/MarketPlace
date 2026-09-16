# GIAI ĐOẠN 6 - KẾ HOẠCH KIỂM THỬ ADMIN

## 1. Bảng điều khiển (Dashboard)
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| ADM_DB_01 | Xem Thống kê Dashboard | Đã đăng nhập vai trò Admin/Staff | 1. Điều hướng đến `/admin/overview`<br>2. Quan sát các thẻ KPI. | Tổng doanh thu, Tổng đơn hàng, Tỷ lệ chuyển đổi và Tỷ lệ khách quay lại hiển thị với định dạng số chính xác. | Không có |
| ADM_DB_02 | Thay đổi Bộ lọc Thời gian | Đã đăng nhập vai trò Admin/Staff | 1. Nhấn vào bộ lọc "30 ngày". | Số liệu KPI, biểu đồ cột và danh sách sản phẩm thịnh hành được làm mới để hiển thị dữ liệu 30 ngày qua. | Không có |

## 2. Quản lý Sản phẩm (Product Management)
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| ADM_PROD_01 | Tạo Sản phẩm (Đúng luồng chuẩn) | Đã đăng nhập vai trò Admin/Staff | 1. Đi tới `/admin/products/create`<br>2. Điền tất cả các trường bắt buộc (Tên, Giá, Danh mục, Tồn kho, Hình ảnh)<br>3. Nhấn Lưu (Submit) | Xuất hiện thông báo thành công (toast), chuyển hướng về Danh sách sản phẩm, sản phẩm mới nằm ở trên cùng. | Bảng `products` (Được tạo) |
| ADM_PROD_02 | Tạo Sản phẩm (Xác thực dữ liệu) | Đã đăng nhập vai trò Admin/Staff | 1. Đi tới trang Tạo Sản phẩm<br>2. Bỏ trống 'Tên' và 'Giá'<br>3. Nhấn Lưu | Form báo lỗi ngăn không cho gửi. Cảnh báo hiển thị dưới các trường bắt buộc. | Không có |
| ADM_PROD_03 | Tạo Sản phẩm (Giá trị Biên) | Đã đăng nhập vai trò Admin/Staff | 1. Nhập giá trị âm cho giá bán hoặc tồn kho<br>2. Nhấn Lưu | API từ chối yêu cầu hoặc Form ngăn không cho gửi dữ liệu. | Không có |
| ADM_PROD_04 | Chỉnh sửa Sản phẩm | Sản phẩm đã tồn tại | 1. Đi tới trang Chỉnh sửa Sản phẩm<br>2. Đổi giá bán<br>3. Nhấn Lưu | Thông báo thành công hiện ra. Giá được cập nhật trên giao diện Admin và Client. | Bảng `products` (Được cập nhật) |

## 3. Quản lý Đơn hàng (Order Management)
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| ADM_ORD_01 | Xem Chi tiết Đơn hàng | Đơn hàng đã tồn tại | 1. Đi tới `/admin/orders`<br>2. Nhấp vào một đơn hàng | Hiển thị thông tin khách hàng, địa chỉ giao hàng, sản phẩm đã đặt, voucher đã áp dụng và tổng tiền. | Không có |
| ADM_ORD_02 | Cập nhật Trạng thái | Đơn hàng ở trạng thái PENDING | 1. Mở chi tiết đơn hàng<br>2. Đổi trạng thái thành "ĐANG GIAO" (SHIPPING)<br>3. Xác nhận | Trạng thái được cập nhật thành công. UI hiện huy hiệu trạng thái mới. (Email được gửi cho khách). | Bảng `orders` (Được cập nhật) |
| ADM_ORD_03 | Cập nhật Trạng thái Không hợp lệ | Đơn hàng ở trạng thái DELIVERED | 1. Mở đơn hàng đã giao | Nút thả xuống (dropdown) đổi trạng thái bị vô hiệu hóa (không thể lùi từ DELIVERED về PENDING). | Không có |

## 4. Quản lý Mã giảm giá (Voucher Management)
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| ADM_VOUC_01 | Tạo Voucher | Đã đăng nhập vai trò Admin/Staff | 1. Đi tới `/admin/vouchers`<br>2. Nhấn Thêm<br>3. Nhập mã, mức giảm, số lượt dùng, ngày hiệu lực<br>4. Lưu | Voucher được tạo và hiện trong danh sách. | Bảng `vouchers` (Được tạo) |
| ADM_VOUC_02 | Tạo Voucher (Kiểm tra Hạn dùng) | Đã đăng nhập vai trò Admin/Staff | 1. Chọn Ngày hết hạn là một ngày trong quá khứ<br>2. Lưu | Form từ chối với lỗi "Ngày hết hạn phải ở trong tương lai". | Không có |
| ADM_VOUC_03 | Xem Thống kê Voucher | Có các voucher đang hoạt động | 1. Đi tới `/admin/vouchers/stats` | Hiển thị biểu đồ sử dụng và thống kê cho các voucher đang hoạt động. | Không có |

## 5. Xác thực & Phân quyền (Authentication & Authorization)
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| ADM_AUTH_01 | Truy cập chưa xác thực | Chưa đăng nhập | 1. Truy cập `/admin/overview` qua URL | Người dùng bị chuyển hướng tới `/login`. | Không có |
| ADM_AUTH_02 | Quyền không đủ | Đã đăng nhập là USER | 1. Truy cập `/admin/overview` qua URL | Người dùng bị chặn (403 Forbidden) hoặc bị chuyển hướng về Client Marketplace. | Không có |
