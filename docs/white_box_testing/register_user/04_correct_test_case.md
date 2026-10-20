# Test case bao phủ nhánh

| Kịch bản | Mã test case | Đường thi hành | Điều kiện đầu vào | Kết quả mong đợi | Trạng thái |
|:---|:---|:---|:---|:---|:---:|
| Kịch bản 1 | TC01 | 1 -> 2 -> 3 -> Exit | `password !== confirmPassword` | Exception (400, Mật khẩu xác nhận không khớp) | Pass |
| Kịch bản 2 | TC02 | 1 -> 2 -> 4 -> 5 -> 6 -> Exit | `password === confirmPassword`, `!record` | Exception (400, Mã OTP không tồn tại hoặc chưa được gửi) | Pass |
| Kịch bản 3 | TC03 | 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 9 -> Exit | `password === confirmPassword`, `record` tồn tại, `Date.now() > record.expiresAt` | Exception (400, Mã OTP đã hết hạn) | Pass |
| Kịch bản 4 | TC04 | 1 -> 2 -> 4 -> 5 -> 7 -> 10 -> 11 -> Exit | `password === confirmPassword`, `record` hợp lệ thời gian, `record.otp !== otp` | Exception (400, Mã OTP không chính xác) | Pass |
| Kịch bản 5 | TC05 | 1 -> 2 -> 4 -> 5 -> 7 -> 10 -> 12 -> 13 -> Exit | `password === confirmPassword`, `record` hợp lệ thời gian, `record.otp === otp`, `record.purpose !== OtpPurpose.REGISTER` | Exception (400, Mã OTP không hợp lệ cho thao tác đăng ký) | Pass |
| Kịch bản 6 | TC06 | 1 -> 2 -> 4 -> 5 -> 7 -> 10 -> 12 -> 14 -> 15 -> 16 -> 17 -> Exit | `password === confirmPassword`, `record` hoàn toàn hợp lệ, `existingUser` tồn tại | Exception (400, Email đã được sử dụng) | Pass |
| Kịch bản 7 | TC07 | 1 -> 2 -> 4 -> 5 -> 7 -> 10 -> 12 -> 14 -> 15 -> 16 -> 18 -> 19 -> 20 -> 21 -> 22 -> 23 -> Exit | `password === confirmPassword`, `record` hoàn toàn hợp lệ, `existingUser` không tồn tại | Đăng ký thành công, trả về ApiResponse với token và user | Pass |
