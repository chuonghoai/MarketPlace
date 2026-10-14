import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from '../helpers/auth.helper';

test.describe('Giao diện - Bảng điều khiển quản trị (Admin Dashboard)', () => {
  test('Hiển thị trang tổng quan và các thẻ chỉ số KPI cho tài khoản Admin (MKP_021)', async ({ page }) => {
    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    // Kiểm tra các thẻ chỉ số KPI
    await expect(page.getByText('Doanh thu')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Đơn hàng')).toBeVisible();
    await expect(page.getByText('Tỉ lệ chuyển đổi')).toBeVisible();
  });

  test('Hiển thị thanh menu điều hướng sidebar với đầy đủ các mục chức năng', async ({ page }) => {
    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    const sidebar = page.locator('nav').filter({ hasText: 'MarketNest' });
    await expect(sidebar).toBeVisible({ timeout: 10000 });
    await expect(sidebar.getByText('Tổng quan')).toBeVisible();
  });

  test('Chặn người dùng thông thường (Client) truy cập vào trang quản trị Admin', async ({ page }) => {
    await loginViaUI(page, TEST_USERS.client);
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    // Chuyển hướng khỏi trang /admin hoặc chặn truy cập
    await expect(page).not.toHaveURL(/\/admin$/, { timeout: 10000 });
  });
});
