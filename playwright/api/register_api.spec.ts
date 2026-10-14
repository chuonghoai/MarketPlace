import { test, expect } from '@playwright/test';

test.describe('API - Đăng ký tài khoản', () => {
  test('Gửi mã OTP thành công cho email đăng ký mới (MKP_001)', async ({ request }) => {
    const email = `newuser_${Date.now()}@example.com`;
    const response = await request.post('/auth/send-otp', {
      data: {
        email,
        purpose: 'REGISTER',
      },
    });

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  test('Trả về mã lỗi 400 khi mã OTP không hợp lệ hoặc sai (MKP_003)', async ({ request }) => {
    const response = await request.post('/auth/register', {
      data: {
        email: `invalid_otp_${Date.now()}@example.com`,
        password: 'Password123@',
        confirmPassword: 'Password123@',
        otp: '999999',
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error?.message).toBeDefined();
  });

  test('Từ chối đăng ký và trả về lỗi 400 khi email đã tồn tại trong hệ thống (MKP_005)', async ({ request }) => {
    // Gửi OTP trước
    await request.post('/auth/send-otp', {
      data: {
        email: 'client@example.com',
        purpose: 'REGISTER',
      },
    });

    const response = await request.post('/auth/register', {
      data: {
        email: 'client@example.com',
        password: 'Password123@',
        confirmPassword: 'Password123@',
        otp: '123456',
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('Trả về mã lỗi 400 khi để trống các trường thông tin bắt buộc (MKP_002)', async ({ request }) => {
    const response = await request.post('/auth/register', {
      data: {
        email: '',
        password: '',
        confirmPassword: '',
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });
});
