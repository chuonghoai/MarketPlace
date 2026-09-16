# GIAI ĐOẠN 7 - KẾ HOẠCH KIỂM THỬ KHÁCH HÀNG

## 1. Xác thực (Authentication)
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| CLI_AUTH_01 | Đăng ký Tài khoản | Email chưa được đăng ký | 1. Đi tới `/register`<br>2. Điền thông tin hợp lệ<br>3. Xác nhận | Thông báo thành công, chuyển hướng đến Đăng nhập. | Bảng `users` (Được tạo) |
| CLI_AUTH_02 | Đăng nhập (Luồng chuẩn) | Tài khoản đã tồn tại | 1. Đi tới `/login`<br>2. Nhập thông tin<br>3. Xác nhận | Chuyển hướng tới `/` (Marketplace) hoặc trang trước đó. JWT lưu trong cookie/local storage. | Không có |
| CLI_AUTH_03 | Đăng nhập (Sai thông tin) | Tài khoản đã tồn tại | 1. Nhập sai mật khẩu | Báo lỗi "Tên đăng nhập hoặc mật khẩu không đúng". | Không có |

## 2. Duyệt Sản phẩm & Marketplace
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| CLI_MKT_01 | Phân trang | Có nhiều trang sản phẩm | 1. Đi tới `/`<br>2. Nhấn Trang 2 | URL cập nhật, lưới sản phẩm hiện danh sách mới, cuộn về đầu trang. | Không có |
| CLI_MKT_02 | Lọc theo Danh mục | Có sẵn sản phẩm | 1. Chọn một bộ lọc Danh mục | Lưới sản phẩm chỉ hiện sản phẩm thuộc danh mục đó. | Không có |
| CLI_MKT_03 | Xem Chi tiết Sản phẩm | Sản phẩm tồn tại | 1. Nhấp vào thẻ sản phẩm | Chuyển hướng đến `/product/:id`. Hiện đúng tên, giá, tồn kho, và đánh giá. | Không có |
| CLI_MKT_04 | Xem Sản phẩm Hết hàng | Tồn kho = 0 | 1. Mở sản phẩm đã hết hàng | Nút "Thêm vào giỏ" bị vô hiệu, hiện chữ "Hết hàng" trên ảnh sản phẩm. | Không có |

## 3. Quản lý Giỏ hàng (Cart)
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| CLI_CART_01 | Thêm vào Giỏ hàng | Đã đăng nhập, Tồn kho > 0 | 1. Vào trang Chi tiết Sản phẩm<br>2. Số lượng = 1<br>3. Nhấn "Thêm vào giỏ" | Nút hiện vòng xoay tải, thông báo thành công, số lượng trên biểu tượng Giỏ hàng tăng. | `cart_items` (Được tạo/Cập nhật) |
| CLI_CART_02 | Thêm vào Giỏ (Quá giới hạn) | Tồn kho = 5 | 1. Chọn số lượng = 6<br>2. Nhấn Thêm | Thao tác bị chặn ở Frontend hoặc API từ chối với lỗi "Không đủ số lượng". | Không có |
| CLI_CART_03 | Cập nhật Số lượng | Sản phẩm đã có trong giỏ | 1. Đi tới `/cart`<br>2. Tăng số lượng | Tổng tiền tự động cập nhật. | `cart_items` (Được cập nhật) |
| CLI_CART_04 | Xóa khỏi Giỏ hàng | Sản phẩm đã có trong giỏ | 1. Đi tới `/cart`<br>2. Nhấn biểu tượng xóa | Sản phẩm bị xóa khỏi danh sách, tính lại tổng tiền. | `cart_items` (Bị xóa) |

## 4. Thanh toán (Checkout)
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| CLI_CHK_01 | Thanh toán (COD) | Giỏ hàng có sản phẩm | 1. Chọn mặt hàng trong giỏ, nhấn Thanh toán<br>2. Chọn Thanh toán khi nhận hàng (COD)<br>3. Nhấn Đặt hàng | Chuyển hướng tới trang Kết quả Thành công. | `orders`, `order_items` (Được tạo), `cart_items` (Bị xóa), `products` (Cập nhật) |
| CLI_CHK_02 | Áp dụng Voucher | Có Voucher hợp lệ | 1. Ở trang Checkout, mở Modal Voucher<br>2. Chọn mã hợp lệ | Tạm tính được tính lại, mức giảm hiển thị rõ ràng. | Không có |
| CLI_CHK_03 | Voucher không hợp lệ | Đơn tối thiểu 500k | 1. Tạm tính giỏ = 200k<br>2. Thử áp dụng voucher | Mã giảm giá bị vô hiệu hoặc bị từ chối. | Không có |

## 5. Hồ sơ & Theo dõi Đơn hàng
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| CLI_PROF_01 | Cập nhật Hồ sơ | Đã đăng nhập | 1. Đi tới `/profile/dashboard`<br>2. Nhấn Chỉnh sửa, đổi tên<br>3. Lưu | Hồ sơ cập nhật thành công, header hiển thị tên mới. | `users` (Cập nhật) |
| CLI_PROF_02 | Xem Trạng thái Đơn hàng | Đã đặt hàng | 1. Đi tới `/profile/order/tracking` | Hiển thị danh sách các đơn hàng với đúng trạng thái. | Không có |

## 6. Đánh giá (Review)
| ID | Tiêu đề | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Dữ liệu bị ảnh hưởng |
|---|---|---|---|---|---|
| CLI_REV_01 | Gửi Đánh giá | Đơn hàng đã giao (DELIVERED) | 1. Vào Chi tiết đơn hàng<br>2. Nhấn Đánh giá<br>3. Chọn số sao, viết bình luận, Gửi | Đánh giá được thêm, điểm số trung bình của sản phẩm tự tính lại. | `reviews` (Tạo), `products` (Cập nhật) |
