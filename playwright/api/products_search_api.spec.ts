import { test, expect } from '@playwright/test';

test.describe('API - Tìm kiếm sản phẩm', () => {
  test('Trả về kết quả tìm kiếm với từ khóa hợp lệ (MKP_011)', async ({ request }) => {
    const response = await request.get('/products', {
      params: {
        search: 'a',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
    const products = body.data?.products || body.data || [];
    expect(Array.isArray(products)).toBe(true);
  });

  test('Trả về danh sách rỗng khi tìm kiếm từ khóa không tồn tại (MKP_012)', async ({ request }) => {
    const response = await request.get('/products', {
      params: {
        search: 'NonExistentProductKeyword_XYZ_99999999',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    const products = body.data?.products || body.data || [];
    expect(products.length).toBe(0);
  });

  test('Xử lý mượt mà khi để trống từ khóa tìm kiếm và trả về danh sách phân trang', async ({ request }) => {
    const response = await request.get('/products', {
      params: {
        page: 1,
        pageSize: 5,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    const products = body.data?.products || body.data || [];
    expect(Array.isArray(products)).toBe(true);
  });
});
