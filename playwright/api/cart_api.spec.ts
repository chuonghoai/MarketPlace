import { test, expect } from '@playwright/test';
import { getAuthToken } from '../helpers/auth.helper';

test.describe('API - Giỏ hàng', () => {
  let token: string;
  let sampleProductId: string;

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);

    // Lấy ID một sản phẩm mẫu
    const prodRes = await request.get('/products?pageSize=1');
    if (prodRes.ok()) {
      const prodBody = await prodRes.json();
      const list = prodBody.data?.products || prodBody.data || [];
      if (list.length > 0) {
        sampleProductId = list[0].id;
      }
    }
  });

  test('Lấy danh sách sản phẩm trong giỏ hàng thành công (MKP_006)', async ({ request }) => {
    const response = await request.get('/cart/items', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('Lấy tổng số lượng mặt hàng trong giỏ hàng thành công', async ({ request }) => {
    const response = await request.get('/cart/count', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('totalCartItems');
  });

  test('Thêm sản phẩm vào giỏ hàng thành công (MKP_006)', async ({ request }) => {
    if (!sampleProductId) test.skip();

    const response = await request.post('/cart/items', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        productId: sampleProductId,
        quantity: 1,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  test('Cập nhật số lượng sản phẩm trong giỏ hàng thành công (MKP_009)', async ({ request }) => {
    if (!sampleProductId) test.skip();

    const response = await request.put(`/cart/items/${sampleProductId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        quantity: 2,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  test('Từ chối cập nhật số lượng vượt quá số lượng hàng tồn kho (MKP_007)', async ({ request }) => {
    if (!sampleProductId) test.skip();

    const response = await request.put(`/cart/items/${sampleProductId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        quantity: 999999, // Vượt quá tồn kho thực tế
      },
    });

    // Kết quả mong đợi: 400 Bad Request
    expect(response.status()).toBe(400);
  });

  test('Xóa sản phẩm khỏi giỏ hàng thành công (MKP_008)', async ({ request }) => {
    if (!sampleProductId) test.skip();

    const response = await request.delete(`/cart/items/${sampleProductId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });
});
