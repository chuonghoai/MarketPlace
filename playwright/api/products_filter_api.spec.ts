import { test, expect } from '@playwright/test';

test.describe('API - Bộ lọc và sắp xếp sản phẩm', () => {
  test('Lọc sản phẩm trong khoảng giá hợp lệ thành công (MKP_013)', async ({ request }) => {
    const minPrice = 10000;
    const maxPrice = 5000000;

    const response = await request.get('/products', {
      params: {
        'filters[minPrice]': String(minPrice),
        'filters[maxPrice]': String(maxPrice),
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    const products = body.data?.products || body.data || [];
    expect(Array.isArray(products)).toBe(true);
  });

  test('Trả về mã lỗi 400 khi giá tối thiểu lớn hơn giá tối đa minPrice > maxPrice (MKP_014)', async ({ request }) => {
    const response = await request.get('/products', {
      params: {
        'filters[minPrice]': '1000000',
        'filters[maxPrice]': '100000',
      },
    });

    // Kết quả mong đợi theo đặc tả: Báo lỗi kiểm tra 400 Bad Request
    expect(response.status()).toBe(400);
  });

  test('Xử lý lọc và sắp xếp sản phẩm theo tiêu chí mới nhất (MKP_015)', async ({ request }) => {
    const response = await request.get('/products', {
      params: {
        'filters[sortBy]': 'NEWEST',
        page: 1,
        pageSize: 10,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    const products = body.data?.products || body.data || [];
    expect(Array.isArray(products)).toBe(true);
  });
});
