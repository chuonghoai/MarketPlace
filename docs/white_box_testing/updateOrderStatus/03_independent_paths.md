# Các đường thi hành độc lập (Independent Paths) — `updateOrderStatus`

## 1. Danh sách các Node điều kiện (Predicate Nodes)

Trong đồ thị luồng điều khiển (CFG), các node điều kiện (vị từ) là các node có từ 2 cạnh đi ra trở lên (out-degree $\ge 2$), đại diện cho các điểm rẽ nhánh của chương trình:

| STT | Node | Cú pháp / Biểu thức trong code | Loại điều kiện | Số nhánh | Lý do rẽ nhánh |
|:---:|:---:|---|---|:---:|---|
| 1 | **[2]** | `if (!order)` | Rẽ nhánh if | 2 | Kiểm tra tìm thấy đơn hàng trong DB: True (ném ngoại lệ `NotFoundException`), False (tiếp tục xử lý). |
| 2 | **[6]** | `if (updateDto.note)` | Rẽ nhánh if | 2 | Kiểm tra có ghi chú mới hay không: True (gán `order.note`), False (bỏ qua). |
| 3 | **[8]** | `Array.isArray(order.statusHistory) ? ... : ...` | Toán tử 3 ngôi (Ternary) | 2 | Kiểm tra kiểu mảng của lịch sử: True (dùng mảng hiện tại [9]), False (tạo mảng khởi tạo [10]). |
| 4 | **[12]** | `switch (updateDto.status)` | Lệnh switch-case | 7 | Xác định `defaultNote` theo trạng thái: 6 case enum (`PREPARING` [13], `SHIPPING` [14], `DELIVERED` [15], `SUCCESS` [16], `CANCELLED` [17], `RETURNED` [18]) và 1 nhánh default/bỏ qua (đến [19]). |
| 5 | **[20]** | `updateDto.note \|\| defaultNote` | Short-circuit OR (`\|\|`) | 2 | Xác định note cho lịch sử: True (lấy `updateDto.note`, sang [22]), False (đánh giá `defaultNote` [21]). |
| 6 | **[23]** | `if (updateDto.status === EOrderStatus.SUCCESS)` | Rẽ nhánh if | 2 | Kiểm tra trạng thái hoàn tất để cập nhật thanh toán: True (gán `paymentStatus = PAID` [24]), False (bỏ qua [25]). |
| 7 | **[26]** | `if (updateDto.status === EOrderStatus.SUCCESS)` | Rẽ nhánh if | 2 | Kiểm tra trạng thái hoàn tất để tăng số lượng bán: True (vào kiểm tra `oldStatus` [27]), False (chuyển sang [30]). |
| 8 | **[27]** | `if (oldStatus !== EOrderStatus.SUCCESS)` | Rẽ nhánh if | 2 | Kiểm tra trạng thái trước đó chưa phải SUCCESS để tránh tăng trùng số bán: True (vào vòng lặp [28]), False (bỏ qua [30]). |
| 9 | **[28]** | `for (const item of order.items)` | Vòng lặp for | 2 | Duyệt danh sách item tăng `soldCount`: Có item (lặp [29]), Hết item / rỗng (thoát sang [30]). |
| 10 | **[30]** | `updateDto.status === EOrderStatus.CANCELLED` | Điều kiện 1 của OR (`\|\|`) | 2 | Kiểm tra hủy đơn: True (sang rollback voucher [32]), False (đánh giá tiếp điều kiện [31]). |
| 11 | **[31]** | `updateDto.status === EOrderStatus.RETURNED` | Điều kiện 2 của OR (`\|\|`) | 2 | Kiểm tra trả hàng: True (sang rollback voucher [32]), False (bỏ qua sang [37]). |
| 12 | **[33]** | `oldStatus !== EOrderStatus.CANCELLED` | Điều kiện 1 của AND (`&&`) | 2 | Kiểm tra đơn cũ chưa hủy: True (đánh giá tiếp [34]), False (short-circuit bỏ qua hoàn kho sang [37]). |
| 13 | **[34]** | `oldStatus !== EOrderStatus.RETURNED` | Điều kiện 2 của AND (`&&`) | 2 | Kiểm tra đơn cũ chưa trả hàng: True (vào vòng lặp hoàn kho [35]), False (bỏ qua sang [37]). |
| 14 | **[35]** | `for (const item of order.items)` | Vòng lặp for | 2 | Duyệt danh sách item hoàn stock kho: Có item (lặp [36]), Hết item / rỗng (thoát sang [37]). |
| 15 | **[38]** | `switch (updateDto.status)` | Lệnh switch-case | 7 | Xác định chuỗi hiển thị `newStatusStr`: 6 case enum (`PREPARING` [39], `SHIPPING` [40], `DELIVERED` [41], `SUCCESS` [42], `CANCELLED` [43], `RETURNED` [44]) và 1 nhánh default (`'Đã cập nhật'` [45]). |
| 16 | **[46]** | `updateDto.status === EOrderStatus.CANCELLED ? ... : ...` | Toán tử 3 ngôi (Ternary) | 2 | Xác định lý do hủy đơn: True (lấy `updateDto.note` [47]), False (`undefined` [48]). |
| 17 | **[50]** | `updateDto.status === EOrderStatus.SUCCESS` | Điều kiện 1 của AND (`&&`) | 2 | Kiểm tra đơn hoàn tất để gửi email thanh toán: True (đánh giá tiếp [51]), False (short-circuit sang [54]). |
| 18 | **[51]** | `saved.paymentMethod === EPaymentMethod.COD` | Điều kiện 2 của AND (`&&`) | 2 | Kiểm tra phương thức COD: True (gửi email hóa đơn [52]-[53]), False (bỏ qua sang [54]). |

---

## 2. Tính toán độ phức tạp Cyclomatic $V(G)$

### Cách 1: Tính theo số cạnh và số đỉnh của đồ thị (Graph Formula)
- Số đỉnh (Nodes) $N = 56$ (bao gồm `start`, các node từ `[1]` đến `[54]`, và `Exit`).
- Số cạnh (Edges) $E = 83$.
- Số thành phần liên thông $P = 1$.

$$V(G) = E - N + 2P = 83 - 56 + 2 \times 1 = 29$$

### Cách 2: Tính theo số điểm quyết định (Predicate Nodes Formula)
Đồ thị có 16 nút điều kiện nhị phân (mỗi nút tăng $2 - 1 = 1$ nhánh độc lập) và 2 lệnh switch-case 7 nhánh (mỗi lệnh switch tăng $7 - 1 = 6$ nhánh độc lập):

$$P_{total} = (16 \times 1) + (2 \times 6) = 16 + 12 = 28$$
$$V(G) = P_{total} + 1 = 28 + 1 = 29$$

> **Kết luận**: Đồ thị có **độ phức tạp Cyclomatic $V(G) = 29$**.
> Do đó, tập cơ sở của phương pháp kiểm thử White Box (Basis Path Testing) gồm đúng **29 đường thi hành độc lập tuyến tính (29 Basis Paths)**, tương ứng với **29 Test Cases** cần thiết để bao phủ toàn bộ 100% câu lệnh (Statement Coverage) và 100% nhánh rẽ (Branch Coverage).

---

## 3. Danh sách 29 Đường thi hành độc lập (Basis Independent Paths)

1. **Đường 1 (Không tìm thấy đơn hàng - Exception)**:  
   `start → 1 → 2 → 3 → Exit`

2. **Đường 2 (PREPARING, có note, có statusHistory)**:  
   `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 12 → 13 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 39 → 46 → 48 → 49 → 50 → 54 → Exit`

3. **Đường 3 (SHIPPING, không note, statusHistory null - fallback defaultNote)**:  
   `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 14 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 40 → 46 → 48 → 49 → 50 → 54 → Exit`

4. **Đường 4 (DELIVERED, không note, có statusHistory)**:  
   `start → 1 → 2 → 4 → 5 → 6 → 8 → 9 → 11 → 12 → 15 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 41 → 46 → 48 → 49 → 50 → 54 → Exit`

5. **Đường 5 (SUCCESS hoàn tất, COD, oldStatus !== SUCCESS, có items tăng soldCount và gửi billing email)**:  
   `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 52 → 53 → 54 → Exit`

6. **Đường 6 (SUCCESS, non-COD / VNPAY, oldStatus !== SUCCESS, có items tăng soldCount, không gửi billing email)**:  
   `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 54 → Exit`

7. **Đường 7 (SUCCESS, oldStatus === SUCCESS -> bỏ qua tăng soldCount)**:  
   `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 54 → Exit`

8. **Đường 8 (SUCCESS, oldStatus !== SUCCESS, items rỗng -> không lặp tăng soldCount)**:  
   `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 54 → Exit`

9. **Đường 9 (CANCELLED, có note lý do, oldStatus !== CANCELLED/RETURNED, có items hoàn kho)**:  
   `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 12 → 17 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 43 → 46 → 47 → 49 → 50 → 54 → Exit`

10. **Đường 10 (CANCELLED, không note, oldStatus !== CANCELLED/RETURNED, có items hoàn kho)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 43 → 46 → 48 → 49 → 50 → 54 → Exit`

11. **Đường 11 (CANCELLED, oldStatus === CANCELLED -> rollback voucher nhưng bỏ qua hoàn kho tại node 33)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 37 → 38 → 43 → 46 → 48 → 49 → 50 → 54 → Exit`

12. **Đường 12 (CANCELLED, oldStatus === RETURNED -> rollback voucher nhưng bỏ qua hoàn kho tại node 34)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 37 → 38 → 43 → 46 → 48 → 49 → 50 → 54 → Exit`

13. **Đường 13 (CANCELLED, items rỗng -> rollback voucher, không lặp hoàn kho tại node 35)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 35 → 37 → 38 → 43 → 46 → 48 → 49 → 50 → 54 → Exit`

14. **Đường 14 (RETURNED, có items hoàn kho, oldStatus !== CANCELLED/RETURNED)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 18 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit`

15. **Đường 15 (RETURNED, oldStatus === CANCELLED -> rollback voucher nhưng bỏ qua hoàn kho tại node 33)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 18 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit`

16. **Đường 16 (RETURNED, oldStatus === RETURNED -> rollback voucher nhưng bỏ qua hoàn kho tại node 34)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 18 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 34 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit`

17. **Đường 17 (RETURNED, items rỗng -> rollback voucher, không lặp hoàn kho tại node 35)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 18 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 34 → 35 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit`

18. **Đường 18 (DEFAULT Status không xác định, không note, statusHistory null)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 45 → 46 → 48 → 49 → 50 → 54 → Exit`

19. **Đường 19 (PREPARING, không note, có statusHistory)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 8 → 9 → 11 → 12 → 13 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 39 → 46 → 48 → 49 → 50 → 54 → Exit`

20. **Đường 20 (SHIPPING, có note, có statusHistory)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 12 → 14 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 40 → 46 → 48 → 49 → 50 → 54 → Exit`

21. **Đường 21 (DELIVERED, có note, statusHistory null)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 10 → 11 → 12 → 15 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 41 → 46 → 48 → 49 → 50 → 54 → Exit`

22. **Đường 22 (SUCCESS, có note, có statusHistory, COD - gửi billing email)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 12 → 16 → 19 → 20 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 52 → 53 → 54 → Exit`

23. **Đường 23 (SUCCESS, có note, statusHistory null, non-COD)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 54 → Exit`

24. **Đường 24 (SUCCESS, không note, có statusHistory, COD - gửi billing email)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 8 → 9 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 52 → 53 → 54 → Exit`

25. **Đường 25 (CANCELLED, có note, statusHistory null, có items hoàn kho)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 43 → 46 → 47 → 49 → 50 → 54 → Exit`

26. **Đường 26 (CANCELLED, không note, có statusHistory, có items hoàn kho)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 8 → 9 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 43 → 46 → 48 → 49 → 50 → 54 → Exit`

27. **Đường 27 (RETURNED, có note, có statusHistory, có items hoàn kho)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 12 → 18 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit`

28. **Đường 28 (RETURNED, không note, có statusHistory, có items hoàn kho)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 8 → 9 → 11 → 12 → 18 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit`

29. **Đường 29 (DEFAULT Status không xác định, có note, có statusHistory)**:  
    `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 12 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 45 → 46 → 48 → 49 → 50 → 54 → Exit`
