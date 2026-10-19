import { test, expect } from '@playwright/test';
import { loginViaUI } from '../helpers/auth.helper';

/**
 * UC09: Đánh giá sản phẩm & đơn hàng (MKP_077 -> MKP_080)
 * Kiểm thử hộp đen giao diện người dùng
 */
test.describe('UC09: Đánh giá sản phẩm (MKP_077 -> MKP_080)', () => {

  test('Màn hình Đánh giá đơn hàng tải được độc lập qua URL (MKP_077)', async ({ page }) => {
    await loginViaUI(page);
    await page.goto('/profile/order/tracking/mock-order-id/evaluate');
    await page.waitForLoadState('domcontentloaded');

    await expect(page, 'Trang đánh giá phải giữ nguyên URL /evaluate khi truy cập trực tiếp').toHaveURL(/\/evaluate$/, { timeout: 5000 });
    const evaluateHeading = page.getByRole('heading', { name: /Đánh giá đơn hàng/i });
    await expect(evaluateHeading, 'Tiêu đề "Đánh giá đơn hàng" phải hiển thị').toBeVisible({ timeout: 5000 });
  });

  test('Hiển thị nút Đánh giá trên thẻ đơn hàng tại màn hình Danh sách theo dõi (MKP_078)', async ({ page }) => {
    await loginViaUI(page);
    await page.goto('/profile/order/tracking');
    await page.waitForLoadState('domcontentloaded');

    const evaluateBtn = page.locator('button, a').filter({ hasText: /^Đánh giá$/i }).first();
    await expect(evaluateBtn, 'OrderCard must have "Đánh giá" action button').toBeVisible({ timeout: 5000 });
  });

  test('Hiển thị khối đánh giá cộng đồng và điểm sao tại trang chi tiết sản phẩm (MKP_079)', async ({ page }) => {
    await page.goto('/product/e2f6a99e-0fa6-4928-b846-1e7cd29f7ea4');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/e2f6a99e-0fa6-4928-b846-1e7cd29f7ea4/);
    const reviewHeader = page.getByRole('heading', { name: /Từ cộng đồng/i });
    await reviewHeader.scrollIntoViewIfNeeded().catch(() => {});
    await expect(reviewHeader).toBeVisible({ timeout: 10000 });
  });

  test('AuthGuard chặn khách vãng lai chưa đăng nhập truy cập trang đánh giá đơn hàng (MKP_080)', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/profile/order/tracking/mock-order-id/evaluate');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

});
