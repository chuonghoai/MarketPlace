# UseCase: UC18 - Ví điện tử
- Người phụ trách: 
- Chức năng liên quan: Xử lý hoàn trả
- Actor: khách hàng, nhân viên, quản trị viên
---

## 1. Mô tả chức năng
- Có chức năng nạp tiền vào ví điện tử tương tự như chức năng thanh toán đơn hàng
- Có thể dùng số tiền trong ví điện tử để thanh toán đơn hàng
- Chức năng xử lý hoàn trả có thể hoàn tiền vào ví điện tử.
- Người dùng có thể rút tiền từ trong ví ra tài khoản ngân hàng

## 2. Cách rút tiền từ trong ví ra
- Bước 1: Bấm yêu cầu rút tiền
- Bước 2: Nhập thông tin tài khoản gồm số tài khoản, tên chủ tải khoản và số tiền muốn rút
- Bước 3: Bấm gửi yêu cầu
- Bước 4: Nhân viên hoặc quản trị viên xem yêu cầu, thực hiện chuyển khoản thủ công, sau đó đăng tải hóa đơn chuyển khoản lên hệ thống
- Bước 5: Nhân viên bấm hoàn thành yêu cầu

## 3. Lưu ý về thiết kế chức năng phê duyệt yêu cầu rút tiền phía admin/staff:
- Khi hiện danh sách các yêu cầu rút tiền, cần hiện thêm cả tổng số tiền của tất cả yêu cầu rút tiền
- Mục đích để bộ phận vận hành trang web biết được có bao nhiêu tiền cần chuẩn bị