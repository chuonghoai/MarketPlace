import { test, expect } from '@playwright/test';

test.describe('API - Quên mật khẩu', () => {
  test('Yêu cầu gửi mã OTP đặt lại mật khẩu cho email đã đăng ký (MKP_023)', async ({ request }) => {
    const response = await request.post('/auth/send-otp', {
      data: {
        email: 'client@example.com',
        purpose: 'FORGOT_PASSWORD',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  test('Báo lỗi khi yêu cầu gửi OTP cho email không tồn tại trong hệ thống', async ({ request }) => {
    const response = await request.post('/auth/send-otp', {
      data: {
        email: `nonexistent_${Date.now()}@example.com`,
        purpose: 'FORGOT_PASSWORD',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('Email không tồn tại');
  });

  test('Từ chối đặt lại mật khẩu khi nhập sai mã OTP', async ({ request }) => {
    const response = await request.post('/auth/forgot-password', {
      data: {
        email: 'client@example.com',
        otp: '999999',
        newPassword: 'NewPassword123@',
        confirmPassword: 'NewPassword123@',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('Mã OTP không hợp lệ hoặc đã hết hạn');
  });
});
