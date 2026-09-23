import { test, expect } from '@playwright/test';

test.describe('Login E2E', () => {
  test('user can login and redirect to homepage', async ({ page }) => {
    // 1. Mở trang login
    await page.goto('/login');

    // 2. Nhập thông tin
    await page.getByPlaceholder('Nhập địa chỉ email...').fill('client@example.com');
    await page.getByPlaceholder('Nhập mật khẩu...').fill('password123');

    // 3. Click Đăng nhập
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // 4. Kiểm tra chuyển tới trang chủ (URL phải đổi)
    await expect(page).toHaveURL('/');

    // 5. Kiểm tra trạng thái đã đăng nhập (ví dụ: không còn nút Đăng nhập hoặc hiển thị tên user)
    // Tùy thuộc vào UI, ở đây ta chờ chuyển trang thành công
    // Nếu ứng dụng có profile button hoặc logout, có thể check cụ thể hơn.
  });

  test('user cannot login with wrong password', async ({ page }) => {
    // 1. Mở trang login
    await page.goto('/login');

    // 2. Nhập sai password
    await page.getByPlaceholder('Nhập địa chỉ email...').fill('client@example.com');
    await page.getByPlaceholder('Nhập mật khẩu...').fill('wrongpassword123');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // 3. Kiểm tra có thông báo lỗi hiển thị (từ API trả về hoặc UI báo lỗi)
    await expect(page.getByText('Tài khoản hoặc mật khẩu không đúng')).toBeVisible();
  });
});
