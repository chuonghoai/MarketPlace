# Bảng Test Case (Bao phủ nhánh)

| STT | Điều kiện đầu vào (Tham số & State DB) | Kết quả mong đợi |
| --- | --- | --- |
| 1 | `DB.order = null` (Node 2: true) | Quăng lỗi `NotFoundException` |
| 2 | `DB.order = { ... }` (Node 2: false) | Đi tiếp đến cập nhật biến |
| 3 | `updateDto.note = 'Khách yêu cầu'` (Node 6: true) | Cập nhật `order.note` |
| 4 | `updateDto.note = undefined` (Node 6: false) | Bỏ qua cập nhật `order.note` |
| 5 | `DB.order.statusHistory = [{ status: 'PENDING' }]` (Node 8: true) | Dùng `order.statusHistory` cũ |
| 6 | `DB.order.statusHistory = null` (Node 8: false) | Tạo mảng `history` mới |
| 7 | `updateDto.status = EOrderStatus.PREPARING` (Node 12 & 38) | `defaultNote` và `newStatusStr` nhận giá trị PREPARING |
| 8 | `updateDto.status = EOrderStatus.SHIPPING` (Node 12 & 38) | `defaultNote` và `newStatusStr` nhận giá trị SHIPPING |
| 9 | `updateDto.status = EOrderStatus.DELIVERED` (Node 12 & 38) | `defaultNote` và `newStatusStr` nhận giá trị DELIVERED |
| 10 | `updateDto.status = EOrderStatus.SUCCESS` (Node 12 & 38) | `defaultNote` và `newStatusStr` nhận giá trị SUCCESS |
| 11 | `updateDto.status = EOrderStatus.CANCELLED` (Node 12 & 38) | `defaultNote` và `newStatusStr` nhận giá trị CANCELLED |
| 12 | `updateDto.status = EOrderStatus.RETURNED` (Node 12 & 38) | `defaultNote` và `newStatusStr` nhận giá trị RETURNED |
| 13 | `updateDto.status = undefined` (Node 12 & 38) | `newStatusStr = 'Đã cập nhật'` |
| 14 | `updateDto.note = 'Khách yêu cầu'` (Node 20: true) | Dùng `updateDto.note` để push vào history |
| 15 | `updateDto.note = undefined` (Node 20: false) | Dùng `defaultNote` để push vào history |
| 16 | `updateDto.status = EOrderStatus.SUCCESS` (Node 23: true) | `order.paymentStatus = PAID` |
| 17 | `updateDto.status = EOrderStatus.SHIPPING` (Node 23: false) | Bỏ qua gán `paymentStatus` |
| 18 | `updateDto.status = EOrderStatus.SUCCESS` (Node 26: true) | Kiểm tra `oldStatus` |
| 19 | `updateDto.status = EOrderStatus.SHIPPING` (Node 26: false) | Bỏ qua tăng `soldCount` |
| 20 | `DB.order.status = EOrderStatus.PENDING` (Node 27: true) | Lặp qua `items` tăng `soldCount` |
| 21 | `DB.order.status = EOrderStatus.SUCCESS` (Node 27: false) | Không tăng `soldCount` |
| 22 | `DB.order.items = [{ productId: 1, quantity: 2 }]` (Node 28: true) | Tăng `soldCount` cho product |
| 23 | `DB.order.items = []` (Node 28: false) | Thoát khỏi vòng lặp tăng `soldCount` |
| 24 | `updateDto.status = EOrderStatus.CANCELLED` (Node 30: true) | Rollback vouchers |
| 25 | `updateDto.status = EOrderStatus.SUCCESS` (Node 30: false) | Đánh giá node 31 |
| 26 | `updateDto.status = EOrderStatus.RETURNED` (Node 31: true) | Rollback vouchers |
| 27 | `updateDto.status = EOrderStatus.SUCCESS` (Node 31: false) | Bỏ qua logic rollback và cập nhật stock |
| 28 | `DB.order.status = EOrderStatus.PENDING` (Node 33: true) | Đánh giá node 34 |
| 29 | `DB.order.status = EOrderStatus.CANCELLED` (Node 33: false) | Bỏ qua khôi phục stock |
| 30 | `DB.order.status = EOrderStatus.PENDING` (Node 34: true) | Lặp qua `items` tăng stock |
| 31 | `DB.order.status = EOrderStatus.RETURNED` (Node 34: false) | Bỏ qua khôi phục stock |
| 32 | `DB.order.items = [{ productId: 1, quantity: 2 }]` (Node 35: true) | Khôi phục stock cho product |
| 33 | `DB.order.items = []` (Node 35: false) | Thoát vòng lặp khôi phục stock |
| 34 | `updateDto.status = EOrderStatus.CANCELLED` (Node 46: true) | Truyền `cancelReason = updateDto.note` |
| 35 | `updateDto.status = EOrderStatus.SUCCESS` (Node 46: false) | Truyền `cancelReason = undefined` |
| 36 | `updateDto.status = EOrderStatus.SUCCESS` (Node 50: true) | Đánh giá node 51 |
| 37 | `updateDto.status = EOrderStatus.SHIPPING` (Node 50: false) | Bỏ qua gửi email billing |
| 38 | `DB.order.paymentMethod = EPaymentMethod.COD` (Node 51: true) | Gọi `sendBillingEmail` |
| 39 | `DB.order.paymentMethod = EPaymentMethod.VNPAY` (Node 51: false) | Bỏ qua gửi email billing |
