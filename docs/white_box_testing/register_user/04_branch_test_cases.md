# Test case bao phủ nhánh

| STT | Điều kiện đầu vào | Kết quả mong đợi |
|---|---|---|
| 1 | `password !== confirmPassword` | Exception (400, Mật khẩu xác nhận không khớp) |
| 2 | `password === confirmPassword`, `!record` | Exception (400, Mã OTP không tồn tại hoặc chưa được gửi) |
| 3 | `password === confirmPassword`, `record` tồn tại, `Date.now() > record.expiresAt` | Exception (400, Mã OTP đã hết hạn) |
| 4 | `password === confirmPassword`, `record` hợp lệ thời gian, `record.otp !== otp` | Exception (400, Mã OTP không chính xác) |
| 5 | `password === confirmPassword`, `record` hợp lệ thời gian, `record.otp === otp`, `record.purpose !== OtpPurpose.REGISTER` | Exception (400, Mã OTP không hợp lệ cho thao tác đăng ký) |
| 6 | `password === confirmPassword`, `record` hoàn toàn hợp lệ, `existingUser` tồn tại | Exception (400, Email đã được sử dụng) |
| 7 | `password === confirmPassword`, `record` hoàn toàn hợp lệ, `existingUser` không tồn tại | Đăng ký thành công, trả về ApiResponse với token và user |
