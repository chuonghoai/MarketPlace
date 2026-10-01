# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\forgot_password_ui.spec.ts >> Giao diện - Quên mật khẩu >> Ô nhập mã OTP chỉ chấp nhận ký tự số và từ chối ký tự chữ "abcdef" (MKP_024)
- Location: playwright\ui\forgot_password_ui.spec.ts:19:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByPlaceholder('Nhập mã 6 chữ số...')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByPlaceholder('Nhập mã 6 chữ số...') with timeout 5000ms
  - waiting for getByPlaceholder('Nhập mã 6 chữ số...')

```

```yaml
- img
- img
- img
- img
- link "MarketNest":
  - /url: /
  - heading "MarketNest" [level=2]
- heading "Khôi phục tài khoản của bạn." [level=1]
- paragraph: Đừng lo lắng — chỉ cần nhập email đã đăng ký, chúng tôi sẽ gửi mã xác nhận để giúp bạn đặt lại mật khẩu một cách an toàn.
- text: MN
- paragraph: Cộng đồng Nghệ nhân
- paragraph: Tôn vinh giá trị thủ công
- heading "Quên mật khẩu" [level=2]
- paragraph: Nhập email đã đăng ký để nhận mã xác nhận.
- text: Email
- textbox "Nhập địa chỉ email..."
- button "Gửi mã xác nhận"
- text: Đã nhớ mật khẩu?
- link "Đăng nhập ngay":
  - /url: /login
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Giao diện - Quên mật khẩu', () => {
  4  |   test('Hiển thị form quên mật khẩu với trường nhập email', async ({ page }) => {
  5  |     await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });
  6  | 
  7  |     await expect(page.getByRole('heading', { name: 'Quên mật khẩu' })).toBeVisible();
  8  |     await expect(page.getByPlaceholder('Nhập địa chỉ email...')).toBeVisible();
  9  |     await expect(page.getByRole('button', { name: /Gửi mã|Xác nhận|Gửi/i })).toBeVisible();
  10 |   });
  11 | 
  12 |   test('Hiển thị lỗi kiểm tra khi để trống email gửi yêu cầu', async ({ page }) => {
  13 |     await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });
  14 | 
  15 |     await page.getByRole('button', { name: /Gửi mã|Xác nhận|Gửi/i }).click();
  16 |     await expect(page.getByText('Email là bắt buộc')).toBeVisible();
  17 |   });
  18 | 
  19 |   test('Ô nhập mã OTP chỉ chấp nhận ký tự số và từ chối ký tự chữ "abcdef" (MKP_024)', async ({ page }) => {
  20 |     await page.goto('/reset-password?email=client@example.com', { waitUntil: 'domcontentloaded' });
  21 | 
  22 |     const otpInput = page.getByPlaceholder('Nhập mã 6 chữ số...');
> 23 |     await expect(otpInput).toBeVisible({ timeout: 5000 });
     |                            ^ Error: expect(locator).toBeVisible() failed
  24 | 
  25 |     await otpInput.fill('abcdef');
  26 | 
  27 |     // Kết quả mong đợi theo tài liệu kiểm thử MKP_024:
  28 |     // Không cho phép nhập chữ vào ô OTP (giá trị không được lưu là "abcdef")
  29 |     await expect(otpInput).not.toHaveValue('abcdef');
  30 |   });
  31 | });
  32 | 
```