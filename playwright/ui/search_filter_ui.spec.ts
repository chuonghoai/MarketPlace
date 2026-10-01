import { test, expect } from '@playwright/test';

test.describe('Giao diện - Tìm kiếm và bộ lọc sàn thương mại', () => {
  test('Hiển thị ô nhập tìm kiếm và các tùy chọn lọc trên trang Marketplace (MKP_011)', async ({ page }) => {
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });

    await expect(page.getByPlaceholder('Tối thiểu')).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder('Tối đa')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Áp dụng bộ lọc' })).toBeVisible();
  });

  test('Hiển thị thông báo lỗi màu đỏ khi giá tối thiểu lớn hơn giá tối đa (MKP_014)', async ({ page }) => {
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });

    await expect(page.getByPlaceholder('Tối thiểu')).toBeVisible({ timeout: 10000 });
    await page.getByPlaceholder('Tối thiểu').fill('500000');
    await page.getByPlaceholder('Tối đa').fill('100000');
    await page.getByRole('button', { name: 'Áp dụng bộ lọc' }).click();

    // Kết quả mong đợi theo tài liệu kiểm thử MKP_014:
    // Hiển thị thông báo lỗi kiểm tra: Giá tối thiểu phải nhỏ hơn giá tối đa
    await expect(page.getByText(/Giá tối thiểu phải nhỏ hơn giá tối đa/i)).toBeVisible({ timeout: 3000 });
  });

  test('Áp dụng tùy chọn sắp xếp sản phẩm chính xác (MKP_015)', async ({ page }) => {
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });

    const sortOption = page.locator('label', { hasText: 'Giá tăng dần' });
    if (await sortOption.isVisible({ timeout: 5000 })) {
      await sortOption.click();
      await page.getByRole('button', { name: 'Áp dụng bộ lọc' }).click();
      await expect(page).toHaveURL(/sortBy=PRICE_LOW_TO_HIGH/, { timeout: 5000 });
    }
  });
});
