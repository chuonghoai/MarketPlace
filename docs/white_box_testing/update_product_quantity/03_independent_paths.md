# Các đường thi hành tuyến độc lập (Independent Paths)

## 1. Phân tích các node điều kiện (Predicate Nodes)
- **Node [3]**: `if (!item)` - Kiểm tra sản phẩm có tồn tại trong giỏ hàng hay không.
- **Node [5]**: `if (quantity <= 0)` - Kiểm tra số lượng cập nhật, nếu <= 0 thì xóa khỏi giỏ hàng.

Số lượng node điều kiện (P) = 2

## 2. Tính số lượng đường thi hành
Dựa vào công thức Cyclomatic Complexity:
V(G) = P + 1 = 2 + 1 = 3 (đường)

## 3. Danh sách các đường thi hành tuyến độc lập
- **Đường 1 (Sản phẩm không có trong giỏ hàng)**: 
  Start -> 1 -> 2 -> 3 (True) -> 4 -> Exit
- **Đường 2 (Sản phẩm có trong giỏ, quantity <= 0)**: 
  Start -> 1 -> 2 -> 3 (False) -> 5 (True) -> 6 -> 9 -> Exit
- **Đường 3 (Sản phẩm có trong giỏ, quantity > 0)**: 
  Start -> 1 -> 2 -> 3 (False) -> 5 (False) -> 7 -> 8 -> 9 -> Exit
