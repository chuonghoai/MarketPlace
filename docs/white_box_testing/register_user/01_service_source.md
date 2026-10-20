# Mã nguồn service đăng ký

File gốc: `backend/src/module/auth/auth.service.ts`

```typescript
  async register(registerDto: RegisterDto): Promise<ApiResponse<any>> {
    const { email, password, confirmPassword, otp } = registerDto; [1]

    if (password !== confirmPassword [2]) {
    throw new CustomException(HttpStatus.BAD_REQUEST, 'VALIDATION_FAILED', 'Mật khẩu xác nhận không khớp'); [3]   
    }

     const record = await this.cacheManager.get<{ otp: string; expiresAt: number; purpose: OtpPurpose }>(email); [4]
    
    if (!record [5]) {
        throw new CustomException(HttpStatus.BAD_REQUEST, 'OTP_NOT_FOUND', 'Mã OTP không tồn tại hoặc chưa được gửi'); [6]   
    }
    
    if (Date.now() > record.expiresAt [7]) {
    await this.cacheManager.del(email); [8]
        throw new CustomException(HttpStatus.BAD_REQUEST, 'OTP_EXPIRED', 'Mã OTP đã hết hạn'); [9]
    }
    
    if (record.otp !== otp [10]) {
        throw new CustomException(HttpStatus.BAD_REQUEST, 'OTP_INVALID', 'Mã OTP không chính xác'); [11]
    }
    
    if (record.purpose !== OtpPurpose.REGISTER [12]) {
        throw new CustomException(HttpStatus.BAD_REQUEST, 'OTP_INVALID_PURPOSE', 'Mã OTP không hợp lệ cho thao tác đăng ký'); [13]
    }
    
    await this.cacheManager.del(email); [14]

    const existingUser = await this.userRepository.findOne({ where: { email } }); [15]
    
    if (existingUser [16]) {
        throw new CustomException(HttpStatus.BAD_REQUEST, 'USER_EXISTS', 'Email đã được sử dụng'); [17]
    }

    const hashedPassword = await bcrypt.hash(password, 10); [18]

    const newUser = this.userRepository.create({ [19]
      email,
      password: hashedPassword,
      fullName: email.split('@')[0],
      role: EUserRole.USER,
    });

    const savedUser = await this.userRepository.save(newUser); [20]

    const payload = { [21]
      userId: savedUser.id,
      version: savedUser.tokenVersion
    };

    const accessToken = this.jwtService.sign(payload); [22]

    return new ApiResponse(true, 'Đăng ký thành công', { [23]
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
