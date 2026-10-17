# Bảng Branch Test Cases

| Kịch bản | Mã test case | Đường thi hành | Điều kiện đầu vào | Kết quả mong đợi | Trạng thái |
|:---|:---|:---|:---|:---|:---:|
| Kịch bản 1 | TC01 | 1 -> 2 -> 3 (True) -> 4 -> Exit | `userId` hợp lệ, `productId` KHÔNG nằm trong giỏ hàng của user | Ném lỗi `CustomException`: 'Sản phẩm không có trong giỏ hàng' | Pass |
| Kịch bản 2 | TC02 | 1 -> 2 -> 3 (False) -> 5 (True) -> 6 -> 9 -> Exit | `userId` hợp lệ, `productId` có trong giỏ hàng, `quantity = 0` | Gọi `remove(item)`, trả về `getCartCount(userId)` | Pass |
| Kịch bản 3 | TC03 | 1 -> 2 -> 3 (False) -> 5 (False) -> 7 -> 8 -> 9 -> Exit | `userId` hợp lệ, `productId` có trong giỏ hàng, `quantity = 2` | Gán `item.quantity = 2`, gọi `save(item)`, trả về `getCartCount(userId)` | Pass |
