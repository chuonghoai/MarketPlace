import { test, expect } from '@playwright/test';
import { getAuthToken } from '../helpers/auth.helper';

test.describe('API - Địa chỉ giao hàng', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test('Lấy danh sách địa chỉ giao hàng thành công (GET /users/me/address)', async ({ request }) => {
    const response = await request.get('/users/me/address', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('Tạo mới địa chỉ nhận hàng thành công', async ({ request }) => {
    const response = await request.post('/users/me/address', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        fullName: 'Nguyen Van A',
        phoneNumber: '0901234567',
        provinceCode: 79,
        provinceName: 'TP. Hồ Chí Minh',
        districtCode: 760,
        districtName: 'Quận 1',
        wardCode: 26734,
        wardName: 'Phường Bến Nghé',
        street: '123 Le Loi',
        fullAddress: '123 Le Loi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        isDefault: false,
      },
    });

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  test('Trả về mã lỗi 400 khi để trống các trường địa chỉ bắt buộc', async ({ request }) => {
    const response = await request.post('/users/me/address', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        fullName: '',
      },
    });

    expect(response.status()).toBe(400);
  });
});
