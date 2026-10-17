# Báo cáo kiểm thử đời sống biến (Liveness Report) — `getAllProducts`

## Thông tin chung

- **Chức năng kiểm thử**: `getAllProducts`
- **File tham chiếu đồ thị dòng dữ liệu**: [`05_data_flow_graph.puml`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/get_all_products/05_data_flow_graph.puml)
- **File tham chiếu đường thi hành độc lập**: [`03_independent_paths.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/get_all_products/03_independent_paths.md)
- **Số biến được kiểm thử đời sống**: 5 biến (`dto`, `categories`, `matchedIds`, `qb`, `products`)
- **Số đường thi hành tuyến độc lập cơ sở**: 18 đường (khớp với độ phức tạp Cyclomatic $V(G) = 18$)

---

## Ký hiệu

| Ký hiệu | Ý nghĩa |
|:---:|---|
| `d` | **Definition** — Biến được khởi tạo / gán giá trị |
| `u` | **Use** — Biến được sử dụng (đọc giá trị) |
| `k` | **Kill** — Biến bị hủy / ra khỏi phạm vi tại node `Exit` |
| `~` | Biến không xuất hiện thao tác dữ liệu nào tại vị trí này trong đường đi |

---

## Thông tin biến trong đồ thị dòng dữ liệu (DFG)

| Biến | Thao tác Definition (d) | Thao tác Use (u) | Thao tác Kill (k) |
|---|:---:|:---:|:---:|
| `dto` | [1] | [2], [15], [16] | Exit |
| `categories` | [2], [4], [13] | [20], [21], [22], [23] | Exit |
| `matchedIds` | [16] | [17], [19] | Exit |
| `qb` | [14] | [19], [23], [27], [29], [31], [33], [34], [35], [36], [37] | Exit |
| `products` | [37] | [38] | Exit |

---

## Bảng kiểm thử đời sống biến trên 18 đường thi hành độc lập

| STT | Đường đi | dto | categories | matchedIds | qb | products |
|:---:|---|:---:|:---:|:---:|:---:|:---:|
| 1 | `start → 1 → 2 → 3 → 4 → 5 → 14 → 15 → 16 → 17 → 18 → Exit` | `~du~~~~uu~~k` | `~~d~d~~~~~~k` | `~~~~~~~~du~k` | `~~~~~~d~~~~k` | `~~~~~~~~~~~k` |
| 2 | `start → 1 → 2 → 3 → 4 → 5 → 14 → 15 → 16 → 17 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 32 → 33 → 37 → 38 → Exit` | `~du~~~~uu~~~~~~~~~~~~~~k` | `~~d~d~~~~~~uuuu~~~~~~~~k` | `~~~~~~~~duu~~~~~~~~~~~~k` | `~~~~~~d~~~u~~~u~~~u~uu~k` | `~~~~~~~~~~~~~~~~~~~~~duk` |
| 3 | `start → 1 → 2 → 3 → 4 → 6 → 14 → 15 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 28 → 29 → 32 → 34 → 37 → 38 → Exit` | `~du~~~~u~~~~~~~~~~~~k` | `~~d~d~~~uuuu~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~d~~~~u~~~~u~uu~k` | `~~~~~~~~~~~~~~~~~~duk` |
| 4 | `start → 1 → 2 → 3 → 7 → 8 → 9 → 10 → 8 → 11 → 12 → 13 → 14 → 15 → 20 → 21 → 22 → 23 → 24 → 25 → 28 → 30 → 31 → 32 → 35 → 37 → 38 → Exit` | `~du~~~~~~~~~~u~~~~~~~~~~~~k` | `~~d~~~~~~~~d~~uuuu~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~~d~~~~u~~~u~uu~k` | `~~~~~~~~~~~~~~~~~~~~~~~~duk` |
| 5 | `start → 1 → 2 → 3 → 7 → 8 → 9 → 8 → 11 → 12 → 14 → 15 → 20 → 24 → 25 → 28 → 30 → 32 → 36 → 37 → 38 → Exit` | `~du~~~~~~~~u~~~~~~~~~k` | `~~d~~~~~~~~~u~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~d~~~~~~~uu~k` | `~~~~~~~~~~~~~~~~~~~duk` |
| 6 | `start → 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 20 → 24 → 25 → 26 → 27 → 32 → 36 → 37 → 38 → Exit` | `~du~~~~~~u~~~~~~~~~~k` | `~~d~~~~~~~u~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~~~~u~uu~k` | `~~~~~~~~~~~~~~~~~~duk` |
| 7 | `start → 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 20 → 24 → 25 → 26 → 28 → 29 → 32 → 33 → 37 → 38 → Exit` | `~du~~~~~~u~~~~~~~~~~k` | `~~d~~~~~~~u~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~~~~u~uu~k` | `~~~~~~~~~~~~~~~~~~duk` |
| 8 | `start → 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 20 → 24 → 25 → 28 → 30 → 31 → 32 → 34 → 37 → 38 → Exit` | `~du~~~~~~u~~~~~~~~~~k` | `~~d~~~~~~~u~~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~~~~u~uu~k` | `~~~~~~~~~~~~~~~~~~duk` |
| 9 | `start → 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 20 → 24 → 25 → 28 → 30 → 32 → 35 → 37 → 38 → Exit` | `~du~~~~~~u~~~~~~~~~k` | `~~d~~~~~~~u~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~k` | `~~~~~~~~d~~~~~~~uu~k` | `~~~~~~~~~~~~~~~~~duk` |
| 10 | `start → 1 → 2 → 3 → 4 → 5 → 14 → 15 → 20 → 21 → 24 → 25 → 28 → 30 → 32 → 36 → 37 → 38 → Exit` | `~du~~~~u~~~~~~~~~~k` | `~~d~d~~~uu~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~k` | `~~~~~~d~~~~~~~~uu~k` | `~~~~~~~~~~~~~~~~duk` |
| 11 | `start → 1 → 2 → 3 → 4 → 5 → 14 → 15 → 20 → 21 → 22 → 24 → 25 → 28 → 30 → 32 → 36 → 37 → 38 → Exit` | `~du~~~~u~~~~~~~~~~~k` | `~~d~d~~~uuu~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~k` | `~~~~~~d~~~~~~~~~uu~k` | `~~~~~~~~~~~~~~~~~duk` |
| 12 | `start → 1 → 2 → 3 → 4 → 6 → 14 → 15 → 16 → 17 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 32 → 34 → 37 → 38 → Exit` | `~du~~~~uu~~~~~~~~~~~~~~k` | `~~d~d~~~~~~uuuu~~~~~~~~k` | `~~~~~~~~duu~~~~~~~~~~~~k` | `~~~~~~d~~~u~~~u~~~u~uu~k` | `~~~~~~~~~~~~~~~~~~~~~duk` |
| 13 | `start → 1 → 2 → 3 → 7 → 8 → 9 → 10 → 8 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 28 → 29 → 32 → 35 → 37 → 38 → Exit` | `~du~~~~~~~~~~uu~~~~~~~~~~~~k` | `~~d~~~~~~~~d~~uuuu~~~~~~~~~k` | `~~~~~~~~~~~~~~duu~~~~~~~~~~k` | `~~~~~~~~~~~~d~~~u~~~u~~~uu~k` | `~~~~~~~~~~~~~~~~~~~~~~~~~duk` |
| 14 | `start → 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 16 → 17 → 19 → 20 → 24 → 25 → 28 → 30 → 31 → 32 → 36 → 37 → 38 → Exit` | `~du~~~~~~uu~~~~~~~~~~~k` | `~~d~~~~~~~u~~~~~~~~~~~k` | `~~~~~~~~~~duu~~~~~~~~~k` | `~~~~~~~~d~~~u~~~u~~uu~k` | `~~~~~~~~~~~~~~~~~~~~duk` |
| 15 | `start → 1 → 2 → 3 → 7 → 8 → 11 → 12 → 14 → 15 → 16 → 17 → 19 → 20 → 24 → 25 → 28 → 30 → 32 → 33 → 37 → 38 → Exit` | `~du~~~~~~uu~~~~~~~~~~k` | `~~d~~~~~~~u~~~~~~~~~~k` | `~~~~~~~~~~duu~~~~~~~~k` | `~~~~~~~~d~~~u~~~u~uu~k` | `~~~~~~~~~~~~~~~~~~~duk` |
| 16 | `start → 1 → 2 → 3 → 4 → 5 → 14 → 15 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 28 → 29 → 32 → 33 → 37 → 38 → Exit` | `~du~~~~u~~~~~~~~~~~~k` | `~~d~d~~~uuuu~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~d~~~~u~~~~u~uu~k` | `~~~~~~~~~~~~~~~~~~duk` |
| 17 | `start → 1 → 2 → 3 → 4 → 6 → 14 → 15 → 20 → 21 → 22 → 23 → 24 → 25 → 28 → 30 → 31 → 32 → 35 → 37 → 38 → Exit` | `~du~~~~u~~~~~~~~~~~~k` | `~~d~d~~~uuuu~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~~k` | `~~~~~~d~~~~u~~~~u~uu~k` | `~~~~~~~~~~~~~~~~~~duk` |
| 18 | `start → 1 → 2 → 3 → 4 → 6 → 14 → 15 → 20 → 21 → 22 → 23 → 24 → 25 → 28 → 30 → 32 → 36 → 37 → 38 → Exit` | `~du~~~~u~~~~~~~~~~~k` | `~~d~d~~~uuuu~~~~~~~~k` | `~~~~~~~~~~~~~~~~~~~k` | `~~~~~~d~~~~u~~~~~uu~k` | `~~~~~~~~~~~~~~~~~duk` |
| **Tổng kết** | | **Hợp lệ** ✅ — Khởi tạo tại [1], sử dụng tại [2, 15, 16], giải phóng tại `Exit`. | **Hợp lệ** ✅ — Khởi tạo tại [2, 4, 13], sử dụng tại [20, 21, 22, 23], giải phóng tại `Exit`. | **Hợp lệ** ✅ — Khởi tạo tại [16], sử dụng tại [17, 19], giải phóng tại `Exit`. | **Hợp lệ** ✅ — Khởi tạo tại [14], sử dụng trong query, giải phóng tại `Exit`. | **Hợp lệ** ✅ — Khởi tạo tại [37], sử dụng tại [38], giải phóng tại `Exit`. |

---

## Phân tích chi tiết từng biến

### 1. Biến `dto`
- **Definition (d)**: Node `[1]` (Tham số đầu vào `dto: GetAllProductDto`).
- **Use (u)**:
  - Node `[2]`: Trích xuất các trường `filters[sortBy]`, `filters[minPrice]`, `filters[maxPrice]`.
  - Node `[15]`: Kiểm tra từ khóa tìm kiếm `dto.search`.
  - Node `[16]`: Truy vấn OpenSearch với `dto.search`.
- **Kill (k)**: Tại node `Exit` khi hàm trả về kết quả.
- **Kết luận**: **Hợp lệ** ✅ — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### 2. Biến `categories`
- **Definition (d)**:
  - Node `[2]`: Khai báo biến `let categories: string[] | undefined;`.
  - Node `[4]`: Gán mảng từ `rawCats` (tại [5] hoặc [6]).
  - Node `[13]`: Gán mảng trích xuất từ regex `categories = catValues;`.
- **Use (u)**:
  - Node `[20]`: Kiểm tra biến truthy `if (categories && ...)`.
  - Node `[21]`: Kiểm tra kiểu mảng `Array.isArray(categories)`.
  - Node `[22]`: Kiểm tra độ dài `categories.length > 0`.
  - Node `[23]`: Thêm điều kiện `qb.andWhere('category.id IN (:...categories)')`.
- **Kill (k)**: Tại node `Exit`.
- **Kết luận**: **Hợp lệ** ✅ — Biến luôn được khởi tạo trước khi kiểm tra và sử dụng trong QueryBuilder.

### 3. Biến `matchedIds`
- **Definition (d)**: Node `[16]` (`const matchedIds = await this.opensearchService.searchProductIds(...)`).
- **Use (u)**:
  - Node `[17]`: Kiểm tra mảng rỗng `if (matchedIds.length === 0)`.
  - Node `[19]`: Thêm điều kiện `qb.andWhere('product.id IN (:...matchedIds)')`.
- **Kill (k)**: Tại node `Exit`.
- **Kết luận**: **Hợp lệ** ✅ — Biến chỉ tồn tại trong nhánh tìm kiếm và được giải phóng hợp lệ.

### 4. Biến `qb`
- **Definition (d)**: Node `[14]` (`const qb = this.productsRepository.createQueryBuilder('product')...`).
- **Use (u)**:
  - Node `[19]`: Lọc theo ID từ OpenSearch.
  - Node `[23]`: Lọc theo danh mục sản phẩm.
  - Node `[27]`: Lọc khoảng giá `BETWEEN`.
  - Node `[29]`: Lọc giá tối thiểu `>= minPrice`.
  - Node `[31]`: Lọc giá tối đa `<= maxPrice`.
  - Node `[33]`, `[34]`, `[35]`, `[36]`: Áp dụng tiêu chí sắp xếp `orderBy`.
  - Node `[37]`: Phân trang `skip/take` và thực thi truy vấn `getManyAndCount()`.
- **Kill (k)**: Tại node `Exit`.
- **Kết luận**: **Hợp lệ** ✅ — QueryBuilder được khởi tạo và sử dụng xuyên suốt để xây dựng câu truy vấn SQL.

### 5. Biến `products`
- **Definition (d)**: Node `[37]` (`const [products, totalItems] = await qb.getManyAndCount();`).
- **Use (u)**: Node `[38]` (`products.map(...)` để định dạng dữ liệu trả về cho client).
- **Kill (k)**: Tại node `Exit`.
- **Kết luận**: **Hợp lệ** ✅ — Mảng kết quả truy vấn được map và đóng gói thành công vào `ApiResponse`.

---

## Kết luận tổng thể

> Cả 5 biến (`dto`, `categories`, `matchedIds`, `qb`, `products`) đều có chu trình đời sống **hợp lệ 100%** trên toàn bộ 18 đường thi hành độc lập của hàm `getAllProducts`.
> 
> Toàn bộ 3 tài liệu:
> - [`03_independent_paths.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/get_all_products/03_independent_paths.md) (18 đường thi hành độc lập cơ sở)
> - [`04_branch_test_cases.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/get_all_products/04_branch_test_cases.md) (18 test case bao phủ toàn bộ 32 nhánh rẽ)
> - [`06_liveness_report.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/get_all_products/06_liveness_report.md) (18 chuỗi đời sống biến)
> 
> Đã được **đồng bộ hoàn toàn về con số 18 Test Cases**, khắc phục triệt để tình trạng lệch giữa tính toán $V(G) = 18$ và chỉ liệt kê 10 đường trước đó.
