# UseCase: UC17 - Đấu giá sản phẩm
- Người phụ trách: 
- Actor: khách hàng, nhân viên, quản trị viên
---

## 1. Mô tả chức năng
- Nhân viên/quản trị viên có thể tạo phiên đấu giá
- Đặt vào phiên 1 sản phẩm và đặt vào đó mức giá sàn, kèm thời gian chốt giá và thời gian kết thúc đấu giá
- Khách hàng có thể thấy được phiên đấu giá từ banner ở trang chủ, bấm vào để truy cập vào giao diện đấu giá chính thức
- Khách hàng có thể tiến hành đặt mức giá cao hơn vào sản phẩm, hoặc thiết lập cơ chế tự động đấu giá

## 2. Cơ chế đấu giá tự động
- Khách hàng enable nút tự động đấu giá
- Nhập số tiền cao hơn đối thủ, ví dụ đối phương ra giá 5.000.000đ, khách hàng nhập vào 500.000đ, thì hệ thống sẽ tự động ra giá 5.500.000đ, và bất kỳ ai đặt giá cao hơn thì hệ thống đều sẽ tự động trả giá bằng mức giá đó + 500.000đ
- Nhập mức giá trần, để nếu mức giá hiện tại cao hơn ngân sách, thì hệ thống tự động từ bỏ đấu giá

## 3. Thứ tự đấu giá tự động
- Nếu có nhiều người cùng bật chế độ đấu giá tự động
- Hệ thống ưu tiên ra giá thay cho người có mức giá trần thấp nhấp, và ra giá cho người có mức giá trần cao nhất cuối cùng

## 4. Chức năng đấu giá cần phải realtime
- Cần xem xét sử dụng websocket hoặc SSA hợp lý để người dùng xem được dữ liệu đấu giá realtime