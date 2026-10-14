# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\cart_api.spec.ts >> API - Giỏ hàng >> Từ chối cập nhật số lượng vượt quá số lượng hàng tồn kho (MKP_007)
- Location: playwright\api\cart_api.spec.ts:83:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 400
Received: 200
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { getAuthToken } from '../helpers/auth.helper';
  3   | 
  4   | test.describe('API - Giỏ hàng', () => {
  5   |   let token: string;
  6   |   let sampleProductId: string;
  7   | 
  8   |   test.beforeAll(async ({ request }) => {
  9   |     token = await getAuthToken(request);
  10  | 
  11  |     // Lấy ID một sản phẩm mẫu
  12  |     const prodRes = await request.get('/products?pageSize=1');
  13  |     if (prodRes.ok()) {
  14  |       const prodBody = await prodRes.json();
  15  |       const list = prodBody.data?.products || prodBody.data || [];
  16  |       if (list.length > 0) {
  17  |         sampleProductId = list[0].id;
  18  |       }
  19  |     }
  20  |   });
  21  | 
  22  |   test('Lấy danh sách sản phẩm trong giỏ hàng thành công (MKP_006)', async ({ request }) => {
  23  |     const response = await request.get('/cart/items', {
  24  |       headers: {
  25  |         Authorization: `Bearer ${token}`,
  26  |       },
  27  |     });
  28  | 
  29  |     expect(response.status()).toBe(200);
  30  |     const body = await response.json();
  31  |     expect(body.success).toBe(true);
  32  |     expect(Array.isArray(body.data)).toBe(true);
  33  |   });
  34  | 
  35  |   test('Lấy tổng số lượng mặt hàng trong giỏ hàng thành công', async ({ request }) => {
  36  |     const response = await request.get('/cart/count', {
  37  |       headers: {
  38  |         Authorization: `Bearer ${token}`,
  39  |       },
  40  |     });
  41  | 
  42  |     expect(response.status()).toBe(200);
  43  |     const body = await response.json();
  44  |     expect(body.success).toBe(true);
  45  |     expect(body.data).toHaveProperty('totalCartItems');
  46  |   });
  47  | 
  48  |   test('Thêm sản phẩm vào giỏ hàng thành công (MKP_006)', async ({ request }) => {
  49  |     if (!sampleProductId) test.skip();
  50  | 
  51  |     const response = await request.post('/cart/items', {
  52  |       headers: {
  53  |         Authorization: `Bearer ${token}`,
  54  |       },
  55  |       data: {
  56  |         productId: sampleProductId,
  57  |         quantity: 1,
  58  |       },
  59  |     });
  60  | 
  61  |     expect(response.status()).toBe(200);
  62  |     const body = await response.json();
  63  |     expect(body.success).toBe(true);
  64  |   });
  65  | 
  66  |   test('Cập nhật số lượng sản phẩm trong giỏ hàng thành công (MKP_009)', async ({ request }) => {
  67  |     if (!sampleProductId) test.skip();
  68  | 
  69  |     const response = await request.put(`/cart/items/${sampleProductId}`, {
  70  |       headers: {
  71  |         Authorization: `Bearer ${token}`,
  72  |       },
  73  |       data: {
  74  |         quantity: 2,
  75  |       },
  76  |     });
  77  | 
  78  |     expect(response.status()).toBe(200);
  79  |     const body = await response.json();
  80  |     expect(body.success).toBe(true);
  81  |   });
  82  | 
  83  |   test('Từ chối cập nhật số lượng vượt quá số lượng hàng tồn kho (MKP_007)', async ({ request }) => {
  84  |     if (!sampleProductId) test.skip();
  85  | 
  86  |     const response = await request.put(`/cart/items/${sampleProductId}`, {
  87  |       headers: {
  88  |         Authorization: `Bearer ${token}`,
  89  |       },
  90  |       data: {
  91  |         quantity: 999999, // Vượt quá tồn kho thực tế
  92  |       },
  93  |     });
  94  | 
  95  |     // Kết quả mong đợi: 400 Bad Request
> 96  |     expect(response.status()).toBe(400);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  97  |   });
  98  | 
  99  |   test('Xóa sản phẩm khỏi giỏ hàng thành công (MKP_008)', async ({ request }) => {
  100 |     if (!sampleProductId) test.skip();
  101 | 
  102 |     const response = await request.delete(`/cart/items/${sampleProductId}`, {
  103 |       headers: {
  104 |         Authorization: `Bearer ${token}`,
  105 |       },
  106 |     });
  107 | 
  108 |     expect(response.status()).toBe(200);
  109 |     const body = await response.json();
  110 |     expect(body.success).toBe(true);
  111 |   });
  112 | });
  113 | 
```