import { test, expect } from '@playwright/test';
import { getAuthToken } from '../helpers/auth.helper';

test.describe('API - Thông tin tài khoản người dùng', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test('Lấy thông tin tài khoản cá nhân hiện tại thành công (GET /users/me)', async ({ request }) => {
    const response = await request.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('email', 'client@example.com');
  });

  test('Cập nhật thông tin tài khoản cá nhân thành công (PUT /users/me)', async ({ request }) => {
    const updatedName = `Client Tester ${Date.now()}`;
    const response = await request.put('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        fullName: updatedName,
        phone: '0901234567',
        gender: 'OTHER',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  test('Từ chối truy vấn thông tin tài khoản khi không có token xác thực', async ({ request }) => {
    const response = await request.get('/users/me');
    expect(response.status()).toBe(401);
  });
});
