# Báo cáo kiểm thử đời sống biến (Liveness Report) — `getAllProducts`

## Thông tin chung

- **Chức năng kiểm thử**: `getAllProducts`
- **File tham chiếu đồ thị dòng dữ liệu**: [`05_data_flow_graph.puml`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/get_all_products/05_data_flow_graph.puml)
- **File tham chiếu đường thi hành độc lập**: [`03_independent_paths.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/get_all_products/03_independent_paths.md)
- **Số biến được kiểm thử đời sống**: 5 (`dto, categories, matchedIds, qb, products`)
- **Số đường thi hành tuyến độc lập**: 10

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
| `dto` | 1 | 2, 15, 16 | Exit |
| `categories` | 2, 4, 13 | 20, 21, 22, 23 | Exit |
| `matchedIds` | 16 | 17, 19 | Exit |
| `qb` | 14 | 19, 23, 27, 29, 31, 33, 36, 37 | Exit |
| `products` | 37 | 38 | Exit |

## Bảng kiểm thử đời sống biến

| STT | Đường đi | dto | categories | matchedIds | qb | products |
|-----|----------|-------|--------------|--------------|------|------------|
| 1 | start → 1 → 2 → 3 → 4 → 5 → 14 → 15 → 16 → 17 → 18 → Exit | `~du~~~~uu~~k` | `~~d~d~~~~~~k` | `~~~~~~~~du~k` | `~~~~~~d~~~~k` | `~~~~~~~~~~~k` |
| 2 | start → 1 → 2 → 3 → 4 → 5 → 14 → 15 → 16 → 17 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 32 → 33 → 37 → 38 → Exit | `~du~~~~uu~~~~~~~~~~~~~~k` | `~~d~d~~~~~~uuuu~~~~~~~~k` | `~~~~~~~~duu~~~~~~~~~~~~k` | `~~~~~~d~~~u~~~u~~~u~uu~k` | `~~~~~~~~~~~~~~~~~~~~~duk` |
| 3 | start → 1 → 2 → 3 → 4 → 6 → 14 → 15 → 20 → 21 → 22 → 23 → 24 → 25 → 28 → 30 → 32 → 34 → 37 → 38 → Exit | `~du~~~~u~~~~~~~~~~~~k` | `~~d~d~~~uuuu~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~d~~~~u~~~~~~u~k` | `~~~~~~~~~~~~~~~~~~duk` |
| 4 | start → 1 → 2 → 3 → 7 → 8 → 9 → 10 → 8 → 11 → 12 → 13 → 14 → 15 → 20 → 21 → 22 → 23 → 24 → 25 → 28 → 30 → 32 → 35 → 37 → 38 → Exit | `~du~~~~~~~~~~u~~~~~~~~~~~~k` | `~~d~~~~~~~~d~~uuuu~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~d~~~~u~~~~~~u~k` | `~~~~~~~~~~~~~~~~~~~~~~~~duk` |
| 5 | start → 1 → 2 → 3 → 7 → 8 → 9 → 8 → 11 → 12 → 14 → 15 → 20 → 24 → 25 → 28 → 30 → 32 → 36 → 37 → 38 → Exit | `~du~~~~~~~~u~~~~~~~~~k` | `~~d~~~~~~~~~u~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~d~~~~~~~uu~k` | `~~~~~~~~~~~~~~~~~~~duk` |
| 6 | start → 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 20 → 24 → 25 → 26 → 28 → 29 → 32 → 36 → 37 → 38 → Exit | `~du~~~~~~u~~~~~~~~~~k` | `~~d~~~~~~~u~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~~~~u~uu~k` | `~~~~~~~~~~~~~~~~~~duk` |
| 7 | start → 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 20 → 24 → 25 → 28 → 30 → 31 → 32 → 36 → 37 → 38 → Exit | `~du~~~~~~u~~~~~~~~~~k` | `~~d~~~~~~~u~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~~~~u~uu~k` | `~~~~~~~~~~~~~~~~~~duk` |
| 8 | start → 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 20 → 24 → 25 → 28 → 30 → 32 → 36 → 37 → 38 → Exit | `~du~~~~~~u~~~~~~~~~k` | `~~d~~~~~~~u~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~~~~~uu~k` | `~~~~~~~~~~~~~~~~~duk` |
| 9 | start → 1 → 2 → 3 → 4 → 5 → 14 → 15 → 20 → 21 → 24 → 25 → 28 → 30 → 32 → 36 → 37 → 38 → Exit | `~du~~~~u~~~~~~~~~~k` | `~~d~d~~~uu~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~k` | `~~~~~~d~~~~~~~~uu~k` | `~~~~~~~~~~~~~~~~duk` |
| 10 | start → 1 → 2 → 3 → 4 → 5 → 14 → 15 → 20 → 21 → 22 → 24 → 25 → 28 → 30 → 32 → 36 → 37 → 38 → Exit | `~du~~~~u~~~~~~~~~~~k` | `~~d~d~~~uuu~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~k` | `~~~~~~d~~~~~~~~~uu~k` | `~~~~~~~~~~~~~~~~~duk` |
| **Tổng kết** |  | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `dto` khởi tạo tại node (1), sử dụng tại các node (2, 15, 16), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `categories` khởi tạo tại node (2, 4, 13), sử dụng tại các node (20, 21, 22, 23), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `matchedIds` khởi tạo tại node (16), sử dụng tại các node (17, 19), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `qb` khởi tạo tại node (14), sử dụng tại các node (19, 23, 27, 29, 31, 33, 36, 37), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `products` khởi tạo tại node (37), sử dụng tại các node (38), và bị Kill tại `Exit`. Không có lỗi use-before-definition. |

## Phân tích chi tiết

### Biến `dto`

- **Definition (d)**:
  - Node `1`: Tham số đầu vào `dto` (Pagination & Filter options)
- **Use (u)**:
  - Node `2`: Trích xuất `rawFiltersObj` từ DTO
  - Node `15`: Kiểm tra từ khóa tìm kiếm `dto.search`
  - Node `16`: Truy vấn OpenSearch với `dto.search`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `categories`

- **Definition (d)**:
  - Node `2`: Trích xuất categories từ filter DTO
  - Node `4`: Ép kiểu mảng categories
  - Node `13`: Trích xuất categories từ query params
- **Use (u)**:
  - Node `20`: Kiểm tra điều kiện categories
  - Node `21`: Kiểm tra mảng categories hợp lệ
  - Node `22`: Kiểm tra mảng không rỗng
  - Node `23`: Thêm mệnh đề query `whereInIds` vào `qb`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `matchedIds`

- **Definition (d)**:
  - Node `16`: Lấy danh sách ID khớp từ OpenSearch engine
- **Use (u)**:
  - Node `17`: Kiểm tra `matchedIds.length === 0`
  - Node `19`: Áp dụng lọc `qb.andWhereInIds(matchedIds)`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `qb`

- **Definition (d)**:
  - Node `14`: Khởi tạo QueryBuilder `productRepository.createQueryBuilder`
- **Use (u)**:
  - Node `19`: Lọc theo ID tìm kiếm
  - Node `23`: Lọc theo danh mục
  - Node `27`: Lọc khoảng giá min-max
  - Node `29`: Lọc giá tối thiểu
  - Node `31`: Lọc giá tối đa
  - Node `33`: Sắp xếp kết quả
  - Node `36`: Phân trang query
  - Node `37`: Thực thi query lấy danh sách sản phẩm
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `products`

- **Definition (d)**:
  - Node `37`: Kết quả danh sách sản phẩm trả về từ query builder
- **Use (u)**:
  - Node `38`: Chuẩn hóa định dạng và trả về danh sách kết quả pagination
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

## Kết luận tổng thể

> Toàn bộ 5 biến (`dto, categories, matchedIds, qb, products`) đều có **chu trình đời sống hợp lệ** trên tất cả 10 đường thi hành tuyến độc lập của chức năng `getAllProducts`.
>
> - Không phát hiện lỗi **Use-before-Definition** (sử dụng biến khi chưa khởi tạo).
>
> - Không phát hiện lỗi **Dead Definition** (khởi tạo biến nhưng không bao giờ sử dụng).
>
> - Mọi biến đều được giải phóng/kết thúc hợp lệ tại node `Exit`.

## Lưu ý về đường đi trong file `03_independent_paths.md`

Các đường đi trong file `03_independent_paths.md` liệt kê các node quyết định và node thực thi chính trên luồng nghiệp vụ. Chuỗi đời sống được tính toán chính xác dựa trên từng node xuất hiện trên đường đi và đối chiếu với các thao tác dữ liệu (`d`, `u`, `k`) được định nghĩa trong đồ thị dòng dữ liệu `05_data_flow_graph.puml`.
