# Báo cáo kiểm thử đời sống biến (Liveness Report) — `updateQuantity`

## Thông tin chung

- **Chức năng kiểm thử**: `updateQuantity`
- **File tham chiếu đồ thị dòng dữ liệu**: [`05_data_flow_graph.puml`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/update_product_quantity/05_data_flow_graph.puml)
- **File tham chiếu đường thi hành độc lập**: [`03_independent_paths.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/update_product_quantity/03_independent_paths.md)
- **Số biến được kiểm thử đời sống**: 4 (`userId, productId, quantity, item`)
- **Số đường thi hành tuyến độc lập**: 3

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
| `userId` | 1 | 2, 9 | Exit |
| `productId` | 1 | 2 | Exit |
| `quantity` | 1 | 5, 7 | Exit |
| `item` | 2 | 3, 6, 7, 8 | Exit |

## Bảng kiểm thử đời sống biến

| STT | Đường đi | userId | productId | quantity | item |
|-----|----------|----------|-------------|------------|--------|
| 1 | start → 1 → 2 → 3 → 4 → Exit | `~du~~k` | `~du~~k` | `~d~~~k` | `~~du~k` |
| 2 | start → 1 → 2 → 3 → 5 → 6 → 9 → Exit | `~du~~~uk` | `~du~~~~k` | `~d~~u~~k` | `~~du~u~k` |
| 3 | start → 1 → 2 → 3 → 5 → 7 → 8 → 9 → Exit | `~du~~~~uk` | `~du~~~~~k` | `~d~~uu~~k` | `~~du~uu~k` |
| **Tổng kết** |  | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `userId` khởi tạo tại node (1), sử dụng tại các node (2, 9), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `productId` khởi tạo tại node (1), sử dụng tại các node (2), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `quantity` khởi tạo tại node (1), sử dụng tại các node (5, 7), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `item` khởi tạo tại node (2), sử dụng tại các node (3, 6, 7, 8), và bị Kill tại `Exit`. Không có lỗi use-before-definition. |

## Phân tích chi tiết

### Biến `userId`

- **Definition (d)**:
  - Node `1`: Tham số đầu vào `userId` của khách hàng
- **Use (u)**:
  - Node `2`: Truy vấn giỏ hàng của `userId`
  - Node `9`: Trả về giỏ hàng cập nhật cho `userId`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `productId`

- **Definition (d)**:
  - Node `1`: Tham số đầu vào mã sản phẩm `productId`
- **Use (u)**:
  - Node `2`: Tìm sản phẩm trong giỏ hàng theo `productId`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `quantity`

- **Definition (d)**:
  - Node `1`: Tham số đầu vào số lượng cập nhật `quantity`
- **Use (u)**:
  - Node `5`: Kiểm tra số lượng `quantity <= 0`
  - Node `7`: Gán số lượng mới `item.quantity = quantity`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `item`

- **Definition (d)**:
  - Node `2`: Tìm item trong giỏ hàng `cart.items.find(...)`
- **Use (u)**:
  - Node `3`: Kiểm tra sản phẩm có trong giỏ `!item`
  - Node `6`: Xóa `item` khỏi giỏ hàng nếu `quantity <= 0`
  - Node `7`: Cập nhật `item.quantity` nếu `quantity > 0`
  - Node `8`: Lưu giỏ hàng sau khi sửa item
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

## Kết luận tổng thể

> Toàn bộ 4 biến (`userId, productId, quantity, item`) đều có **chu trình đời sống hợp lệ** trên tất cả 3 đường thi hành tuyến độc lập của chức năng `updateQuantity`.
>
> - Không phát hiện lỗi **Use-before-Definition** (sử dụng biến khi chưa khởi tạo).
>
> - Không phát hiện lỗi **Dead Definition** (khởi tạo biến nhưng không bao giờ sử dụng).
>
> - Mọi biến đều được giải phóng/kết thúc hợp lệ tại node `Exit`.

## Lưu ý về đường đi trong file `03_independent_paths.md`

Các đường đi trong file `03_independent_paths.md` liệt kê các node quyết định và node thực thi chính trên luồng nghiệp vụ. Chuỗi đời sống được tính toán chính xác dựa trên từng node xuất hiện trên đường đi và đối chiếu với các thao tác dữ liệu (`d`, `u`, `k`) được định nghĩa trong đồ thị dòng dữ liệu `05_data_flow_graph.puml`.
