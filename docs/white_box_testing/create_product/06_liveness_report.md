# Báo cáo kiểm thử đời sống biến (Liveness Report) — `createProduct`

## Thông tin chung

- **Chức năng kiểm thử**: `createProduct`
- **File tham chiếu đồ thị dòng dữ liệu**: [`05_data_flow_graph.puml`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/create_product/05_data_flow_graph.puml)
- **File tham chiếu đường thi hành độc lập**: [`03_independent_paths.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/create_product/03_independent_paths.md)
- **Số biến được kiểm thử đời sống**: 5 (`createProductDto, category, mediaPublicIds, productData, productSaved`)
- **Số đường thi hành tuyến độc lập**: 5

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
| `createProductDto` | 1 | 2, 5 | Exit |
| `category` | 2 | 3, 6 | Exit |
| `mediaPublicIds` | 5 | 8, 9, 10 | Exit |
| `productData` | 5 | 6 | Exit |
| `productSaved` | 7 | 12, 13, 14 | Exit |

## Bảng kiểm thử đời sống biến

| STT | Đường đi | createProductDto | category | mediaPublicIds | productData | productSaved |
|-----|----------|--------------------|------------|------------------|---------------|----------------|
| 1 | 1 → 2 → 3 → 4 → Exit | `du~~k` | `~du~k` | `~~~~k` | `~~~~k` | `~~~~k` |
| 2 | 1 → 2 → 3 → 5 → 6 → 7 → 8 → 13 → 14 → Exit | `du~u~~~~~k` | `~du~u~~~~k` | `~~~d~~u~~k` | `~~~du~~~~k` | `~~~~~d~uuk` |
| 3 | 1 → 2 → 3 → 5 → 6 → 7 → 8 → 9 → 13 → 14 → Exit | `du~u~~~~~~k` | `~du~u~~~~~k` | `~~~d~~uu~~k` | `~~~du~~~~~k` | `~~~~~d~~uuk` |
| 4 | 1 → 2 → 3 → 5 → 6 → 7 → 8 → 9 → 10 → 13 → 14 → Exit | `du~u~~~~~~~k` | `~du~u~~~~~~k` | `~~~d~~uuu~~k` | `~~~du~~~~~~k` | `~~~~~d~~~uuk` |
| 5 | 1 → 2 → 3 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → Exit | `du~u~~~~~~~~~k` | `~du~u~~~~~~~~k` | `~~~d~~uuu~~~~k` | `~~~du~~~~~~~~k` | `~~~~~d~~~~uuuk` |
| **Tổng kết** |  | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `createProductDto` khởi tạo tại node (1), sử dụng tại các node (2, 5), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `category` khởi tạo tại node (2), sử dụng tại các node (3, 6), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `mediaPublicIds` khởi tạo tại node (5), sử dụng tại các node (8, 9, 10), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `productData` khởi tạo tại node (5), sử dụng tại các node (6), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `productSaved` khởi tạo tại node (7), sử dụng tại các node (12, 13, 14), và bị Kill tại `Exit`. Không có lỗi use-before-definition. |

## Phân tích chi tiết

### Biến `createProductDto`

- **Definition (d)**:
  - Node `1`: Tham số đầu vào hàm `createProduct`
- **Use (u)**:
  - Node `2`: Kiểm tra `createProductDto.categoryId`
  - Node `5`: Khởi tạo `productData` từ DTO và lấy `createProductDto.mediaPublicIds`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `category`

- **Definition (d)**:
  - Node `2`: Truy vấn `categoryRepository.findOne` theo `categoryId`
- **Use (u)**:
  - Node `3`: Kiểm tra `!category` (ném ngoại lệ nếu không tìm thấy)
  - Node `6`: Gán quan hệ category vào `productData.category`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `mediaPublicIds`

- **Definition (d)**:
  - Node `5`: Lấy mảng `mediaPublicIds` từ `createProductDto`
- **Use (u)**:
  - Node `8`: Kiểm tra `mediaPublicIds` tồn tại
  - Node `9`: Kiểm tra `mediaPublicIds.length > 0`
  - Node `10`: Gọi `mediaService.confirmUpload(mediaPublicIds)`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `productData`

- **Definition (d)**:
  - Node `5`: Khởi tạo đối tượng `productData` từ DTO
- **Use (u)**:
  - Node `6`: Cập nhật đối tượng `productData` trước khi lưu vào DB
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `productSaved`

- **Definition (d)**:
  - Node `7`: Lưu sản phẩm vào DB qua `productRepository.save`
- **Use (u)**:
  - Node `12`: Kiểm tra kết quả `productSaved`
  - Node `13`: Đồng bộ sản phẩm vào OpenSearch search engine
  - Node `14`: Trả về `productSaved` cho client
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

## Kết luận tổng thể

> Toàn bộ 5 biến (`createProductDto, category, mediaPublicIds, productData, productSaved`) đều có **chu trình đời sống hợp lệ** trên tất cả 5 đường thi hành tuyến độc lập của chức năng `createProduct`.
>
> - Không phát hiện lỗi **Use-before-Definition** (sử dụng biến khi chưa khởi tạo).
>
> - Không phát hiện lỗi **Dead Definition** (khởi tạo biến nhưng không bao giờ sử dụng).
>
> - Mọi biến đều được giải phóng/kết thúc hợp lệ tại node `Exit`.

## Lưu ý về đường đi trong file `03_independent_paths.md`

Các đường đi trong file `03_independent_paths.md` liệt kê các node quyết định và node thực thi chính trên luồng nghiệp vụ. Chuỗi đời sống được tính toán chính xác dựa trên từng node xuất hiện trên đường đi và đối chiếu với các thao tác dữ liệu (`d`, `u`, `k`) được định nghĩa trong đồ thị dòng dữ liệu `05_data_flow_graph.puml`.
