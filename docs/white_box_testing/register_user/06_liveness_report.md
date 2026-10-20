# Báo cáo kiểm thử đời sống biến (Liveness Report) — `register`

## Thông tin chung

- **Chức năng kiểm thử**: `register`
- **File tham chiếu đồ thị dòng dữ liệu**: [`05_data_flow_graph.puml`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/register_user/05_data_flow_graph.puml)
- **File tham chiếu đường thi hành độc lập**: [`03_independent_paths.md`](file:///d:/study/ute/4 - HK1/KiemThuPhanMem/FinalProject/MarketPlace/docs/white_box_testing/register_user/03_independent_paths.md)
- **Số biến được kiểm thử đời sống**: 5 (`email, password, otp, record, accessToken`)
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
| `email` | 1 | 4, 8, 14, 15, 19, 23 | Exit |
| `password` | 1 | 2, 18 | Exit |
| `otp` | 1 | 10 | Exit |
| `record` | 4 | 5, 7, 10, 12 | Exit |
| `accessToken` | 22 | 23 | Exit |

## Bảng kiểm thử đời sống biến

| STT | Đường đi | email | password | otp | record | accessToken |
|-----|----------|---------|------------|-------|----------|---------------|
| 1 | start → 1 → 2 → 3 → Exit | `~d~~k` | `~du~k` | `~d~~k` | `~~~~k` | `~~~~k` |
| 2 | start → 1 → 2 → 4 → 5 → 6 → Exit | `~d~u~~k` | `~du~~~k` | `~d~~~~k` | `~~~du~k` | `~~~~~~k` |
| 3 | start → 1 → 2 → 4 → 5 → 7 → 8 → 9 → Exit | `~d~u~~u~k` | `~du~~~~~k` | `~d~~~~~~k` | `~~~duu~~k` | `~~~~~~~~k` |
| 4 | start → 1 → 2 → 4 → 5 → 7 → 10 → 11 → Exit | `~d~u~~~~k` | `~du~~~~~k` | `~d~~~~u~k` | `~~~duuu~k` | `~~~~~~~~k` |
| 5 | start → 1 → 2 → 4 → 5 → 7 → 10 → 12 → 13 → Exit | `~d~u~~~~~k` | `~du~~~~~~k` | `~d~~~~u~~k` | `~~~duuuu~k` | `~~~~~~~~~k` |
| 6 | start → 1 → 2 → 4 → 5 → 7 → 10 → 12 → 14 → 15 → 16 → 17 → Exit | `~d~u~~~~uu~~k` | `~du~~~~~~~~~k` | `~d~~~~u~~~~~k` | `~~~duuuu~~~~k` | `~~~~~~~~~~~~k` |
| 7 | start → 1 → 2 → 4 → 5 → 7 → 10 → 12 → 14 → 15 → 16 → 18 → 19 → 20 → 21 → 22 → 23 → Exit | `~d~u~~~~uu~~u~~~uk` | `~du~~~~~~~~u~~~~~k` | `~d~~~~u~~~~~~~~~~k` | `~~~duuuu~~~~~~~~~k` | `~~~~~~~~~~~~~~~duk` |
| **Tổng kết** |  | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `email` khởi tạo tại node (1), sử dụng tại các node (4, 8, 14, 15, 19, 23), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `password` khởi tạo tại node (1), sử dụng tại các node (2, 18), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `otp` khởi tạo tại node (1), sử dụng tại các node (10), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `record` khởi tạo tại node (4), sử dụng tại các node (5, 7, 10, 12), và bị Kill tại `Exit`. Không có lỗi use-before-definition. | **Hợp lệ** ✅ — Chuỗi đời sống `d...u...k` trên các đường đi được kích hoạt. Biến `accessToken` khởi tạo tại node (22), sử dụng tại các node (23), và bị Kill tại `Exit`. Không có lỗi use-before-definition. |

## Phân tích chi tiết

### Biến `email`

- **Definition (d)**:
  - Node `1`: Tham số đầu vào `email` người dùng đăng ký
- **Use (u)**:
  - Node `4`: Tìm kiếm OTP cache theo `email`
  - Node `8`: Xóa OTP hết hạn theo `email`
  - Node `14`: Xóa OTP không hợp lệ theo `email`
  - Node `15`: Xóa OTP sai purpose theo `email`
  - Node `19`: Kiểm tra người dùng đã tồn tại theo `email`
  - Node `23`: Tạo tài khoản và cấp token gắn với `email`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `password`

- **Definition (d)**:
  - Node `1`: Tham số đầu vào `password` và `confirmPassword`
- **Use (u)**:
  - Node `2`: Kiểm tra khớp mật khẩu `password !== confirmPassword`
  - Node `18`: Băm mật khẩu `bcrypt.hash(password)` trước khi lưu
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `otp`

- **Definition (d)**:
  - Node `1`: Tham số đầu vào mã xác thực `otp`
- **Use (u)**:
  - Node `10`: Đối chiếu mã OTP đầu vào với cache `record.otp !== otp`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `record`

- **Definition (d)**:
  - Node `4`: Truy vấn bản ghi OTP từ bộ nhớ đệm cache
- **Use (u)**:
  - Node `5`: Kiểm tra tồn tại `!record`
  - Node `7`: Kiểm tra thời hạn `Date.now() > record.expiresAt`
  - Node `10`: Kiểm tra mã OTP trong bản ghi
  - Node `12`: Kiểm tra mục đích `record.purpose !== OtpPurpose.REGISTER`
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

### Biến `accessToken`

- **Definition (d)**:
  - Node `22`: Ký và tạo JWT token `jwtService.sign` cho user mới
- **Use (u)**:
  - Node `23`: Trả về `accessToken` và thông tin người dùng hoàn tất đăng ký
- **Kill (k)**: Tại node `Exit` — kết thúc hàm, biến ra khỏi phạm vi hoạt động.
- **Kết luận**: **Hợp lệ** — Biến tuân thủ đúng chu trình đời sống trong các luồng thực thi tương ứng.

## Kết luận tổng thể

> Toàn bộ 5 biến (`email, password, otp, record, accessToken`) đều có **chu trình đời sống hợp lệ** trên tất cả 7 đường thi hành tuyến độc lập của chức năng `register`.
>
> - Không phát hiện lỗi **Use-before-Definition** (sử dụng biến khi chưa khởi tạo).
>
> - Không phát hiện lỗi **Dead Definition** (khởi tạo biến nhưng không bao giờ sử dụng).
>
> - Mọi biến đều được giải phóng/kết thúc hợp lệ tại node `Exit`.

## Lưu ý về đường đi trong file `03_independent_paths.md`

Các đường đi trong file `03_independent_paths.md` liệt kê các node quyết định và node thực thi chính trên luồng nghiệp vụ. Chuỗi đời sống được tính toán chính xác dựa trên từng node xuất hiện trên đường đi và đối chiếu với các thao tác dữ liệu (`d`, `u`, `k`) được định nghĩa trong đồ thị dòng dữ liệu `05_data_flow_graph.puml`.
