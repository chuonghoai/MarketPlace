import { test, expect } from '@playwright/test';

test.describe('API - Đăng nhập', () => {
  test('Đăng nhập thành công với tài khoản và mật khẩu hợp lệ (MKP_018)', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: {
        email: 'client@example.com',
        password: 'password123',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('accessToken');
    expect(body.data.user).toHaveProperty('email', 'client@example.com');
  });

  test('Trả về mã lỗi 401 khi sai mật khẩu hoặc tài khoản không đúng (MKP_019)', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: {
        email: 'client@example.com',
        password: 'wrongpassword',
      },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('Trả về mã lỗi 400 khi để trống tài khoản và mật khẩu (MKP_020)', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: {
        email: '',
        password: '',
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });
});
