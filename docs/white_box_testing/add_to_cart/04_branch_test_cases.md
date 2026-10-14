# 04. Bảng Test Cases bao phủ nhánh (Branch Coverage)

| STT | Điều kiện đầu vào | Kết quả mong đợi |
| --- | --- | --- |
| 1 | `item` tồn tại trong giỏ hàng (`item != null` $\rightarrow$ `[3] = true`), truyền `quantity = 2` | Tăng số lượng sản phẩm: `item.quantity += 2`, lưu cập nhật vào DB, trả về tổng số lượng mới trong giỏ hàng |
| 2 | `item` chưa tồn tại trong giỏ hàng (`item == null` $\rightarrow$ `[3] = false`), truyền `quantity = 3` | Tạo mới `CartItem` với `quantity = 3`, lưu bản ghi mới vào DB, trả về tổng số lượng mới trong giỏ hàng |
