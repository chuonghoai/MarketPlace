import { test, expect } from '@playwright/test';

test.describe('Giao diện - Đăng ký tài khoản', () => {
  test('Hiển thị đầy đủ các trường nhập liệu của form đăng ký (MKP_001)', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByRole('heading', { name: 'Đăng ký', exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Nhập địa chỉ email...')).toBeVisible();
    await expect(page.getByPlaceholder('Nhập mã 6 chữ số...')).toBeVisible();
    await expect(page.getByPlaceholder('Tạo mật khẩu...')).toBeVisible();
    await expect(page.getByPlaceholder('Xác nhận lại mật khẩu...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Đăng ký tài khoản' })).toBeVisible();
  });

  test('Hiển thị lỗi kiểm tra khi mật khẩu xác nhận không khớp (MKP_002)', async ({ page }) => {
    await page.goto('/register');

    await page.getByPlaceholder('Nhập địa chỉ email...').fill('test_mismatch@example.com');
    await page.getByPlaceholder('Nhập mã 6 chữ số...').fill('123456');
    await page.getByPlaceholder('Tạo mật khẩu...').fill('Password123@');
    await page.getByPlaceholder('Xác nhận lại mật khẩu...').fill('DifferentPassword123@');

    await page.getByRole('button', { name: 'Đăng ký tài khoản' }).click();

    await expect(page.getByText('Mật khẩu không khớp')).toBeVisible();
  });

  test('Hiển thị thông báo lỗi thân thiện "Mã OTP không chính xác" khi nhập sai OTP (MKP_003)', async ({ page }) => {
    await page.goto('/register');
    await page.getByPlaceholder('Nhập địa chỉ email...').fill('wrong_otp_user@example.com');
    await page.getByPlaceholder('Nhập mã 6 chữ số...').fill('000000');
    await page.getByPlaceholder('Tạo mật khẩu...').fill('Password123@');
    await page.getByPlaceholder('Xác nhận lại mật khẩu...').fill('Password123@');

    await page.getByRole('button', { name: 'Đăng ký tài khoản' }).click();

    // Kết quả mong đợi theo tài liệu kiểm thử MKP_003:
    await expect(page.getByText(/Mã OTP không chính xác/i)).toBeVisible({ timeout: 4000 });
  });
});
