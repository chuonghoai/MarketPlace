import { test, expect } from '@playwright/test';

test.describe('E2E - Quy trình đăng nhập', () => {
  test('Người dùng đăng nhập thành công và chuyển hướng về trang chủ', async ({ page }) => {
    // 1. Mở trang đăng nhập
    await page.goto('/login');

    // 2. Nhập thông tin đăng nhập hợp lệ
    await page.getByPlaceholder('Nhập địa chỉ email...').fill('client@example.com');
    await page.getByPlaceholder('Nhập mật khẩu...').fill('password123');

    // 3. Nhấn nút Đăng nhập
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

    // 4. Kiểm tra chuyển hướng về trang chủ
    await expect(page).toHaveURL('/');
  });

  test('Người dùng không thể đăng nhập khi nhập sai mật khẩu và hiển thị cảnh báo lỗi', async ({ page }) => {
    // 1. Mở trang đăng nhập
    await page.goto('/login');

    // 2. Nhập sai mật khẩu
    await page.getByPlaceholder('Nhập địa chỉ email...').fill('client@example.com');
    await page.getByPlaceholder('Nhập mật khẩu...').fill('wrongpassword123');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

    // 3. Kiểm tra thông báo lỗi hiển thị trên màn hình
    await expect(page.getByText('Tài khoản hoặc mật khẩu không đúng').first()).toBeVisible();
  });
});
