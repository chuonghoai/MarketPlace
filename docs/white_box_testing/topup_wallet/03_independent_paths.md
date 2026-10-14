# 03. Independent Paths

## Danh sách các node điều kiện (V(G))
- `[2]`: Điều kiện kiểm tra `!amount` (true/false) (trước toán tử `||`).
- `[3]`: Điều kiện kiểm tra `amount < 10000` (true/false) (sau toán tử `||`).
- `[5]`: Điều kiện kiểm tra `paymentMethod === 'VNPAY'` (true/false).
- `[9]`: Điều kiện kiểm tra `paymentMethod === 'MOMO'` (true/false).
- `[13]`: Điều kiện kiểm tra `paymentMethod === 'PAYPAL'` (true/false).
- `[21]`: Điểm thực thi truy vấn DB trong khối `try` có thể ném ngoại lệ hệ thống (success/db_exception).
- `[22]`: Điều kiện kiểm tra `!wallet` (true/false).
- `[24]`: Điều kiện kiểm tra trạng thái ví `wallet.status === EWalletStatus.LOCKED` (true/false).

Số node điều kiện: `P = 8`  
Công thức tính số đường thi hành tuyến độc lập: `V(G) = P + 1 = 9`

## Các đường thi hành tuyến độc lập
1. Path 1: start → 1 → 2 → 4 → Exit
2. Path 2: start → 1 → 2 → 3 → 4 → Exit
3. Path 3: start → 1 → 2 → 3 → 5 → 6 → 7 → 8 → Exit
4. Path 4: start → 1 → 2 → 3 → 5 → 9 → 10 → 11 → 12 → Exit
5. Path 5: start → 1 → 2 → 3 → 5 → 9 → 13 → 14 → 15 → 16 → Exit
6. Path 6: start → 1 → 2 → 3 → 5 → 9 → 13 → 17 → 18 → 19 → 20 → 21 → 34 → 35 → 36 → 37 → Exit
7. Path 7: start → 1 → 2 → 3 → 5 → 9 → 13 → 17 → 18 → 19 → 20 → 21 → 22 → 23 → 34 → 35 → 36 → 37 → Exit
8. Path 8: start → 1 → 2 → 3 → 5 → 9 → 13 → 17 → 18 → 19 → 20 → 21 → 22 → 24 → 25 → 34 → 35 → 36 → 37 → Exit
9. Path 9: start → 1 → 2 → 3 → 5 → 9 → 13 → 17 → 18 → 19 → 20 → 21 → 22 → 24 → 26 → 27 → 28 → 29 → 30 → 31 → 32 → 33 → 37 → Exit
