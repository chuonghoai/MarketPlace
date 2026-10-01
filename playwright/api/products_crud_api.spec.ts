import { test, expect } from '@playwright/test';
import { getAuthToken } from '../helpers/auth.helper';

test.describe('API - Chi tiết và quyền tạo sản phẩm', () => {
  let sampleProductId: string;
  let clientToken: string;

  test.beforeAll(async ({ request }) => {
    clientToken = await getAuthToken(request);

    // Lấy ID một sản phẩm hiện có
    const prodRes = await request.get('/products?pageSize=1');
    if (prodRes.ok()) {
      const prodBody = await prodRes.json();
      const list = prodBody.data?.products || prodBody.data || [];
      if (list.length > 0) {
        sampleProductId = list[0].id;
      }
    }
  });

  test('Lấy thông tin chi tiết sản phẩm theo ID (GET /products/:id)', async ({ request }) => {
    if (!sampleProductId) test.skip();

    const response = await request.get(`/products/${sampleProductId}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('id', sampleProductId);
    expect(body.data).toHaveProperty('name');
    expect(body.data).toHaveProperty('price');
  });

  test('Trả về lỗi 404 hoặc 400 khi tra cứu ID sản phẩm không tồn tại', async ({ request }) => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await request.get(`/products/${fakeId}`);
    expect([400, 404]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('Chặn người dùng vai trò thông thường (Client) tạo sản phẩm (POST /products)', async ({ request }) => {
    const response = await request.post('/products', {
      headers: {
        Authorization: `Bearer ${clientToken}`,
      },
      data: {
        name: 'Unauthorized Product',
        price: 100000,
        description: 'Test',
      },
    });

    expect(response.status()).toBe(403);
  });
});
