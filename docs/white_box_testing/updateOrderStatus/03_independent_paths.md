# Đường thi hành tuyến độc lập

## 1. Các node điều kiện
- **Node 2**: `!order`
- **Node 6**: `updateDto.note`
- **Node 8**: `Array.isArray(order.statusHistory)`
- **Node 12 (6 điều kiện case)**: `switch(updateDto.status)`
  - `case EOrderStatus.PREPARING`
  - `case EOrderStatus.SHIPPING`
  - `case EOrderStatus.DELIVERED`
  - `case EOrderStatus.SUCCESS`
  - `case EOrderStatus.CANCELLED`
  - `case EOrderStatus.RETURNED`
- **Node 20**: `updateDto.note` (toán tử `||` trong gán biến)
- **Node 23**: `updateDto.status === EOrderStatus.SUCCESS`
- **Node 26**: `updateDto.status === EOrderStatus.SUCCESS`
- **Node 27**: `oldStatus !== EOrderStatus.SUCCESS`
- **Node 28**: `for (const item of order.items)` (điều kiện vòng lặp)
- **Node 30**: `updateDto.status === EOrderStatus.CANCELLED` (vế 1 của `||`)
- **Node 31**: `updateDto.status === EOrderStatus.RETURNED` (vế 2 của `||`)
- **Node 33**: `oldStatus !== EOrderStatus.CANCELLED` (vế 1 của `&&`)
- **Node 34**: `oldStatus !== EOrderStatus.RETURNED` (vế 2 của `&&`)
- **Node 35**: `for (const item of order.items)` (điều kiện vòng lặp)
- **Node 38 (6 điều kiện case)**: `switch(updateDto.status)`
  - `case EOrderStatus.PREPARING`
  - `case EOrderStatus.SHIPPING`
  - `case EOrderStatus.DELIVERED`
  - `case EOrderStatus.SUCCESS`
  - `case EOrderStatus.CANCELLED`
  - `case EOrderStatus.RETURNED`
- **Node 46**: `updateDto.status === EOrderStatus.CANCELLED` (điều kiện toán tử ba ngôi `? :`)
- **Node 50**: `updateDto.status === EOrderStatus.SUCCESS` (vế 1 của `&&`)
- **Node 51**: `saved.paymentMethod === EPaymentMethod.COD` (vế 2 của `&&`)

**Tổng số node/nhánh điều kiện (P):** 16 (điều kiện lẻ) + 6 (case node 12) + 6 (case node 38) = 28

## 2. Tính toán V(G)
Độ phức tạp Cyclomatic của luồng:
`V(G) = P + 1 = 28 + 1 = 29`

## 3. Danh sách đường thi hành (Mẫu đại diện)
Do đồ thị có độ phức tạp cao, sau đây là các đường thi hành đại diện đi qua các nhánh chính:

1. **Path 1 (Không tìm thấy đơn hàng):**
   `start -> 1 -> 2 -> 3 -> Exit`
   
2. **Path 2 (Cập nhật sang SUCCESS, không có ghi chú, status cũ PENDING, phương thức COD):**
   `start -> 1 -> 2 -> 4 -> 5 -> 6 -> 8 -> 10 -> 11 -> 12 -> 16 -> 19 -> 20 -> 21 -> 22 -> 23 -> 24 -> 25 -> 26 -> 27 -> 28 -> 29 -> 28 -> 30 -> 31 -> 37 -> 38 -> 42 -> 46 -> 48 -> 49 -> 50 -> 51 -> 52 -> 53 -> 54 -> Exit`

3. **Path 3 (Cập nhật sang CANCELLED, có ghi chú, status cũ PENDING):**
   `start -> 1 -> 2 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 11 -> 12 -> 17 -> 19 -> 20 -> 22 -> 23 -> 25 -> 26 -> 30 -> 32 -> 33 -> 34 -> 35 -> 36 -> 35 -> 37 -> 38 -> 43 -> 46 -> 47 -> 49 -> 50 -> 54 -> Exit`

4. **Path 4 (Cập nhật sang RETURNED, status cũ CANCELLED):**
   `start -> 1 -> 2 -> 4 -> 5 -> 6 -> 8 -> 9 -> 11 -> 12 -> 18 -> 19 -> 20 -> 21 -> 22 -> 23 -> 25 -> 26 -> 30 -> 31 -> 32 -> 33 -> 37 -> 38 -> 44 -> 46 -> 48 -> 49 -> 50 -> 54 -> Exit`

*(Các path khác tuân theo tổ hợp của các nhánh điều kiện còn lại)*
