# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\products_filter_api.spec.ts >> API - Bộ lọc và sắp xếp sản phẩm >> Trả về mã lỗi 400 khi giá tối thiểu lớn hơn giá tối đa minPrice > maxPrice (MKP_014)
- Location: playwright\api\products_filter_api.spec.ts:22:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 400
Received: 200
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('API - Bộ lọc và sắp xếp sản phẩm', () => {
  4  |   test('Lọc sản phẩm trong khoảng giá hợp lệ thành công (MKP_013)', async ({ request }) => {
  5  |     const minPrice = 10000;
  6  |     const maxPrice = 5000000;
  7  | 
  8  |     const response = await request.get('/products', {
  9  |       params: {
  10 |         'filters[minPrice]': String(minPrice),
  11 |         'filters[maxPrice]': String(maxPrice),
  12 |       },
  13 |     });
  14 | 
  15 |     expect(response.status()).toBe(200);
  16 |     const body = await response.json();
  17 |     expect(body.success).toBe(true);
  18 |     const products = body.data?.products || body.data || [];
  19 |     expect(Array.isArray(products)).toBe(true);
  20 |   });
  21 | 
  22 |   test('Trả về mã lỗi 400 khi giá tối thiểu lớn hơn giá tối đa minPrice > maxPrice (MKP_014)', async ({ request }) => {
  23 |     const response = await request.get('/products', {
  24 |       params: {
  25 |         'filters[minPrice]': '1000000',
  26 |         'filters[maxPrice]': '100000',
  27 |       },
  28 |     });
  29 | 
  30 |     // Kết quả mong đợi theo đặc tả: Báo lỗi kiểm tra 400 Bad Request
> 31 |     expect(response.status()).toBe(400);
     |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  32 |   });
  33 | 
  34 |   test('Xử lý lọc và sắp xếp sản phẩm theo tiêu chí mới nhất (MKP_015)', async ({ request }) => {
  35 |     const response = await request.get('/products', {
  36 |       params: {
  37 |         'filters[sortBy]': 'NEWEST',
  38 |         page: 1,
  39 |         pageSize: 10,
  40 |       },
  41 |     });
  42 | 
  43 |     expect(response.status()).toBe(200);
  44 |     const body = await response.json();
  45 |     expect(body.success).toBe(true);
  46 |     const products = body.data?.products || body.data || [];
  47 |     expect(Array.isArray(products)).toBe(true);
  48 |   });
  49 | });
  50 | 
```