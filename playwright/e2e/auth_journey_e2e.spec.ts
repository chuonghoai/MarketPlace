import { test, expect } from '@playwright/test';
import { TEST_USERS } from '../helpers/auth.helper';

test.describe('E2E - Hành trình xác thực người dùng', () => {
  test('Người dùng chuyển từ trang đăng ký sang đăng nhập, đăng nhập thành công và vào sàn', async ({ page }) => {
    // 1. Mở trang đăng ký
    await page.goto('/register', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Đăng ký', exact: true })).toBeVisible({ timeout: 10000 });

    // 2. Nhấn vào liên kết chuyển sang trang Đăng nhập
    const loginLink = page.getByRole('link', { name: /Đăng nhập/i }).first();
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);

    // 3. Nhập thông tin tài khoản hợp lệ
    await page.getByPlaceholder('Nhập địa chỉ email...').fill(TEST_USERS.client.email);
    await page.getByPlaceholder('Nhập mật khẩu...').fill(TEST_USERS.client.password);

    // 4. Nhấn nút Đăng nhập
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

    // 5. Chuyển hướng thành công vào sàn thương mại
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});
