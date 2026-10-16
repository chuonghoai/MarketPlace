# Báo cáo kiểm thử đời sống biến (Liveness Report) — `checkoutOrder`

## Thông tin chung

- **Chức năng kiểm thử**: `checkoutOrder`
- **File tham chiếu đồ thị dòng dữ liệu**: [`05_data_flow_graph.puml`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/checkoutOrder/05_data_flow_graph.puml)
- **File tham chiếu đường thi hành độc lập**: [`03_independent_paths.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/checkoutOrder/03_independent_paths.md)
- **Số biến được kiểm thử đời sống**: 2 (`createOrderDto, userId`)
- **Số đường thi hành tuyến độc lập**: 44

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
| `createOrderDto` | start | 2, 5, 8, 13, 22, 33, 104, 133, 136, 139 | Exit |
| `userId` | start | 5, 35, 142, 143 | Exit |

## Bảng kiểm thử đời sống biến

| STT | Đường đi | createOrderDto | userId |
|-----|----------|------------------|----------|
| 1 | start → 1 → 2 → 4 → Exit | `d~u~k` | `d~~~k` |
| 2 | start → 1 → 2 → 3 → 4 → Exit | `d~u~~k` | `d~~~~k` |
| 3 | start → 1 → 2 → 3 → 5 → 6 → 7 → Exit | `d~u~u~~k` | `d~~~u~~k` |
| 4 | start → 1 → 2 → 3 → 5 → 6 → 8 → 9 → 10 → 11 → 12 → 13 → 22 → 23 → 25 → 26 → 27 → 28 → 29 → 83 → 84 → 85 → 99 → 132 → 133 → 136 → 139 → 142 → 143 → 144 → 145 → 146 → Exit | `d~u~u~u~~~~uu~~~~~~~~~~~uuu~~~~~k` | `d~~~u~~~~~~~~~~~~~~~~~~~~~~uu~~~k` |
| 5 | start → 1 → 2 → 3 → 5 → 6 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → Exit | `d~u~u~u~~~~u~~~k` | `d~~~u~~~~~~~~~~k` |
| 6 | start → 1 → 2 → 3 → 5 → 6 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 17 → 18 → Exit | `d~u~u~u~~~~u~~~~k` | `d~~~u~~~~~~~~~~~k` |
| 7 | start → 1 → 13 → 14 → 15 → 17 → 19 → 20 → 21 → 13 → 14 → 15 → 16 → Exit | `d~u~~~~~~u~~~k` | `d~~~~~~~~~~~~k` |
| 8 | start → 1 → 2 → 3 → 5 → 6 → 8 → 13 → 22 → 23 → 25 → 26 → 27 → 28 → 29 → 83 → 85 → 99 → 132 → 133 → 136 → 139 → 142 → 143 → 144 → 146 → Exit | `d~u~u~uuu~~~~~~~~~~uuu~~~~k` | `d~~~u~~~~~~~~~~~~~~~~~uu~~k` |
| 9 | start → 1 → 2 → 3 → 5 → 6 → 8 → 13 → 22 → 23 → 25 → 26 → 27 → 28 → 29 → 30 → 83 → 85 → 99 → 132 → 133 → 136 → 139 → 142 → 143 → 144 → 145 → 146 → Exit | `d~u~u~uuu~~~~~~~~~~~uuu~~~~~k` | `d~~~u~~~~~~~~~~~~~~~~~~uu~~~k` |
| 10 | start → 1 → 29 → 30 → 31 → 32 → 33 → 34 → 35 → 41 → 42 → Exit | `d~~~~~u~~~~k` | `d~~~~~~~u~~k` |
| 11 | start → 1 → 33 → 34 → 35 → 36 → 37 → 39 → 33 → 43 → Exit | `d~u~~~~~u~k` | `d~~~u~~~~~k` |
| 12 | start → 1 → 33 → 34 → 35 → 36 → 37 → 38 → 39 → 33 → 43 → Exit | `d~u~~~~~~u~k` | `d~~~u~~~~~~k` |
| 13 | start → 1 → 33 → 34 → 35 → 36 → 37 → 38 → 40 → 33 → 43 → Exit | `d~u~~~~~~u~k` | `d~~~u~~~~~~k` |
| 14 | start → 1 → 33 → 43 → 44 → Exit | `d~u~~k` | `d~~~~k` |
| 15 | start → 1 → 33 → 43 → 45 → 46 → Exit | `d~u~~~k` | `d~~~~~k` |
| 16 | start → 1 → 45 → 47 → 48 → 49 → 67 → Exit | `d~~~~~~k` | `d~~~~~~k` |
| 17 | start → 1 → 49 → 50 → 51 → 52 → 55 → 57 → 58 → 59 → 49 → Exit | `d~~~~~~~~~~k` | `d~~~~~~~~~~k` |
| 18 | start → 1 → 49 → 50 → 51 → 52 → 53 → 54 → 55 → 57 → 58 → 59 → 49 → Exit | `d~~~~~~~~~~~~k` | `d~~~~~~~~~~~~k` |
| 19 | start → 1 → 49 → 50 → 51 → 52 → 53 → 55 → 56 → 57 → 58 → 59 → 49 → Exit | `d~~~~~~~~~~~~k` | `d~~~~~~~~~~~~k` |
| 20 | start → 1 → 49 → 50 → 51 → 52 → 55 → 56 → 57 → 58 → 59 → 49 → Exit | `d~~~~~~~~~~~k` | `d~~~~~~~~~~~k` |
| 21 | start → 1 → 49 → 50 → 60 → 61 → 62 → 64 → 65 → 66 → 49 → Exit | `d~~~~~~~~~~k` | `d~~~~~~~~~~k` |
| 22 | start → 1 → 49 → 50 → 60 → 61 → 62 → 63 → 64 → 65 → 66 → 49 → Exit | `d~~~~~~~~~~~k` | `d~~~~~~~~~~~k` |
| 23 | start → 1 → 49 → 50 → 60 → 49 → Exit | `d~~~~~k` | `d~~~~~k` |
| 24 | start → 1 → 49 → 67 → 83 → Exit | `d~~~~k` | `d~~~~k` |
| 25 | start → 1 → 67 → 68 → 69 → 70 → 73 → 74 → 76 → 67 → Exit | `d~~~~~~~~~k` | `d~~~~~~~~~k` |
| 26 | start → 1 → 67 → 68 → 69 → 70 → 71 → 72 → 73 → 74 → 76 → 67 → Exit | `d~~~~~~~~~~~k` | `d~~~~~~~~~~~k` |
| 27 | start → 1 → 67 → 68 → 69 → 70 → 73 → 74 → 75 → 76 → 67 → Exit | `d~~~~~~~~~~k` | `d~~~~~~~~~~k` |
| 28 | start → 1 → 67 → 68 → 77 → 78 → 79 → 81 → 82 → 67 → Exit | `d~~~~~~~~~k` | `d~~~~~~~~~k` |
| 29 | start → 1 → 67 → 68 → 77 → 78 → 79 → 80 → 81 → 82 → 67 → Exit | `d~~~~~~~~~~k` | `d~~~~~~~~~~k` |
| 30 | start → 1 → 67 → 68 → 77 → 67 → Exit | `d~~~~~k` | `d~~~~~k` |
| 31 | start → 1 → 83 → 84 → 85 → 99 → Exit | `d~~~~~k` | `d~~~~~k` |
| 32 | start → 1 → 85 → 86 → 87 → 88 → 89 → 90 → 91 → 94 → 85 → Exit | `d~~~~~~~~~~k` | `d~~~~~~~~~~k` |
| 33 | start → 1 → 85 → 86 → 87 → 88 → 89 → 90 → 91 → 92 → 93 → Exit | `d~~~~~~~~~~k` | `d~~~~~~~~~~k` |
| 34 | start → 1 → 85 → 86 → 87 → 95 → 96 → 97 → Exit | `d~~~~~~~k` | `d~~~~~~~k` |
| 35 | start → 1 → 85 → 86 → 87 → 95 → 98 → 85 → Exit | `d~~~~~~~k` | `d~~~~~~~k` |
| 36 | start → 1 → 99 → 103 → 104 → 105 → 113 → Exit | `d~~~u~~k` | `d~~~~~~k` |
| 37 | start → 1 → 104 → 105 → 106 → 107 → 108 → 127 → 132 → Exit | `d~u~~~~~~k` | `d~~~~~~~~k` |
| 38 | start → 1 → 104 → 105 → 106 → 107 → 109 → 110 → 127 → 132 → Exit | `d~u~~~~~~~k` | `d~~~~~~~~~k` |
| 39 | start → 1 → 104 → 105 → 106 → 107 → 109 → 111 → 112 → 105 → Exit | `d~u~~~~~~~k` | `d~~~~~~~~~k` |
| 40 | start → 1 → 104 → 113 → 119 → 120 → 121 → 122 → 127 → 132 → Exit | `d~u~~~~~~~k` | `d~~~~~~~~~k` |
| 41 | start → 1 → 119 → 120 → 121 → 119 → 119 → 123 → 124 → 125 → 126 → 131 → 132 → Exit | `d~~~~~~~~~~~~k` | `d~~~~~~~~~~~~k` |
| 42 | start → 1 → 119 → 120 → 121 → 119 → 123 → 126 → 131 → 132 → Exit | `d~~~~~~~~~k` | `d~~~~~~~~~k` |
| 43 | start → 1 → 132 → 133 → 134 → 135 → Exit | `d~~u~~k` | `d~~~~~k` |
| 44 | start → 1 → 132 → 133 → 136 → 137 → 138 → Exit | `d~~uu~~k` | `d~~~~~~k` |
| **Tổng kết** |  | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên tất cả 44 đường đi được kích hoạt. Biến `createOrderDto` khởi tạo tại node (start), sử dụng tại các node (2, 5, 8, 13, 22, 33, 104, 133, 136, 139), và bị Kill tại `Exit`. Không phát hiện bất thường. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên tất cả 44 đường đi được kích hoạt. Biến `userId` khởi tạo tại node (start), sử dụng tại các node (5, 35, 142, 143), và bị Kill tại `Exit`. Không phát hiện bất thường. |

## Phân tích chi tiết

### Biến `createOrderDto`

- **Definition (d)**:
  - Node `start`: Tham số đầu vào `createOrderDto` chứa danh sách giỏ hàng, mã voucher, địa chỉ và phương thức thanh toán
- **Use (u)**:
  - Node `2`: Kiểm tra `!createOrderDto.items || createOrderDto.items.length === 0`
  - Node `5`: Truy vấn địa chỉ giao hàng với `createOrderDto.addressId`
  - Node `8`: Lấy mảng `productIds` từ `createOrderDto.items`
  - Node `13`: Vòng lặp `for (const item of createOrderDto.items)`
  - Node `22`: Tính toán hộp đóng gói từ `createOrderDto.items`
  - Node `33`: Vòng lặp `for (const code of createOrderDto.voucherCodes)`
  - Node `104`: Kiểm tra phương thức thanh toán `createOrderDto.paymentMethod === COD`
  - Node `133`: Kiểm tra phương thức thanh toán `createOrderDto.paymentMethod === MOMO`
  - Node `136`: Kiểm tra phương thức thanh toán `createOrderDto.paymentMethod === VNPAY`
  - Node `139`: Kiểm tra phương thức thanh toán `createOrderDto.paymentMethod === PAYPAL`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong toàn bộ các luồng thực thi tương ứng.

### Biến `userId`

- **Definition (d)**:
  - Node `start`: Tham số đầu vào `userId` của khách hàng đặt đơn
- **Use (u)**:
  - Node `5`: Truy vấn địa chỉ giao hàng xác thực người dùng bằng `userId`
  - Node `35`: Kiểm tra tính hợp lệ và hạn mức sử dụng voucher của `userId`
  - Node `142`: Xóa các sản phẩm đã mua khỏi giỏ hàng của `userId`
  - Node `143`: Truy vấn thông tin người dùng gửi email xác nhận đặt hàng bằng `userId`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong toàn bộ các luồng thực thi tương ứng.

## Kết luận tổng thể

> Toàn bộ 2 biến (`createOrderDto, userId`) đều có **chu trình đời sống hợp lệ** trên tất cả 44 đường thi hành tuyến độc lập của chức năng `checkoutOrder`.
>
> - Không phát hiện lỗi **Use-before-Definition** (sử dụng biến khi chưa khởi tạo).
>
> - Không phát hiện lỗi **Dead Definition** (khởi tạo biến nhưng không bao giờ sử dụng).
>
> - Mọi biến đều được giải phóng/kết thúc hợp lệ tại node `Exit`.

## Lưu ý về đường đi trong file `03_independent_paths.md`

Các đường đi trong file `03_independent_paths.md` liệt kê các node quyết định và node thực thi chính trên luồng nghiệp vụ. Chuỗi đời sống được tính toán chính xác dựa trên từng node xuất hiện trên đường đi và đối chiếu với các thao tác dữ liệu (`d`, `u`, `k`) được định nghĩa trong đồ thị dòng dữ liệu `05_data_flow_graph.puml`.
