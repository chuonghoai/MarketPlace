# Các đường thi hành tuyến độc lập

## 1. Danh sách các node điều kiện

- **[2]**: `password !== confirmPassword` (Kiểm tra mật khẩu xác nhận)
- **[5]**: `!record` (Kiểm tra thông tin OTP trong cache)
- **[7]**: `Date.now() > record.expiresAt` (Kiểm tra thời gian hết hạn của OTP)
- **[10]**: `record.otp !== otp` (Kiểm tra mã OTP)
- **[12]**: `record.purpose !== OtpPurpose.REGISTER` (Kiểm tra mục đích của OTP)
- **[16]**: `existingUser` (Kiểm tra người dùng đã tồn tại)

## 2. Tính số đường thi hành tuyến độc lập

Số lượng điều kiện (P) = 6
V(G) = P + 1 = 6 + 1 = 7

## 3. Các đường thi hành độc lập

- **Path 1**: `start -> 1 -> 2(True) -> 3 -> Exit`
- **Path 2**: `start -> 1 -> 2(False) -> 4 -> 5(True) -> 6 -> Exit`
- **Path 3**: `start -> 1 -> 2(False) -> 4 -> 5(False) -> 7(True) -> 8 -> 9 -> Exit`
- **Path 4**: `start -> 1 -> 2(False) -> 4 -> 5(False) -> 7(False) -> 10(True) -> 11 -> Exit`
- **Path 5**: `start -> 1 -> 2(False) -> 4 -> 5(False) -> 7(False) -> 10(False) -> 12(True) -> 13 -> Exit`
- **Path 6**: `start -> 1 -> 2(False) -> 4 -> 5(False) -> 7(False) -> 10(False) -> 12(False) -> 14 -> 15 -> 16(True) -> 17 -> Exit`
- **Path 7**: `start -> 1 -> 2(False) -> 4 -> 5(False) -> 7(False) -> 10(False) -> 12(False) -> 14 -> 15 -> 16(False) -> 18 -> 19 -> 20 -> 21 -> 22 -> 23 -> Exit`
