# Báo cáo kiểm thử đời sống biến (Liveness Report) — `topup`

## Thông tin chung

- **Chức năng kiểm thử**: `topup`
- **File tham chiếu đồ thị dòng dữ liệu**: [`05_data_flow_graph.puml`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/topup_wallet/05_data_flow_graph.puml)
- **File tham chiếu đường thi hành độc lập**: [`03_independent_paths.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/topup_wallet/03_independent_paths.md)
- **Số biến được kiểm thử đời sống**: 5 (`userId, amount, paymentMethod, wallet, tx`)
- **Số đường thi hành tuyến độc lập**: 9

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
| `userId` | 1 | 6, 10, 14, 20, 21 | Exit |
| `amount` | 1 | 2, 3, 7, 8, 11, 12, 15, 16, 27, 30 | Exit |
| `paymentMethod` | 1 | 5, 9, 13 | Exit |
| `wallet` | 21, 28 | 22, 24, 26, 28, 29, 30 | Exit |
| `tx` | 30 | 31, 33 | Exit |

## Bảng kiểm thử đời sống biến

| STT | Đường đi | userId | amount | paymentMethod | wallet | tx |
|-----|----------|----------|----------|-----------------|----------|------|
| 1 | start → 1 → 2 → 4 → Exit | `~d~~k` | `~du~k` | `~d~~k` | `~~~~k` | `~~~~k` |
| 2 | start → 1 → 2 → 3 → 4 → Exit | `~d~~~k` | `~duu~k` | `~d~~~k` | `~~~~~k` | `~~~~~k` |
| 3 | start → 1 → 2 → 3 → 5 → 6 → 7 → 8 → Exit | `~d~~~u~~k` | `~duu~~uuk` | `~d~~u~~~k` | `~~~~~~~~k` | `~~~~~~~~k` |
| 4 | start → 1 → 2 → 3 → 5 → 9 → 10 → 11 → 12 → Exit | `~d~~~~u~~k` | `~duu~~~uuk` | `~d~~uu~~~k` | `~~~~~~~~~k` | `~~~~~~~~~k` |
| 5 | start → 1 → 2 → 3 → 5 → 9 → 13 → 14 → 15 → 16 → Exit | `~d~~~~~u~~k` | `~duu~~~~uuk` | `~d~~uuu~~~k` | `~~~~~~~~~~k` | `~~~~~~~~~~k` |
| 6 | start → 1 → 2 → 3 → 5 → 9 → 13 → 17 → 18 → 19 → 20 → 21 → 34 → 35 → 36 → 37 → Exit | `~d~~~~~~~~uu~~~~k` | `~duu~~~~~~~~~~~~k` | `~d~~uuu~~~~~~~~~k` | `~~~~~~~~~~~d~~~~k` | `~~~~~~~~~~~~~~~~k` |
| 7 | start → 1 → 2 → 3 → 5 → 9 → 13 → 17 → 18 → 19 → 20 → 21 → 22 → 23 → 34 → 35 → 36 → 37 → Exit | `~d~~~~~~~~uu~~~~~~k` | `~duu~~~~~~~~~~~~~~k` | `~d~~uuu~~~~~~~~~~~k` | `~~~~~~~~~~~du~~~~~k` | `~~~~~~~~~~~~~~~~~~k` |
| 8 | start → 1 → 2 → 3 → 5 → 9 → 13 → 17 → 18 → 19 → 20 → 21 → 22 → 24 → 25 → 34 → 35 → 36 → 37 → Exit | `~d~~~~~~~~uu~~~~~~~k` | `~duu~~~~~~~~~~~~~~~k` | `~d~~uuu~~~~~~~~~~~~k` | `~~~~~~~~~~~duu~~~~~k` | `~~~~~~~~~~~~~~~~~~~k` |
| 9 | start → 1 → 2 → 3 → 5 → 9 → 13 → 17 → 18 → 19 → 20 → 21 → 22 → 24 → 26 → 27 → 28 → 29 → 30 → 31 → 32 → 33 → 37 → Exit | `~d~~~~~~~~uu~~~~~~~~~~~k` | `~duu~~~~~~~~~~~u~~u~~~~k` | `~d~~uuu~~~~~~~~~~~~~~~~k` | `~~~~~~~~~~~duuu~duu~~~~k` | `~~~~~~~~~~~~~~~~~~du~u~k` |
| **Tổng kết** |  | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `userId` khởi tạo tại node (1), sử dụng tại các node (6, 10, 14, 20, 21), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `amount` khởi tạo tại node (1), sử dụng tại các node (2, 3, 7, 8, 11, 12, 15, 16, 27, 30), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `paymentMethod` khởi tạo tại node (1), sử dụng tại các node (5, 9, 13), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `wallet` khởi tạo tại node (21, 28), sử dụng tại các node (22, 24, 26, 28, 29, 30), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `tx` khởi tạo tại node (30), sử dụng tại các node (31, 33), và bị Kill tại `Exit`. Không có lỗi use-before-definition. |

## Phân tích chi tiết

### Biến `userId`

- **Definition (d)**:
  - Node `1`: Tham số đầu vào `userId` của chủ ví
- **Use (u)**:
  - Node `6`: Tạo URL thanh toán VNPAY gắn với `userId`
  - Node `10`: Tạo URL thanh toán MOMO gắn với `userId`
  - Node `14`: Tạo URL thanh toán PAYPAL gắn với `userId`
  - Node `20`: Bắt đầu transaction nạp tiền ví
  - Node `21`: Truy vấn ví của người dùng theo `userId`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `amount`

- **Definition (d)**:
  - Node `1`: Tham số đầu vào số tiền nạp `amount`
- **Use (u)**:
  - Node `2`: Kiểm tra `!amount`
  - Node `3`: Kiểm tra số tiền tối thiểu `amount < 10000`
  - Node `7`: Tính toán số tiền trong cổng VNPAY
  - Node `8`: Tạo yêu cầu VNPAY
  - Node `11`: Tính toán số tiền MOMO
  - Node `12`: Tạo yêu cầu MOMO
  - Node `15`: Tính toán số tiền PAYPAL
  - Node `16`: Tạo yêu cầu PAYPAL
  - Node `27`: Cộng dồn số dư ví `wallet.balance += amount`
  - Node `30`: Ghi nhận số tiền nạp vào giao dịch `tx`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `paymentMethod`

- **Definition (d)**:
  - Node `1`: Tham số đầu vào phương thức thanh toán `paymentMethod`
- **Use (u)**:
  - Node `5`: Kiểm tra `paymentMethod === VNPAY`
  - Node `9`: Kiểm tra `paymentMethod === MOMO`
  - Node `13`: Kiểm tra `paymentMethod === PAYPAL`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `wallet`

- **Definition (d)**:
  - Node `21`: Truy vấn thông tin ví từ DB
  - Node `28`: Cập nhật số dư mới vào entity ví
- **Use (u)**:
  - Node `22`: Kiểm tra `!wallet` tồn tại
  - Node `24`: Kiểm tra trạng thái ví `LOCKED`
  - Node `26`: Đọc số dư hiện tại của ví
  - Node `28`: Lưu thay đổi ví vào database
  - Node `29`: Lấy ID ví
  - Node `30`: Gắn liên kết ví vào giao dịch
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `tx`

- **Definition (d)**:
  - Node `30`: Khởi tạo entity giao dịch `Transaction` mới
- **Use (u)**:
  - Node `31`: Lưu giao dịch nạp tiền vào DB
  - Node `33`: Trả về đối tượng giao dịch `tx` hoàn tất
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

## Kết luận tổng thể

> Toàn bộ 5 biến (`userId, amount, paymentMethod, wallet, tx`) đều có **chu trình đời sống hợp lệ** trên tất cả 9 đường thi hành tuyến độc lập của chức năng `topup`.
>
> - Không phát hiện lỗi **Use-before-Definition** (sử dụng biến khi chưa khởi tạo).
>
> - Không phát hiện lỗi **Dead Definition** (khởi tạo biến nhưng không bao giờ sử dụng).
>
> - Mọi biến đều được giải phóng/kết thúc hợp lệ tại node `Exit`.

## Lưu ý về đường đi trong file `03_independent_paths.md`

Các đường đi trong file `03_independent_paths.md` liệt kê các node quyết định và node thực thi chính trên luồng nghiệp vụ. Chuỗi đời sống được tính toán chính xác dựa trên từng node xuất hiện trên đường đi và đối chiếu với các thao tác dữ liệu (`d`, `u`, `k`) được định nghĩa trong đồ thị dòng dữ liệu `05_data_flow_graph.puml`.
