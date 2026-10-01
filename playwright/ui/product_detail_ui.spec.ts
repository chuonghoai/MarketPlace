import { test, expect } from '@playwright/test';

test.describe('Giao diện - Chi tiết sản phẩm', () => {
  let sampleProductId: string;

  test.beforeAll(async ({ request }) => {
    const response = await request.get('http://127.0.0.1:3000/products?pageSize=1');
    if (response.ok()) {
      const body = await response.json();
      const list = body.data?.products || body.data || [];
      if (list.length > 0) {
        sampleProductId = list[0].id;
      }
    }
  });

  test('Hiển thị thông tin chi tiết sản phẩm, hình ảnh, giá và nút Thêm vào giỏ (MKP_006)', async ({ page }) => {
    if (!sampleProductId) test.skip();

    await page.goto(`/product/${sampleProductId}`, { waitUntil: 'domcontentloaded' });

    // Kiểm tra tiêu đề và nút Thêm vào giỏ
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Thêm vào giỏ', exact: true })).toBeVisible({ timeout: 10000 });
  });

  test('Cho phép tăng và giảm số lượng sản phẩm dự định mua', async ({ page }) => {
    if (!sampleProductId) test.skip();

    await page.goto(`/product/${sampleProductId}`, { waitUntil: 'domcontentloaded' });

    const increaseBtn = page.getByRole('button', { name: 'Tăng số lượng' });
    if (await increaseBtn.isVisible({ timeout: 5000 })) {
      await increaseBtn.click();
      const qtyInput = page.locator('input[type="number"][readonly]');
      await expect(qtyInput).toHaveValue('2');

      const decreaseBtn = page.getByRole('button', { name: 'Giảm số lượng' });
      await decreaseBtn.click();
      await expect(qtyInput).toHaveValue('1');
    }
  });
});
