# 03. Independent Paths

## Danh sách các node điều kiện (V(G))
- `[3]`: Điều kiện kiểm tra `!category` tồn tại (true/false)
- `[8]`: Điều kiện kiểm tra biến `mediaPublicIds` có tồn tại (true/false) (trước toán tử `&&`)
- `[9]`: Điều kiện kiểm tra mảng `mediaPublicIds.length > 0` (true/false) (sau toán tử `&&`)
- `[10]`: Hàm `confirmUpload` có thể ném Exception do gọi service ngoài (success/exception)

Số node điều kiện `P = 4`
Công thức tính số đường tuyến độc lập: `V(G) = P + 1 = 5`

## Các đường thi hành tuyến độc lập
1. 1 → 2 → 3(True) → 4 → Exit
2. 1 → 2 → 3(False) → 5 → 6 → 7 → 8(False) → 13 → 14 → Exit
3. 1 → 2 → 3(False) → 5 → 6 → 7 → 8(True) → 9(False) → 13 → 14 → Exit
4. 1 → 2 → 3(False) → 5 → 6 → 7 → 8(True) → 9(True) → 10(Success) → 13 → 14 → Exit
5. 1 → 2 → 3(False) → 5 → 6 → 7 → 8(True) → 9(True) → 10(Exception) → 11 → 12 → 13 → 14 → Exit
