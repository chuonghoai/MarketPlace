# Mã nguồn service đăng ký

File gốc: `backend/src/module/auth/auth.service.ts`

```typescript
  async register(registerDto: RegisterDto): Promise<ApiResponse<any>> {
    // [1] Khởi tạo các biến từ DTO
[1] const { email, password, confirmPassword, otp } = registerDto;

    // [2] Kiểm tra mật khẩu xác nhận
[2] if (password !== confirmPassword) {
      // [3] Throw exception nếu mật khẩu không khớp
[3]   throw new CustomException(HttpStatus.BAD_REQUEST, 'VALIDATION_FAILED', 'Mật khẩu xác nhận không khớp');
    }

    // [4] Lấy thông tin OTP từ cache
[4] const record = await this.cacheManager.get<{ otp: string; expiresAt: number; purpose: OtpPurpose }>(email);
    
    // [5] Kiểm tra record có tồn tại không
[5] if (!record) {
      // [6] Throw exception nếu record không tồn tại
[6]   throw new CustomException(HttpStatus.BAD_REQUEST, 'OTP_NOT_FOUND', 'Mã OTP không tồn tại hoặc chưa được gửi');
    }
    
    // [7] Kiểm tra thời gian hết hạn của OTP
[7] if (Date.now() > record.expiresAt) {
      // [8] Xóa record trong cache
[8]   await this.cacheManager.del(email);
      // [9] Throw exception nếu OTP đã hết hạn
[9]   throw new CustomException(HttpStatus.BAD_REQUEST, 'OTP_EXPIRED', 'Mã OTP đã hết hạn');
    }
    
    // [10] Kiểm tra mã OTP
[10] if (record.otp !== otp) {
      // [11] Throw exception nếu OTP không đúng
[11]   throw new CustomException(HttpStatus.BAD_REQUEST, 'OTP_INVALID', 'Mã OTP không chính xác');
    }
    
    // [12] Kiểm tra mục đích của OTP
[12] if (record.purpose !== OtpPurpose.REGISTER) {
      // [13] Throw exception nếu mục đích OTP không hợp lệ
[13]   throw new CustomException(HttpStatus.BAD_REQUEST, 'OTP_INVALID_PURPOSE', 'Mã OTP không hợp lệ cho thao tác đăng ký');
    }
    
    // [14] Xóa OTP khỏi cache sau khi xác thực thành công
[14] await this.cacheManager.del(email);

    // [15] Kiểm tra người dùng đã tồn tại
[15] const existingUser = await this.userRepository.findOne({ where: { email } });
    
    // [16] Kiểm tra existingUser
[16] if (existingUser) {
      // [17] Throw exception nếu email đã được sử dụng
[17]   throw new CustomException(HttpStatus.BAD_REQUEST, 'USER_EXISTS', 'Email đã được sử dụng');
    }

    // [18] Băm mật khẩu
[18] const hashedPassword = await bcrypt.hash(password, 10);

    // [19] Tạo đối tượng User mới
[19] const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      fullName: email.split('@')[0],
      role: EUserRole.USER,
    });

    // [20] Lưu User vào cơ sở dữ liệu
[20] const savedUser = await this.userRepository.save(newUser);

    // [21] Khởi tạo payload cho JWT
[21] const payload = {
      userId: savedUser.id,
      version: savedUser.tokenVersion
    };

    // [22] Tạo JWT token
[22] const accessToken = this.jwtService.sign(payload);

    // [23] Trả về kết quả
[23] return new ApiResponse(true, 'Đăng ký thành công', {
      accessToken,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        fullName: savedUser.fullName || '',
        role: savedUser.role,
        avatarUrl: savedUser.avatarUrl || 'https://ui-avatars.com/api/?name=User'
      }
    });
  }
```
