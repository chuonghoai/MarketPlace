# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\login_ui.spec.ts >> Giao diện - Đăng nhập >> Chuyển hướng đến trang xác thực Google OAuth khi bấm Đăng nhập bằng Google (MKP_017)
- Location: playwright\ui\login_ui.spec.ts:25:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /accounts\.google\.com/
Received string:  "http://localhost:5173/login"
Timeout: 3000ms

Call log:
  - Expect "toHaveURL" with timeout 3000ms
    10 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://localhost:5173/login"

```

```yaml
- img
- img
- img
- img
- link "MarketNest":
  - /url: /
  - heading "MarketNest" [level=2]
- heading "Nơi mỗi sản phẩm kể một câu chuyện." [level=1]
- paragraph: Khám phá những món đồ thủ công độc bản, mang đậm dấu ấn cá nhân từ các nghệ nhân trên toàn thế giới. Trải nghiệm không gian mua sắm đậm chất nghệ thuật và sự chân thật.
- text: MN
- paragraph: Cộng đồng Nghệ nhân
- paragraph: Tôn vinh giá trị thủ công
- heading "Đăng nhập" [level=2]
- paragraph: Chào mừng bạn quay trở lại với MarketNest.
- text: Email hoặc Tên tài khoản
- textbox "Nhập địa chỉ email..."
- text: Mật khẩu
- textbox "Nhập mật khẩu..."
- link "Quên mật khẩu?":
  - /url: /forgot-password
- button "Đăng nhập"
- text: Hoặc
- button "Đăng nhập bằng Google":
  - img
  - text: Đăng nhập bằng Google
- text: Chưa có tài khoản?
- link "Đăng ký ngay":
  - /url: /register
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Giao diện - Đăng nhập', () => {
  4  |   test('Hiển thị đầy đủ các thành phần của form đăng nhập', async ({ page }) => {
  5  |     await page.goto('/login');
  6  | 
  7  |     // Kiểm tra các phần tử trên form đăng nhập
  8  |     await expect(page.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible();
  9  |     await expect(page.getByPlaceholder('Nhập địa chỉ email...')).toBeVisible();
  10 |     await expect(page.getByPlaceholder('Nhập mật khẩu...')).toBeVisible();
  11 |     await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toBeVisible();
  12 |   });
  13 | 
  14 |   test('Hiển thị thông báo lỗi kiểm tra khi gửi form trống', async ({ page }) => {
  15 |     await page.goto('/login');
  16 | 
  17 |     // Nhấn nút đăng nhập khi chưa nhập thông tin
  18 |     await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  19 | 
  20 |     // Mong đợi xuất hiện thông báo lỗi
  21 |     await expect(page.getByText('Email là bắt buộc')).toBeVisible();
  22 |     await expect(page.getByText('Mật khẩu là bắt buộc')).toBeVisible();
  23 |   });
  24 | 
  25 |   test('Chuyển hướng đến trang xác thực Google OAuth khi bấm Đăng nhập bằng Google (MKP_017)', async ({ page }) => {
  26 |     await page.goto('/login');
  27 |     const googleBtn = page.getByRole('button', { name: /Đăng nhập bằng Google/i });
  28 |     await expect(googleBtn).toBeVisible();
  29 |     await googleBtn.click();
  30 |     // Kết quả mong đợi theo đặc tả: Chuyển hướng tới trang Google OAuth
> 31 |     await expect(page).toHaveURL(/accounts\.google\.com/, { timeout: 3000 });
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  32 |   });
  33 | });
  34 | 
```