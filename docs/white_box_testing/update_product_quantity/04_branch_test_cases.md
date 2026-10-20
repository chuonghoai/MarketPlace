# Bảng Branch Test Cases

| STT | Điều kiện đầu vào | Kết quả mong đợi |
|---|---|---|
| 1 | `userId` hợp lệ, `productId` KHÔNG nằm trong giỏ hàng của user | Ném lỗi `CustomException`: 'Sản phẩm không có trong giỏ hàng' |
| 2 | `userId` hợp lệ, `productId` có trong giỏ hàng, `quantity = 0` | Gọi `remove(item)`, trả về `getCartCount(userId)` |
| 3 | `userId` hợp lệ, `productId` có trong giỏ hàng, `quantity = 2` | Gán `item.quantity = 2`, gọi `save(item)`, trả về `getCartCount(userId)` |
