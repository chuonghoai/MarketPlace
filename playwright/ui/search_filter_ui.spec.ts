import { test, expect } from '@playwright/test';

test.describe('Giao diện - Tìm kiếm và bộ lọc sàn thương mại', () => {
  test('Hiển thị ô nhập tìm kiếm và các tùy chọn lọc trên trang Marketplace (MKP_011)', async ({ page }) => {
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });

    await expect(page.getByPlaceholder('Tối thiểu')).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder('Tối đa')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Áp dụng bộ lọc' })).toBeVisible();
  });

  test('Hiển thị thông báo lỗi khi giá tối thiểu lớn hơn giá tối đa, không gọi API, giữ nguyên danh sách (MKP_014)', async ({ page }) => {
    let apiCallCount = 0;
    page.on('request', (request) => {
      if (request.url().includes(':3000/products') || request.url().includes('/api/v1/products')) {
        apiCallCount++;
      }
    });

    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
    await expect(page.getByPlaceholder('Tối thiểu')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);

    const initialApiCount = apiCallCount;

    // 1. Nhập min = 500000, max = 100000 (không hợp lệ)
    await page.getByPlaceholder('Tối thiểu').fill('500000');
    await page.getByPlaceholder('Tối đa').fill('100000');
    await page.getByRole('button', { name: 'Áp dụng bộ lọc' }).click();

    // Hiển thị thông báo lỗi màu đỏ
    const errorMessage = page.locator('#price-range-error');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
    await expect(errorMessage).toHaveText('Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa.');

    // Không gọi thêm API nào sau submit lỗi
    expect(apiCallCount).toBe(initialApiCount);

    // Thuộc tính accessibility aria-invalid
    await expect(page.getByPlaceholder('Tối thiểu')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByPlaceholder('Tối đa')).toHaveAttribute('aria-invalid', 'true');
  });

  test('Xóa thông báo lỗi khi người dùng sửa giá hợp lệ và submit thành công (MKP_014)', async ({ page }) => {
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
    await expect(page.getByPlaceholder('Tối thiểu')).toBeVisible({ timeout: 10000 });

    // Nhập sai
    await page.getByPlaceholder('Tối thiểu').fill('500000');
    await page.getByPlaceholder('Tối đa').fill('100000');
    await page.getByRole('button', { name: 'Áp dụng bộ lọc' }).click();

    const errorMessage = page.locator('#price-range-error');
    await expect(errorMessage).toBeVisible();

    // Sửa minPrice thành 50000 (hợp lệ 50000 <= 100000)
    await page.getByPlaceholder('Tối thiểu').fill('50000');
    // Khi người dùng sửa, lỗi tự động xóa
    await expect(errorMessage).not.toBeVisible();

    // Submit lại
    await page.getByRole('button', { name: 'Áp dụng bộ lọc' }).click();
    await expect(errorMessage).not.toBeVisible();
    await expect(page).toHaveURL(/minPrice=50000/);
    await expect(page).toHaveURL(/maxPrice=100000/);
  });

  test('Chấp nhận khi hai giá bằng nhau (minPrice === maxPrice) (MKP_014)', async ({ page }) => {
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
    await expect(page.getByPlaceholder('Tối thiểu')).toBeVisible({ timeout: 10000 });

    await page.getByPlaceholder('Tối thiểu').fill('100000');
    await page.getByPlaceholder('Tối đa').fill('100000');
    await page.getByRole('button', { name: 'Áp dụng bộ lọc' }).click();

    await expect(page.locator('#price-range-error')).not.toBeVisible();
    await expect(page).toHaveURL(/minPrice=100000/);
    await expect(page).toHaveURL(/maxPrice=100000/);
  });

  test('Chỉ nhập giá tối thiểu hoặc chỉ nhập giá tối đa (MKP_014)', async ({ page }) => {
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
    await expect(page.getByPlaceholder('Tối thiểu')).toBeVisible({ timeout: 10000 });

    // Chỉ nhập giá tối thiểu
    await page.getByPlaceholder('Tối thiểu').fill('200000');
    await page.getByPlaceholder('Tối đa').fill('');
    await page.getByRole('button', { name: 'Áp dụng bộ lọc' }).click();

    await expect(page.locator('#price-range-error')).not.toBeVisible();
    await expect(page).toHaveURL(/minPrice=200000/);

    // Chỉ nhập giá tối đa
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
    await expect(page.getByPlaceholder('Tối đa')).toBeVisible({ timeout: 10000 });

    await page.getByPlaceholder('Tối thiểu').fill('');
    await page.getByPlaceholder('Tối đa').fill('400000');
    await page.getByRole('button', { name: 'Áp dụng bộ lọc' }).click();

    await expect(page.locator('#price-range-error')).not.toBeVisible();
    await expect(page).toHaveURL(/maxPrice=400000/);
  });

  test('Áp dụng tùy chọn sắp xếp sản phẩm chính xác (MKP_015)', async ({ page }) => {
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });

    const sortOption = page.locator('label', { hasText: 'Giá tăng dần' });
    await expect(sortOption).toBeVisible({ timeout: 10000 });
    await sortOption.click();
    await page.getByRole('button', { name: 'Áp dụng bộ lọc' }).click();
    await expect(page).toHaveURL(/sortBy=PRICE_LOW_TO_HIGH/, { timeout: 10000 });
  });
});
