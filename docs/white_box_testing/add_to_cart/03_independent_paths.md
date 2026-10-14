# 03. Independent Paths

## Danh sách các node điều kiện (V(G))
- `[3]`: Điều kiện kiểm tra `if (item)` - Sản phẩm đã tồn tại trong giỏ hàng của người dùng hay chưa (true/false).

Số node điều kiện: `P = 1`  
Công thức tính số đường thi hành tuyến độc lập: `V(G) = P + 1 = 2`

## Các đường thi hành tuyến độc lập
1. **Path 1**: start → 1 → 2 → 3(True) → 4 → 6 → 7 → Exit
2. **Path 2**: start → 1 → 2 → 3(False) → 5 → 6 → 7 → Exit
