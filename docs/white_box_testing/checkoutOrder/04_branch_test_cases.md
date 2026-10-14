# Bảng Test Case (Bao phủ nhánh)

| STT | Điều kiện đầu vào (Tham số & State DB) | Kết quả mong đợi |
| --- | --- | --- |
| 1 | `dto.items = null` (Node 1: true) | Quăng lỗi `BadRequestException('Giỏ hàng trống')` |
| 2 | `dto.items = []` (Node 2: true) | Quăng lỗi `BadRequestException('Giỏ hàng trống')` |
| 3 | `dto.items = [{productId: 1, quantity: 1}]`, DB trả về `address = null` (Node 5: true) | Quăng lỗi `NotFoundException('Không tìm thấy địa chỉ')` |
| 4 | DB trả về `address != null` (Node 5: false), `product = null` (Node 10: true) | Quăng lỗi `NotFoundException('Sản phẩm không tồn tại')` |
| 5 | `item.quantity = 10`, `product.stock = 5` (Node 12: true) | Quăng lỗi `BadRequestException('Không đủ hàng')` |
| 6 | `item.quantity = 1`, `product.stock = 5` (Node 12: false) | Tính tổng tiền `subTotal` bình thường |
| 7 | Không có items nào trong `dto.items` (Node 8: false) | Bỏ qua logic tính toán `subTotal` |
| 8 | Có kết quả tính toán `packingResult` (Node 16: true) | Ghi log `console.log` |
| 9 | `packingResult` bị null (Node 16: false) | Bỏ qua phần ghi log kiện hàng tối ưu |
| 10 | `dto.voucherCodes = null` (Node 19: false) | Bỏ qua logic tính toán voucher |
| 11 | `dto.voucherCodes = []` (Node 20: false) | Bỏ qua logic tính toán voucher |
| 12 | Hết mã voucher trong danh sách duyệt (Node 22: false) | Chuyển sang kiểm tra số lượng mã |
| 13 | Lỗi từ `checkVoucherEligibility` ném ra ngoại lệ (Node 24: true) | Quăng lỗi `BadRequestException` kèm theo message từ service |
| 14 | `dto.voucherCodes = ['V1']`, DB `voucher.type = FREESHIP_CASH` (Node 25: true) | Tăng `freeshipCount` lên 1 |
| 15 | `dto.voucherCodes = ['V1']`, DB `voucher.type = FREESHIP_PERCENT` (Node 26: true) | Tăng `freeshipCount` lên 1 |
| 16 | `voucher.type = PERCENT` không phải freeship (Node 26: false) | Tăng `nonFreeshipCount` lên 1 |
| 17 | `freeshipCount = 2` (Node 30: true) | Quăng lỗi `BadRequestException('Chỉ được áp dụng tối đa 1 mã freeship')` |
| 18 | `nonFreeshipCount = 3` (Node 31: true) | Quăng lỗi `BadRequestException('Chỉ được áp dụng tối đa 2 mã giảm giá SP')` |
| 19 | Duyệt qua danh sách `validVouchers` lần 1 hết phần tử (Node 35: false) | Chuyển sang vòng lặp duyệt lần 2 |
| 20 | `dto.voucherCodes = ['V1']`, `voucher.type = PERCENT` (Node 36: true) | Tính `discountAmount` theo phần trăm `subTotal` |
| 21 | Voucher phần trăm có giới hạn `max_discount_amount` (Node 37: true) | Kiểm tra so sánh với mức giảm giá tối đa |
| 22 | Voucher phần trăm không có giới hạn `max_discount_amount` (Node 37: false) | Tiếp tục kiểm tra với `remainingSubTotal` |
| 23 | Mức giảm phần trăm vượt quá `max_discount_amount` (Node 38: true) | Gán lại `discount = max_discount_amount` |
| 24 | Mức giảm phần trăm nhỏ hơn `max_discount_amount` (Node 38: false) | Giữ nguyên mức giảm |
| 25 | Mức giảm vượt quá `remainingSubTotal` (Node 40: true) | Gán lại `discount = remainingSubTotal` |
| 26 | `voucher.type = CASH` (Node 44: true) | Tính `discountAmount` trực tiếp bằng tiền |
| 27 | Mức giảm tiền mặt vượt quá `remainingSubTotal` (Node 45: true) | Gán lại `discount = remainingSubTotal` |
| 28 | Duyệt qua danh sách `validVouchers` lần 2 hết phần tử (Node 48: false) | Tính `totalAmount` chung |
| 29 | `voucher.type = FREESHIP_PERCENT` (Node 49: true) | Tính `shippingDiscountAmount` theo phần trăm phí ship |
| 30 | Freeship phần trăm có giới hạn (Node 51: true) | Chuẩn bị so sánh với `max_discount_amount` của freeship |
| 31 | `discount > shippingFee - shippingDiscountAmount` đối với freeship (Node 53: true) | Gán mức giảm bằng chính phần phí ship còn lại |
| 32 | `voucher.type = FREESHIP_CASH` (Node 57: true) | Tính giảm phí ship trực tiếp bằng tiền mặt |
| 33 | Mức giảm freeship cash vượt quá phí ship thực tế (Node 58: true) | Gán `discount = shippingFee - shippingDiscountAmount` |
| 34 | Bắt đầu lặp qua `validOrderItems` để trừ stock Redis, danh sách rỗng (Node 62: false) | Mở Transaction DB |
| 35 | Redis trả về `res = -1` (chưa có key) (Node 64: true) | Gọi `setStockNx` rồi `deductStock` lại |
| 36 | Redis trả về `res2 = 0` ở lần thử thứ 2 (Node 66: true) | Gọi `restoreStock` và quăng `BadRequestException` |
| 37 | Redis trả về `res2 = 1` ở lần thử thứ 2 (Node 66: false) | Push vào mảng `redisDeductedItems` |
| 38 | Redis trả về `res = 0` (hết hàng) (Node 69: true) | Gọi `restoreStock` và quăng `BadRequestException` |
| 39 | Redis trả về `res = 1` (trừ thành công) (Node 69: false) | Push vào mảng `redisDeductedItems` |
| 40 | `dto.paymentMethod = 'COD'` (Node 73: true) | Khóa voucher, tăng lượt dùng trong Transaction |
| 41 | Lỗi không lock được voucher DB, `!lockedVoucher` (Node 76: true) | Quăng `BadRequestException('Mã voucher không tồn tại')` |
| 42 | Voucher đã bị hết lượt `used_count >= total_limit` (Node 78: true) | Quăng `BadRequestException('Mã voucher đã hết lượt sử dụng')` |
| 43 | Update product trong DB trả về `result.affected === 0` (Node 84: true) | Quăng `BadRequestException('Sản phẩm không đủ số lượng')` |
| 44 | `dto.paymentMethod = 'MOMO'` (Node 100: true) | Trả về `payUrl` của MoMo, `paymentRequired = true` |
| 45 | `dto.paymentMethod = 'VNPAY'` (Node 103: true) | Trả về `payUrl` của VNPAY, `paymentRequired = true` |
| 46 | `dto.paymentMethod = 'PAYPAL'` (Node 106: true) | Trả về `payUrl` của PayPal, `paymentRequired = true` |
