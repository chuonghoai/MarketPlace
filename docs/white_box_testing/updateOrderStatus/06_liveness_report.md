# Báo cáo kiểm thử đời sống biến (Liveness Report) — `updateOrderStatus`

## Thông tin chung

- **Chức năng kiểm thử**: `updateOrderStatus`
- **File tham chiếu đồ thị dòng dữ liệu**: [`05_data_flow_graph.puml`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/updateOrderStatus/05_data_flow_graph.puml)
- **File tham chiếu đường thi hành độc lập**: [`03_independent_paths.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/updateOrderStatus/03_independent_paths.md)
- **Số biến được kiểm thử đời sống**: 5 (`order, oldStatus, history, newStatusStr, saved`)
- **Số đường thi hành tuyến độc lập**: 29

## Ký hiệu

| Ký hiệu | Ý nghĩa |
|----------|----------|
| `d` | **Definition** — Biến được khởi tạo / gán giá trị |
| `u` | **Use** — Biến được sử dụng (đọc giá trị) |
| `k` | **Kill** — Biến bị hủy / ra khỏi phạm vi |
| `~` | Biến không xuất hiện tại vị trí này trong đường đi |

## Thông tin biến trong đồ thị dòng dữ liệu

| Biến | Thao tác Definition (d) | Thao tác Use (u) | Thao tác Kill (k) |
|------|-------------------------|-------------------|--------------------|
| `order` | 1 | 2, 4, 5, 7, 8, 9, 10, 22, 24, 25, 28, 32, 35 | Exit |
| `oldStatus` | 4 | 27, 33, 34 | Exit |
| `history` | 9, 10 | 19, 22 | Exit |
| `newStatusStr` | 37, 46 | 49 | Exit |
| `saved` | 25 | 49, 50, 53, 54 | Exit |

## Bảng kiểm thử đời sống biến

| STT | Đường đi | order | oldStatus | history | newStatusStr | saved |
|-----|----------|---------|-------------|-----------|----------------|---------|
| 1 | start → 1 → 2 → 3 → Exit | `~du~k` | `~~~~k` | `~~~~k` | `~~~~k` | `~~~~k` |
| 2 | start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 12 → 13 → 19 → 20 → 22 → 23 → 24 → 25 → 26 → 30 → 31 → 37 → 38 → 39 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uuu~~~~~u~uu~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~u~u~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 3 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 14 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 40 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 4 | start → 1 → 2 → 4 → 5 → 6 → 8 → 9 → 11 → 12 → 15 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 41 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 5 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 52 → 53 → 54 → Exit | `~duuu~uu~~~~~~u~uu~~u~u~~~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~u~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~~~~k` | `~~~~~~~~~~~~~~~~~d~~~~~~~~~~~~uu~~uuk` |
| 6 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 37 → 38 → 43 → 46 → 47 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~u~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~u~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~uuuk` |
| 7 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 18 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~~u~~u~u~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~uu~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~~~~uuuk` |
| 8 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 45 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~u~~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 9 | start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 10 → 11 → 12 → 13 → 19 → 20 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 39 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uuu~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~u~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 10 | start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 10 → 11 → 12 → 14 → 19 → 20 → 22 → 23 → 24 → 25 → 26 → 30 → 31 → 37 → 38 → 40 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uuu~~~~~u~uu~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~u~u~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 11 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 27 → 28 → 29 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~u~u~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~u~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~~uuuk` |
| 12 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 27 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~u~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~uuuk` |
| 13 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 13 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 39 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 14 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 27 → 28 → 29 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~u~u~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~u~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~~uuuk` |
| 15 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 27 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~u~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~u~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~uuuk` |
| 16 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 37 → 38 → 43 → 46 → 47 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~u~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~u~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~uuuk` |
| 17 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 15 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 41 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 18 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 18 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~~u~~u~u~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~uu~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~~~~uuuk` |
| 19 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 18 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 32 → 33 → 34 → 37 → 38 → 44 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~~u~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~uu~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~uuuk` |
| 20 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 43 → 46 → 47 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~u~~u~u~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~uu~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~~~uuuk` |
| 21 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 35 → 36 → 35 → 37 → 38 → 43 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~u~~u~u~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~uu~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~~~uuuk` |
| 22 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 34 → 35 → 37 → 38 → 43 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~u~~u~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~uu~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~~uuuk` |
| 23 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 45 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~u~~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 24 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 17 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 32 → 33 → 37 → 38 → 43 → 46 → 47 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~u~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~u~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~uuuk` |
| 25 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 13 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 39 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 26 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 27 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 52 → 53 → 54 → Exit | `~duuu~uu~~~~~~u~u~~u~~~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~u~~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~~~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~uu~~uuk` |
| 27 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 16 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 27 → 28 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 54 → Exit | `~duuu~uu~~~~~~u~u~~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~u~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~~~uu~uk` |
| 28 | start → 1 → 2 → 4 → 5 → 6 → 8 → 10 → 11 → 12 → 14 → 19 → 20 → 21 → 22 → 23 → 25 → 26 → 30 → 31 → 37 → 38 → 40 → 46 → 48 → 49 → 50 → 54 → Exit | `~duuu~uu~~~~~~u~u~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~d~~~u~~u~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~d~~d~u~~k` | `~~~~~~~~~~~~~~~~d~~~~~~~~uuuk` |
| 29 | start → 1 → 2 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 12 → 16 → 19 → 20 → 22 → 23 → 24 → 25 → 26 → 27 → 30 → 31 → 37 → 38 → 42 → 46 → 48 → 49 → 50 → 51 → 52 → 53 → 54 → Exit | `~duuu~uuu~~~~~u~uu~~~~~~~~~~~~~~~k` | `~~~d~~~~~~~~~~~~~~~u~~~~~~~~~~~~~k` | `~~~~~~~~d~~~u~u~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~d~~d~u~~~~~k` | `~~~~~~~~~~~~~~~~~d~~~~~~~~~uu~~uuk` |
| **Tổng kết** |  | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên tất cả 29 đường đi được kích hoạt. Biến `order` khởi tạo tại node (1), sử dụng tại các node (2, 4, 5, 7, 8, 9, 10, 22, 24, 25, 28, 32, 35), và bị Kill tại `Exit`. Không phát hiện bất thường. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên tất cả 29 đường đi được kích hoạt. Biến `oldStatus` khởi tạo tại node (4), sử dụng tại các node (27, 33, 34), và bị Kill tại `Exit`. Không phát hiện bất thường. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên tất cả 29 đường đi được kích hoạt. Biến `history` khởi tạo tại node (9, 10), sử dụng tại các node (19, 22), và bị Kill tại `Exit`. Không phát hiện bất thường. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên tất cả 29 đường đi được kích hoạt. Biến `newStatusStr` khởi tạo tại node (37, 46), sử dụng tại các node (49), và bị Kill tại `Exit`. Không phát hiện bất thường. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên tất cả 29 đường đi được kích hoạt. Biến `saved` khởi tạo tại node (25), sử dụng tại các node (49, 50, 53, 54), và bị Kill tại `Exit`. Không phát hiện bất thường. |

## Phân tích chi tiết

### Biến `order`

- **Definition (d)**:
  - Node `1`: Tham số đầu vào đơn hàng `order` hoặc ID
- **Use (u)**:
  - Node `2`: Kiểm tra tồn tại đơn hàng
  - Node `4`: Lưu trạng thái cũ `oldStatus = order.status`
  - Node `5`: Đọc thông tin đơn hàng
  - Node `7`: Ghi log đơn hàng
  - Node `8`: Kiểm tra thông tin ghi chú
  - Node `9`: Cập nhật lịch sử đơn hàng
  - Node `10`: Ghi log trạng thái
  - Node `22`: Ghi nhận lịch sử vào order
  - Node `24`: Cập nhật ghi chú hủy nếu có
  - Node `25`: Lưu đơn hàng vào DB
  - Node `28`: Duyệt các item trong đơn hàng
  - Node `32`: Đọc đơn hàng để hoàn trả kho
  - Node `35`: Duyệt item hoàn kho
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong toàn bộ các luồng thực thi tương ứng.

### Biến `oldStatus`

- **Definition (d)**:
  - Node `4`: Lưu trạng thái trước cập nhật `oldStatus = order.status`
- **Use (u)**:
  - Node `27`: Kiểm tra `oldStatus !== SUCCESS` để hoàn kho
  - Node `33`: Kiểm tra `oldStatus !== CANCELLED`
  - Node `34`: Kiểm tra `oldStatus !== RETURNED`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong toàn bộ các luồng thực thi tương ứng.

### Biến `history`

- **Definition (d)**:
  - Node `9`: Tạo bản ghi lịch sử trạng thái với note từ DTO
  - Node `10`: Tạo bản ghi lịch sử trạng thái mặc định
- **Use (u)**:
  - Node `19`: Kiểm tra bản ghi lịch sử
  - Node `22`: Đẩy vào mảng `order.statusHistory.push(history)`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong toàn bộ các luồng thực thi tương ứng.

### Biến `newStatusStr`

- **Definition (d)**:
  - Node `37`: Chuyển đổi enum trạng thái mới sang chuỗi tiếng Việt
  - Node `46`: Xác định nhãn trạng thái mới phục vụ thông báo
- **Use (u)**:
  - Node `49`: Gửi thông báo cập nhật trạng thái đơn hàng tới người dùng
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong toàn bộ các luồng thực thi tương ứng.

### Biến `saved`

- **Definition (d)**:
  - Node `25`: Kết quả sau khi lưu `orderRepository.save(order)`
- **Use (u)**:
  - Node `49`: Dùng thông tin `saved` gửi thông báo
  - Node `50`: Kiểm tra `saved.status === SUCCESS` để xử lý ví
  - Node `53`: Xử lý hoàn tiền / cộng ví từ `saved`
  - Node `54`: Trả về `saved` cho client
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong toàn bộ các luồng thực thi tương ứng.

## Kết luận tổng thể

> Toàn bộ 5 biến (`order, oldStatus, history, newStatusStr, saved`) đều có **chu trình đời sống hợp lệ** trên tất cả 29 đường thi hành tuyến độc lập của chức năng `updateOrderStatus`.
>
> - Không phát hiện lỗi **Use-before-Definition** (sử dụng biến khi chưa khởi tạo).
>
> - Không phát hiện lỗi **Dead Definition** (khởi tạo biến nhưng không bao giờ sử dụng).
>
> - Mọi biến đều được giải phóng/kết thúc hợp lệ tại node `Exit`.

## Lưu ý về đường đi trong file `03_independent_paths.md`

Các đường đi trong file `03_independent_paths.md` liệt kê các node quyết định và node thực thi chính trên luồng nghiệp vụ. Chuỗi đời sống được tính toán chính xác dựa trên từng node xuất hiện trên đường đi và đối chiếu với các thao tác dữ liệu (`d`, `u`, `k`) được định nghĩa trong đồ thị dòng dữ liệu `05_data_flow_graph.puml`.
