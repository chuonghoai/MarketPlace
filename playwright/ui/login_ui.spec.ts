import { test, expect } from '@playwright/test';

test.describe('Giao diện - Đăng nhập', () => {
  test('Hiển thị đầy đủ các thành phần của form đăng nhập', async ({ page }) => {
    await page.goto('/login');

    // Kiểm tra các phần tử trên form đăng nhập
    await expect(page.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Nhập địa chỉ email...')).toBeVisible();
    await expect(page.getByPlaceholder('Nhập mật khẩu...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toBeVisible();
  });

  test('Hiển thị thông báo lỗi kiểm tra khi gửi form trống', async ({ page }) => {
    await page.goto('/login');

    // Nhấn nút đăng nhập khi chưa nhập thông tin
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

    // Mong đợi xuất hiện thông báo lỗi
    await expect(page.getByText('Email là bắt buộc')).toBeVisible();
    await expect(page.getByText('Mật khẩu là bắt buộc')).toBeVisible();
  });

  test('Chuyển hướng đến trang xác thực Google OAuth khi bấm Đăng nhập bằng Google (MKP_017)', async ({ page }) => {
    await page.goto('/login');
    const googleBtn = page.getByRole('button', { name: /Đăng nhập bằng Google/i });
    await expect(googleBtn).toBeVisible();
    await googleBtn.click();
    // Kết quả mong đợi theo đặc tả: Chuyển hướng tới trang Google OAuth
    await expect(page).toHaveURL(/accounts\.google\.com/, { timeout: 3000 });
  });
});
