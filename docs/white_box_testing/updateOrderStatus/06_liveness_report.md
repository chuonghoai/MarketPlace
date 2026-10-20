# Báo cáo kiểm thử đời sống biến (Liveness Report) — `updateOrderStatus`

## Thông tin chung

- **Chức năng kiểm thử**: `updateOrderStatus`
- **File tham chiếu đồ thị dòng dữ liệu**: [`05_data_flow_graph.puml`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/updateOrderStatus/05_data_flow_graph.puml)
- **File tham chiếu đường thi hành độc lập**: [`03_independent_paths.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/updateOrderStatus/03_independent_paths.md)
- **Số biến được kiểm thử đời sống**: 5 biến (`order`, `oldStatus`, `history`, `newStatusStr`, `saved`)
- **Số đường thi hành tuyến độc lập cơ sở**: 29 đường (khớp với độ phức tạp Cyclomatic $V(G) = 29$)

---

## Ký hiệu

| Ký hiệu | Ý nghĩa |
|:---:|---|
| `d` | **Definition** — Biến được khởi tạo / gán giá trị mới |
| `u` | **Use** — Biến được sử dụng (đọc giá trị trong tính toán, điều kiện, ghi DB hoặc gọi hàm) |
| `k` | **Kill** — Biến bị hủy / ra khỏi phạm vi hoạt động tại điểm kết thúc hàm (`Exit`) |
| `~` | Biến không có thao tác dữ liệu nào tại node tương ứng trên đường đi |

---

## Thông tin biến trong đồ thị dòng dữ liệu (DFG)

| Biến | Thao tác Definition (d) | Thao tác Use (u) | Thao tác Kill (k) |
|---|:---:|:---:|:---:|
| `order` | [1] | [2], [4], [5], [7], [8], [9], [10], [22], [24], [25], [28], [32], [35] | Exit |
| `oldStatus` | [4] | [27], [33], [34] | Exit |
| `history` | [9], [10] | [19], [22] | Exit |
| `newStatusStr` | [37], [46] | [49] | Exit |
| `saved` | [25] | [49], [50], [53], [54] | Exit |

---

## Bảng kiểm thử đời sống biến trên 29 đường thi hành độc lập

| STT | Đường đi | order | oldStatus | history | newStatusStr | saved |
|:---:|---|:---:|:---:|:---:|:---:|:---:|
| 1 | `start → 1 → 2 → 3 → Exit` | `~du~k` | `~~~~k` | `~~~~k` | `~~~~k` | `~~~~k` |
| 2 | `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 12 → 13 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 39 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uuu~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~u~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 3 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 14 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 40 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uu~~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 4 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 9 → 11 → 12 → 15 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 41 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uu~~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 5 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 52 → 53 → 54 → Exit` | `~duuu~uu~~~~~~u~uu~~u~u~~~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~u~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~~~~k` | `~~~~~~~~~~~~~~~~~d~~~~~~~~~~~~uu~~uuk` |
| 6 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 54 → Exit` | `~duuu~uu~~~~~~u~uu~~u~u~~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~u~~~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~~~k` | `~~~~~~~~~~~~~~~~~d~~~~~~~~~~~~uu~uk` |
| 7 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 54 → Exit` | `~duuu~uu~~~~~~u~uu~~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~u~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~~d~~~~~~~~uu~uk` |
| 8 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 54 → Exit` | `~duuu~uu~~~~~~u~uu~~u~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~u~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~~d~~~~~~~~uu~uk` |
| 9 | `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 12 → 17 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 43 → 46 → 47 → 49 → 50 → 54 → Exit` | `~duuu~uuu~~~~~u~u~~u~~u~u~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~uu~~~~~~~~~~k` | `~~~~~~~~d~~~u~u~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~~~uuuk` |
| 10 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 43 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uu~~~~~~u~u~~u~~u~u~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~uu~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~~~uuuk` |
| 11 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 37 → 38 → 43 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uu~~~~~~u~u~~u~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~u~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~uuuk` |
| 12 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 37 → 38 → 43 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uu~~~~~~u~u~~u~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~uu~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~uuuk` |
| 13 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 35 → 37 → 38 → 43 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uu~~~~~~u~u~~u~~u~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~uu~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~d~~d~u~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~uuuk` |
| 14 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 18 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uu~~~~~~u~u~~~u~~u~u~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~uu~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~~~~uuuk` |
| 15 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 18 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uu~~~~~~u~u~~~u~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~u~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~uuuk` |
| 16 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 18 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 34 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uu~~~~~~u~u~~~u~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~uu~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~uuuk` |
| 17 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 18 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 34 → 35 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uu~~~~~~u~u~~~u~~u~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~uu~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~uuuk` |
| 18 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 45 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uu~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~u~~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 19 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 9 → 11 → 12 → 13 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 39 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uu~~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 20 | `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 12 → 14 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 40 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uuu~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~u~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 21 | `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 10 → 11 → 12 → 15 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 41 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uuu~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~u~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 22 | `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 12 → 16 → 19 → 20 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 52 → 53 → 54 → Exit` | `~duuu~uuu~~~~~u~uu~~u~u~~~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~u~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~u~u~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~~~~k` | `~~~~~~~~~~~~~~~~~~d~~~~~~~~~~~uu~~uuk` |
| 23 | `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 54 → Exit` | `~duuu~uuu~~~~~u~uu~~u~u~~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~u~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~u~u~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~~~k` | `~~~~~~~~~~~~~~~~~~d~~~~~~~~~~~uu~uk` |
| 24 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 9 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 52 → 53 → 54 → Exit` | `~duuu~uu~~~~~~u~uu~~u~u~~~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~u~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~~~~k` | `~~~~~~~~~~~~~~~~~d~~~~~~~~~~~~uu~~uuk` |
| 25 | `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 43 → 46 → 47 → 49 → 50 → 54 → Exit` | `~duuu~uuu~~~~~u~u~~u~~u~u~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~uu~~~~~~~~~~k` | `~~~~~~~~d~~~u~u~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~~~uuuk` |
| 26 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 9 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 43 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uu~~~~~~u~u~~u~~u~u~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~uu~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~~~uuuk` |
| 27 | `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 12 → 18 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uuu~~~~~u~u~~~u~~u~u~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~uu~~~~~~~~~~k` | `~~~~~~~~d~~~u~u~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~~~~uuuk` |
| 28 | `start → 1 → 2 → 4 → 5 → 6 → 8 → 9 → 11 → 12 → 18 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uu~~~~~~u~u~~~u~~u~u~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~uu~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~~~~uuuk` |
| 29 | `start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 12 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 45 → 46 → 48 → 49 → 50 → 54 → Exit` | `~duuu~uuu~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~u~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| **Tổng kết** | | **Hợp lệ** ✅ — Khởi tạo tại [1], sử dụng và giải phóng `Exit`. | **Hợp lệ** ✅ — Khởi tạo tại [4], sử dụng và giải phóng `Exit`. | **Hợp lệ** ✅ — Khởi tạo tại [9]/[10], sử dụng và giải phóng `Exit`. | **Hợp lệ** ✅ — Khởi tạo tại [37]/[46], sử dụng và giải phóng `Exit`. | **Hợp lệ** ✅ — Khởi tạo tại [25], sử dụng và giải phóng `Exit`. |

---

## Phân tích chi tiết từng biến

### 1. Biến `order`
- **Definition (d)**: Node `[1]` (`const order = await this.orderRepository.findOne(...)`).
- **Use (u)**: 
  - Node `[2]`: `if (!order)`
  - Node `[4]`: `const oldStatus = order.status;`
  - Node `[5]`: `order.status = updateDto.status;`
  - Node `[7]`: `order.note = updateDto.note;`
  - Node `[8]`: `Array.isArray(order.statusHistory)`
  - Node `[9]`: Lấy `order.statusHistory`
  - Node `[10]`: Lấy `order.createdAt`
  - Node `[22]`: `order.statusHistory = history;`
  - Node `[24]`: `order.paymentStatus = EPaymentStatus.PAID;`
  - Node `[25]`: `await this.orderRepository.save(order);`
  - Node `[28]`: `for (const item of order.items)`
  - Node `[32]`: `await this.checkoutService.rollbackVouchersForOrder(order.id);`
  - Node `[35]`: `for (const item of order.items)`
- **Kill (k)**: Tại node `Exit` khi hàm trả về hoặc ném ngoại lệ.
- **Kết luận**: **Hợp lệ** ✅ — Không có lỗi Use-before-Definition hay Dead Definition.

### 2. Biến `oldStatus`
- **Definition (d)**: Node `[4]` (`const oldStatus = order.status;`).
- **Use (u)**:
  - Node `[27]`: `if (oldStatus !== EOrderStatus.SUCCESS)`
  - Node `[33]`: `if (oldStatus !== EOrderStatus.CANCELLED ...)`
  - Node `[34]`: `&& oldStatus !== EOrderStatus.RETURNED`
- **Kill (k)**: Tại node `Exit`.
- **Kết luận**: **Hợp lệ** ✅ — Biến lưu trữ trạng thái trước cập nhật để kiểm tra nghiệp vụ và kết thúc hợp lệ.

### 3. Biến `history`
- **Definition (d)**: 
  - Node `[9]`: `order.statusHistory` (nếu là mảng)
  - Node `[10]`: Mảng khởi tạo chứa bản ghi ban đầu
- **Use (u)**:
  - Node `[19]`: `history.push(...)`
  - Node `[22]`: `order.statusHistory = history;`
- **Kill (k)**: Tại node `Exit`.
- **Kết luận**: **Hợp lệ** ✅ — Biến được định nghĩa ở một trong 2 nhánh toán tử 3 ngôi và luôn được sử dụng tại [19], [22].

### 4. Biến `newStatusStr`
- **Definition (d)**: 
  - Node `[37]`: `let newStatusStr = '';`
  - Node `[39]` đến `[45]`: Gán chuỗi tiếng Việt theo từng case của switch
- **Use (u)**:
  - Node `[49]`: `this.sendStatusUpdateEmail(saved, newStatusStr, cancelReason);`
- **Kill (k)**: Tại node `Exit`.
- **Kết luận**: **Hợp lệ** ✅ — Chuỗi hiển thị luôn được gán và sử dụng gửi email thông báo.

### 5. Biến `saved`
- **Definition (d)**: Node `[25]` (`const saved = await this.orderRepository.save(order);`).
- **Use (u)**:
  - Node `[49]`: `this.sendStatusUpdateEmail(saved, ...)`
  - Node `[50]`: `saved.paymentMethod === EPaymentMethod.COD`
  - Node `[53]`: `this.sendBillingEmail(saved);`
  - Node `[54]`: `return this.mapToOrderDetailDto(saved);`
- **Kill (k)**: Tại node `Exit`.
- **Kết luận**: **Hợp lệ** ✅ — Entity đã lưu được sử dụng xuyên suốt các bước gửi email và return DTO.

---

## Kết luận tổng thể

> Cả 5 biến (`order`, `oldStatus`, `history`, `newStatusStr`, `saved`) đều có chu trình đời sống **hợp lệ 100%** trên toàn bộ 29 đường thi hành độc lập của hàm `updateOrderStatus`.
> 
> Toàn bộ 3 tài liệu:
> - [`03_independent_paths.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/updateOrderStatus/03_independent_paths.md) (29 đường thi hành độc lập)
> - [`04_branch_test_cases.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/updateOrderStatus/04_branch_test_cases.md) (29 test case bao phủ toàn bộ 39 nhánh rẽ)
> - [`06_liveness_report.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/updateOrderStatus/06_liveness_report.md) (29 chuỗi đời sống biến)
> 
> Đã được **đồng bộ hoàn toàn về con số 29 Test Cases**, giải quyết triệt để sự mâu thuẫn giữa 29 và 39.
