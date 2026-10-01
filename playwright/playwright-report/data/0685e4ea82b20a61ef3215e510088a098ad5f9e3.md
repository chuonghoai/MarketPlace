# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\register_ui.spec.ts >> Giao diện - Đăng ký tài khoản >> Hiển thị thông báo lỗi thân thiện "Mã OTP không chính xác" khi nhập sai OTP (MKP_003)
- Location: playwright\ui\register_ui.spec.ts:28:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Mã OTP không chính xác/i)
Expected: visible
Timeout: 4000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText(/Mã OTP không chính xác/i) with timeout 4000ms
  - waiting for getByText(/Mã OTP không chính xác/i)

```

```yaml
- img
- img
- img
- img
- link "MarketNest":
  - /url: /
  - heading "MarketNest" [level=2]
- heading "Bắt đầu hành trình thủ công của bạn." [level=1]
- paragraph: Tham gia cộng đồng MarketNest ngay hôm nay để khám phá, sưu tầm hoặc chia sẻ những tác phẩm nghệ thuật độc bản của chính bạn với thế giới.
- text: MN
- paragraph: Cộng đồng Nghệ nhân
- paragraph: Tôn vinh giá trị thủ công
- heading "Đăng ký" [level=2]
- paragraph: Tạo tài khoản để trải nghiệm MarketNest.
- text: Email
- textbox "Nhập địa chỉ email...": wrong_otp_user@example.com
- button "Gửi mã"
- text: Mã xác nhận (OTP)
- textbox "Nhập mã 6 chữ số...": "000000"
- text: Mật khẩu
- textbox "Tạo mật khẩu...": Password123@
- text: Nhập lại mật khẩu
- textbox "Xác nhận lại mật khẩu...": Password123@
- text: Request failed with status code 400
- button "Đăng ký tài khoản"
- text: Hoặc
- button "Đăng ký bằng Google":
  - img
  - text: Đăng ký bằng Google
- text: Đã có tài khoản?
- link "Đăng nhập ngay":
  - /url: /login
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Giao diện - Đăng ký tài khoản', () => {
  4  |   test('Hiển thị đầy đủ các trường nhập liệu của form đăng ký (MKP_001)', async ({ page }) => {
  5  |     await page.goto('/register');
  6  | 
  7  |     await expect(page.getByRole('heading', { name: 'Đăng ký', exact: true })).toBeVisible();
  8  |     await expect(page.getByPlaceholder('Nhập địa chỉ email...')).toBeVisible();
  9  |     await expect(page.getByPlaceholder('Nhập mã 6 chữ số...')).toBeVisible();
  10 |     await expect(page.getByPlaceholder('Tạo mật khẩu...')).toBeVisible();
  11 |     await expect(page.getByPlaceholder('Xác nhận lại mật khẩu...')).toBeVisible();
  12 |     await expect(page.getByRole('button', { name: 'Đăng ký tài khoản' })).toBeVisible();
  13 |   });
  14 | 
  15 |   test('Hiển thị lỗi kiểm tra khi mật khẩu xác nhận không khớp (MKP_002)', async ({ page }) => {
  16 |     await page.goto('/register');
  17 | 
  18 |     await page.getByPlaceholder('Nhập địa chỉ email...').fill('test_mismatch@example.com');
  19 |     await page.getByPlaceholder('Nhập mã 6 chữ số...').fill('123456');
  20 |     await page.getByPlaceholder('Tạo mật khẩu...').fill('Password123@');
  21 |     await page.getByPlaceholder('Xác nhận lại mật khẩu...').fill('DifferentPassword123@');
  22 | 
  23 |     await page.getByRole('button', { name: 'Đăng ký tài khoản' }).click();
  24 | 
  25 |     await expect(page.getByText('Mật khẩu không khớp')).toBeVisible();
  26 |   });
  27 | 
  28 |   test('Hiển thị thông báo lỗi thân thiện "Mã OTP không chính xác" khi nhập sai OTP (MKP_003)', async ({ page }) => {
  29 |     await page.goto('/register');
  30 |     await page.getByPlaceholder('Nhập địa chỉ email...').fill('wrong_otp_user@example.com');
  31 |     await page.getByPlaceholder('Nhập mã 6 chữ số...').fill('000000');
  32 |     await page.getByPlaceholder('Tạo mật khẩu...').fill('Password123@');
  33 |     await page.getByPlaceholder('Xác nhận lại mật khẩu...').fill('Password123@');
  34 | 
  35 |     await page.getByRole('button', { name: 'Đăng ký tài khoản' }).click();
  36 | 
  37 |     // Kết quả mong đợi theo tài liệu kiểm thử MKP_003:
> 38 |     await expect(page.getByText(/Mã OTP không chính xác/i)).toBeVisible({ timeout: 4000 });
     |                                                             ^ Error: expect(locator).toBeVisible() failed
  39 |   });
  40 | });
  41 | 
```