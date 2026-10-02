# UseCase: UC21 - Quản lý nghệ danh
- Người phụ trách: 
- Chức năng liên quan: Quản lý sản phẩm
- Actor: Admin, nhân viên
---

## 1. Mô tả chức năng
- CRUD thông tin nghệ danh

## 2. Chức năng quản lý sản phẩm cần chỉnh sửa
- Trong chức năng quản lý sản phẩm, cần bổ sung tính năng gán thông tin nghệ danh vào sản phẩm đó
- Mục đích để trong trang chi tiết sản phẩm hiện được ai là người tạo ra sản phẩm đó

## 3. Chi tiết giao diện

### 3.1. Giao diện quản lý nghệ danh:
- Cần hiện danh sách nghệ danh đã thêm vào hệ thống (có phân trang, limit = 20)
- Mỗi row cần có ảnh avatar, họ tên, số lượng sản phẩm, ngày sinh, ngày update
- Có nút Thêm mới để thêm nghệ danh
- Có nút Sửa để sửa thông tin nghệ danh
- Có nút Xóa để xóa nghệ danh
- Có ô để tìm kiếm nghệ danh theo tên

### 3.2. Giao diện xem chi tiết nghệ danh:
- Cần hiện tất cả các thông tin ở danh sách bên ngoài màn hình quản lý
- Cần hiện danh sách sản phẩm thuộc về nghệ danh này (có phân trang, limit = 10)
- Có nút sửa, xóa

### 3.3. Giao diện thêm/sửa nghệ danh:
- Là giao diện chi tiết nghệ danh, nhưng enable các field thông tin để chỉnh sửa.
- Về việc chỉnh sửa danh sách sản phẩm của nghệ danh này, có thể từ danh sách trong màn hình chi tiết nghệ danh, trực tiếp xóa khỏi danh sách, hoặc mở modal chọn sản phẩm, click chọn checkbox và bấm thêm để thêm vào danh sách sản phẩm của nghệ danh.

### 3.4. Về việc quản lý số lượng sản phẩm của nghệ danh:
- Có thể tạo thêm cột artisan_id để liên kết 1 sản phẩm - 1 nghệ danh.
- Nhưng nếu có cách khác tốt hơn thì có thể xem xét

### 3.5. Về việc liên kết giao diện vào sidebar:
- Thêm 1 option Nghệ danh vào side bar để liên kết route vào giao diện quản lý nghệ danh