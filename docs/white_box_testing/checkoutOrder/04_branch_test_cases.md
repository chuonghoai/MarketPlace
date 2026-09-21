# Bảng Test Case (Bao phủ nhánh)

| STT | Điều kiện đầu vào (Tham số & State DB) | Kết quả mong đợi |
| --- | --- | --- |
| 1 | `dto.items = null` (Node 1: true) | Quăng lỗi `BadRequestException('Giỏ hàng trống')` |
| 2 | `dto.items = []` (Node 2: true) | Quăng lỗi `BadRequestException('Giỏ hàng trống')` |
| 3 | `dto.items = [{productId: 1, quantity: 1}]`, DB trả về `address = null` (Node 5: true) | Quăng lỗi `NotFoundException('Không tìm thấy địa chỉ')` |
| 4 | DB trả về `address != null` (Node 5: false), `product = null` (Node 10: true) | Quăng lỗi `NotFoundException('Sản phẩm không tồn tại')` |
| 5 | `item.quantity = 10`, `product.stock = 5` (Node 12: true) | Quăng lỗi `BadRequestException('Không đủ hàng')` |
| 6 | `item.quantity = 1`, `product.stock = 5` (Node 12: false) | Tính tổng tiền `subTotal` bình thường |
| 7 | `dto.voucherCodes = null` (Node 19: false) | Bỏ qua logic tính toán voucher |
| 8 | `dto.voucherCodes = ['V1']`, DB `voucher.type = FREESHIP_CASH` (Node 25: true) | Tăng `freeshipCount`, tính toán voucher giảm giá ship |
| 9 | `dto.voucherCodes = ['V1']`, DB `voucher.type = PERCENT` (Node 37: true) | Tính `discountAmount` theo phần trăm |
| 10 | `discount > voucher.max_discount_amount` (Node 40: true) | Gán `discount = max_discount_amount` |
| 11 | Redis trả về `res = 0` khi gọi `deductStock` (Node 72: true) | Quăng lỗi `BadRequestException('Sản phẩm đã hết hàng')` |
| 12 | Redis trả về `res = 1` khi gọi `deductStock` (Node 72: false) | Tiếp tục tạo Transaction ghi vào DB |
| 13 | `dto.paymentMethod = 'COD'` (Node 77: true) | Tăng `used_count` của các voucher đã dùng |
| 14 | `dto.paymentMethod = 'MOMO'` (Node 104: true) | Trả về `payUrl` của MoMo, `paymentRequired = true` |
| 15 | `dto.paymentMethod = 'VNPAY'` (Node 107: true) | Trả về `payUrl` của VNPAY, `paymentRequired = true` |
| 16 | `dto.paymentMethod = 'PAYPAL'` (Node 110: true) | Trả về `payUrl` của PayPal, `paymentRequired = true` |
| 17 | `dto.paymentMethod = 'COD'` (Node 110: false) | Hoàn tất tạo đơn, xóa giỏ hàng, gửi Email, trả về `payUrl = null` |
