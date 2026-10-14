# 03. Independent Đườngs

## Danh sách các node điều kiện (V(G))
- `[4]`: Vòng lặp `for (const item of request.reviews)` - Kiểm tra còn phần tử trong mảng đánh giá hay không (true/false).
- `[6]`: Điều kiện kiểm tra `!orderItem` (true/false) (trước toán tử `||`).
- `[7]`: Điều kiện kiểm tra `orderItem.isReviewed` (true/false) (sau toán tử `||`).
- `[14]`: Vòng lặp `for (const productId of productIdsToUpdate)` - Kiểm tra còn `productId` trong Set hay không (true/false).
- `[16]`: Điều kiện kiểm tra `result` có tồn tại (true/false) (trước toán tử `&&` trong toán tử 3 ngôi).
- `[17]`: Điều kiện kiểm tra `result.avgRating` có giá trị (true/false) (sau toán tử `&&` trong toán tử 3 ngôi).

Số node điều kiện: `P = 6`  
Công thức tính số đường thi hành tuyến độc lập: `V(G) = P + 1 = 7`

## Các đường thi hành tuyến độc lập
1. Đường 1: start → 1 → 2 → 3 → 4 → 14 → 21 → Exit
2. Đường 2: start → 1 → 2 → 3 → 4 → 5 → 6 → 4 → 14 → 21 → Exit
3. Đường 3: start → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 4 → 14 → 21 → Exit
4. Đường 4: start → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 4 → 14 → 21 → Exit
5. Đường 5: start → 1 → 2 → 3 → 4 → 14 → 15 → 16 → 19 → 20 → 14 → 21 → Exit
6. Đường 6: start → 1 → 2 → 3 → 4 → 14 → 15 → 16 → 17 → 19 → 20 → 14 → 21 → Exit
7. Đường 7: start → 1 → 2 → 3 → 4 → 14 → 15 → 16 → 17 → 18 → 20 → 14 → 21 → Exit
