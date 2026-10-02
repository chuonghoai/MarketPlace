# UseCase: UC23 - Xử lý hoàn trả
- Người phụ trách
- Chức năng liên quan: Ví điện tử, yêu cầu hỗ trợ
- Actor: Admin, nhân viên
---

## 1. Mô tả chức năng
- Sau khi đơn hàng kết thúc, khách hàng có thể gửi yêu cầu hoàn tiền hoặc đổi trả trong vòng **7 ngày**
- Trong vòng 7 ngày, đơn hàng sẽ enable nút "Yêu cầu xử lý"
- Khi khách hàng bấm vào, hiện form để chọn mục đích cần xử lý, ví dụ: **Đổi lấy món hàng mới, trả hàng hoàn tiền...**
- Trong form cần ghi rõ tiêu đề, nội dung, hình ảnh, video...
- Sau khi submit yêu cầu, nhân viên (hoặc quản trị viên sẽ nhận được yêu cầu) và sẽ xử lý form báo cáo của khách hàng

### 1.1. Trường hợp 1: Đổi lấy món hàng mới
- Khi nhân viên hoặc quản trị viên xác nhận cho phép đổi lấy món hàng mới, sẽ từ đơn hàng cũ mà user đã báo cáo trước đó, trích xuất ra thông tin người nhận và địa chỉ (có thể sửa đổi nếu có yêu cầu), rồi tạo lại 1 đơn hàng mới (có trạng thái ban đầu là processing).
- Sau đó tiến hành như một đơn hàng bình thường

### 1.2. Trường hợp 2: Trả hàng hoàn tiền
- Khi nhân viên hoặc quản trị viên xác nhận hoàn tiền, thực hiện quy trình nhờ shipper đi lấy lại hàng
- Sau khi xác nhận đã lấy hàng về, bấm nút hoàn tiền
- Hệ thống sẽ cộng số tiền đơn hàng của người dùng vào **ví điện tử** của người dùng (nếu chưa mở thì yêu cầu người dùng cung cấp số tài khoản để tiến hành chuyển khoản)

## 2. Lưu ý về chức năng yêu cầu hỗ trợ
- Chức năng xử lý hoàn trả **LÀ MỘT PHẦN NHỎ** của yêu cầu hỗ trợ, cần chú ý khi thiết kế giao diện