import { test, expect } from '@playwright/test';

test.describe('API - Danh mục sản phẩm', () => {
  test('Lấy danh sách danh mục sản phẩm thành công (GET /categories)', async ({ request }) => {
    const response = await request.get('/categories');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('Kiểm tra cấu trúc dữ liệu trả về của danh mục sản phẩm', async ({ request }) => {
    const response = await request.get('/categories');
    expect(response.status()).toBe(200);
    const body = await response.json();
    if (body.data.length > 0) {
      const firstCat = body.data[0];
      expect(firstCat).toHaveProperty('id');
      expect(firstCat).toHaveProperty('name');
    }
  });
});
