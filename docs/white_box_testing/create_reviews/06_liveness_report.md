# Báo cáo kiểm thử đời sống biến (Liveness Report) — `createReviews`

## Thông tin chung

- **Chức năng kiểm thử**: `createReviews`
- **File tham chiếu đồ thị dòng dữ liệu**: [`05_data_flow_graph.puml`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/create_reviews/05_data_flow_graph.puml)
- **File tham chiếu đường thi hành độc lập**: [`03_independent_paths.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/create_reviews/03_independent_paths.md)
- **Số biến được kiểm thử đời sống**: 5 (`userId, request, submittedCount, review, productIdsToUpdate`)
- **Số đường thi hành tuyến độc lập**: 7

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
| `userId` | 1 | 8 | Exit |
| `request` | 1 | 4 | Exit |
| `submittedCount` | 2, 13 | 13, 21 | Exit |
| `review` | 8 | 9 | Exit |
| `productIdsToUpdate` | 3 | 12, 14 | Exit |

## Bảng kiểm thử đời sống biến

| STT | Đường đi | userId | request | submittedCount | review | productIdsToUpdate |
|-----|----------|----------|-----------|------------------|----------|----------------------|
| 1 | start → 1 → 2 → 3 → 4 → 14 → 21 → Exit | `~d~~~~~k` | `~d~~u~~k` | `~~d~~~uk` | `~~~~~~~k` | `~~~d~u~k` |
| 2 | start → 1 → 2 → 3 → 4 → 5 → 6 → 4 → 14 → 21 → Exit | `~d~~~~~~~~k` | `~d~~u~~u~~k` | `~~d~~~~~~uk` | `~~~~~~~~~~k` | `~~~d~~~~u~k` |
| 3 | start → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 4 → 14 → 21 → Exit | `~d~~~~~~~~~k` | `~d~~u~~~u~~k` | `~~d~~~~~~~uk` | `~~~~~~~~~~~k` | `~~~d~~~~~u~k` |
| 4 | start → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 4 → 14 → 21 → Exit | `~d~~~~~~u~~~~~~~~k` | `~d~~u~~~~~~~~~u~~k` | `~~d~~~~~~~~~~d~~uk` | `~~~~~~~~du~~~~~~~k` | `~~~d~~~~~~~~u~~u~k` |
| 5 | start → 1 → 2 → 3 → 4 → 14 → 15 → 16 → 19 → 20 → 14 → 21 → Exit | `~d~~~~~~~~~~k` | `~d~~u~~~~~~~k` | `~~d~~~~~~~~uk` | `~~~~~~~~~~~~k` | `~~~d~u~~~~u~k` |
| 6 | start → 1 → 2 → 3 → 4 → 14 → 15 → 16 → 17 → 19 → 20 → 14 → 21 → Exit | `~d~~~~~~~~~~~k` | `~d~~u~~~~~~~~k` | `~~d~~~~~~~~~uk` | `~~~~~~~~~~~~~k` | `~~~d~u~~~~~u~k` |
| 7 | start → 1 → 2 → 3 → 4 → 14 → 15 → 16 → 17 → 18 → 20 → 14 → 21 → Exit | `~d~~~~~~~~~~~k` | `~d~~u~~~~~~~~k` | `~~d~~~~~~~~~uk` | `~~~~~~~~~~~~~k` | `~~~d~u~~~~~u~k` |
| **Tổng kết** |  | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `userId` khởi tạo tại node (1), sử dụng tại các node (8), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `request` khởi tạo tại node (1), sử dụng tại các node (4), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `submittedCount` khởi tạo tại node (2, 13), sử dụng tại các node (13, 21), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `review` khởi tạo tại node (8), sử dụng tại các node (9), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `productIdsToUpdate` khởi tạo tại node (3), sử dụng tại các node (12, 14), và bị Kill tại `Exit`. Không có lỗi use-before-definition. |

## Phân tích chi tiết

### Biến `userId`

- **Definition (d)**:
  - Node `1`: Tham số đầu vào `userId` xác định người đánh giá
- **Use (u)**:
  - Node `8`: Tạo bản ghi đánh giá mới gắn với `userId`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `request`

- **Definition (d)**:
  - Node `1`: Tham số đầu vào `request` chứa danh sách reviews
- **Use (u)**:
  - Node `4`: Vòng lặp `for (const item of request.reviews)`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `submittedCount`

- **Definition (d)**:
  - Node `2`: Khởi tạo biến đếm `submittedCount = 0`
  - Node `13`: Tăng biến đếm `submittedCount++` sau khi lưu đánh giá
- **Use (u)**:
  - Node `13`: Đọc giá trị hiện tại để tăng `submittedCount++`
  - Node `21`: Trả về `submittedCount` trong kết quả
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `review`

- **Definition (d)**:
  - Node `8`: Khởi tạo entity `reviewRepository.create(...)`
- **Use (u)**:
  - Node `9`: Lưu đánh giá vào database qua `reviewRepository.save(review)`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `productIdsToUpdate`

- **Definition (d)**:
  - Node `3`: Khởi tạo tập hợp `productIdsToUpdate = new Set()`
- **Use (u)**:
  - Node `12`: Thêm `productId` vào set qua `productIdsToUpdate.add(productId)`
  - Node `14`: Duyệt set `for (const productId of productIdsToUpdate)` để cập nhật rating
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

## Kết luận tổng thể

> Toàn bộ 5 biến (`userId, request, submittedCount, review, productIdsToUpdate`) đều có **chu trình đời sống hợp lệ** trên tất cả 7 đường thi hành tuyến độc lập của chức năng `createReviews`.
>
> - Không phát hiện lỗi **Use-before-Definition** (sử dụng biến khi chưa khởi tạo).
>
> - Không phát hiện lỗi **Dead Definition** (khởi tạo biến nhưng không bao giờ sử dụng).
>
> - Mọi biến đều được giải phóng/kết thúc hợp lệ tại node `Exit`.

## Lưu ý về đường đi trong file `03_independent_paths.md`

Các đường đi trong file `03_independent_paths.md` liệt kê các node quyết định và node thực thi chính trên luồng nghiệp vụ. Chuỗi đời sống được tính toán chính xác dựa trên từng node xuất hiện trên đường đi và đối chiếu với các thao tác dữ liệu (`d`, `u`, `k`) được định nghĩa trong đồ thị dòng dữ liệu `05_data_flow_graph.puml`.
