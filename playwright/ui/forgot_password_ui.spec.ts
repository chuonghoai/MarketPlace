import { test, expect } from '@playwright/test';

test.describe('Giao diện - Quên mật khẩu', () => {
  test('Hiển thị form quên mật khẩu với trường nhập email', async ({ page }) => {
    await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'Quên mật khẩu' })).toBeVisible();
    await expect(page.getByPlaceholder('Nhập địa chỉ email...')).toBeVisible();
    await expect(page.getByRole('button', { name: /Gửi mã|Xác nhận|Gửi/i })).toBeVisible();
  });

  test('Hiển thị lỗi kiểm tra khi để trống email gửi yêu cầu', async ({ page }) => {
    await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });

    await page.getByRole('button', { name: /Gửi mã|Xác nhận|Gửi/i }).click();
    await expect(page.getByText('Email là bắt buộc')).toBeVisible();
  });

  test('Ô nhập mã OTP chỉ chấp nhận ký tự số và từ chối ký tự chữ "abcdef" (MKP_024)', async ({ page }) => {
    await page.goto('/reset-password?email=client@example.com', { waitUntil: 'domcontentloaded' });

    const otpInput = page.getByPlaceholder('Nhập mã 6 chữ số...');
    await expect(otpInput).toBeVisible({ timeout: 5000 });

    await otpInput.fill('abcdef');

    // Kết quả mong đợi theo tài liệu kiểm thử MKP_024:
    // Không cho phép nhập chữ vào ô OTP (giá trị không được lưu là "abcdef")
    await expect(otpInput).not.toHaveValue('abcdef');
  });
});
