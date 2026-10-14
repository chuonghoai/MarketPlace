# 04. Bảng Test Cases bao phủ nhánh (Branch Coverage)

| STT | Điều kiện đầu vào | Kết quả mong đợi |
| --- | --- | --- |
| 1 | `amount = 0` hoặc `null` (`!amount = true`) | Ném ra `BadRequestException` 'Số tiền nạp tối thiểu là 10.000 ₫' |
| 2 | `amount = 5000` (`!amount = false`, `amount < 10000 = true`) | Ném ra `BadRequestException` 'Số tiền nạp tối thiểu là 10.000 ₫' |
| 3 | `amount = 50000`, `paymentMethod = 'VNPAY'` | Tạo URL thanh toán VNPAY thành công, trả về `{ paymentRequired: true, paymentUrl, txRef, amount }` |
| 4 | `amount = 50000`, `paymentMethod = 'MOMO'` | Tạo URL thanh toán MOMO thành công, trả về `{ paymentRequired: true, paymentUrl, txRef, amount }` |
| 5 | `amount = 50000`, `paymentMethod = 'PAYPAL'` | Tạo URL thanh toán PayPal thành công, trả về `{ paymentRequired: true, paymentUrl, txRef, amount }` |
| 6 | `amount = 50000`, `paymentMethod = 'DIRECT'`, xảy ra lỗi DB khi truy vấn trong `try` | Khối `catch` bắt ngoại lệ, thực hiện rollback transaction, giải phóng queryRunner và rethrow lỗi |
| 7 | `amount = 50000`, `paymentMethod = 'DIRECT'`, query ví không tìm thấy (`!wallet = true`) | Ném ra `NotFoundException` 'Không tìm thấy thông tin ví', rollback transaction, giải phóng queryRunner |
| 8 | `amount = 50000`, `paymentMethod = 'DIRECT'`, ví bị tạm khóa (`wallet.status === 'LOCKED'`) | Ném ra `BadRequestException` 'Ví của bạn đang bị tạm khóa', rollback transaction, giải phóng queryRunner |
| 9 | `amount = 50000`, `paymentMethod = 'DIRECT'`, ví hợp lệ (`status === 'ACTIVE'`) | Cập nhật số dư ví, lưu bản ghi giao dịch `TOPUP`, commit transaction, giải phóng queryRunner, trả về `{ success: true, paymentRequired: false, balance, transaction }` |
