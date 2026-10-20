import { test, expect } from '@playwright/test';

test.describe('Giao diện - Đăng nhập', () => {
  // Test A — Login page renders correctly
  test('Test A — Login page renders correctly', async ({ page }) => {
    await page.goto('/login');

    // Verify login form elements are visible
    await expect(page.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Nhập địa chỉ email...')).toBeVisible();
    await expect(page.getByPlaceholder('Nhập mật khẩu...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toBeVisible();

    // Verify layout does not overflow horizontally
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  // MKP_017: Kiểm tra hiển thị mật khẩu: mặc định ẩn và toggle hiện/ẩn
  test('Kiểm tra hiển thị mật khẩu: mặc định ẩn với nút toggle hiện/ẩn (MKP_017)', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.getByPlaceholder('Nhập mật khẩu...');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Custom toggle button must exist and have type="button"
    const toggleBtn = page.getByRole('button', { name: 'Hiện mật khẩu' });
    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toHaveAttribute('type', 'button');
    await expect(toggleBtn).toHaveAttribute('aria-label', 'Hiện mật khẩu');
  });

  // Test C — Click Eye reveals password
  test('Test C — Click Eye reveals password', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.getByPlaceholder('Nhập mật khẩu...');
    await passwordInput.fill('password123');

    const toggleBtn = page.getByRole('button', { name: 'Hiện mật khẩu' });
    await toggleBtn.click();

    // Verify input type is text and value is preserved
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(passwordInput).toHaveValue('password123');

    // Verify aria-label switched to "Ẩn mật khẩu"
    const hideBtn = page.getByRole('button', { name: 'Ẩn mật khẩu' });
    await expect(hideBtn).toBeVisible();
  });

  // Test D — Click EyeOff hides password again
  test('Test D — Click EyeOff hides password again', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.getByPlaceholder('Nhập mật khẩu...');
    await passwordInput.fill('password123');

    // Reveal password
    const toggleBtn = page.getByRole('button', { name: 'Hiện mật khẩu' });
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Hide password again
    const hideBtn = page.getByRole('button', { name: 'Ẩn mật khẩu' });
    await hideBtn.click();

    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(passwordInput).toHaveValue('password123');
    await expect(page.getByRole('button', { name: 'Hiện mật khẩu' })).toBeVisible();
  });

  // Test E — Blur and refocus does not remove toggle
  test('Test E — Blur and refocus does not remove custom toggle', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.getByPlaceholder('Nhập mật khẩu...');
    await passwordInput.fill('password123');

    // Click outside to blur
    await page.getByRole('heading', { name: 'Đăng nhập', exact: true }).click();
    await page.waitForTimeout(200);

    // Click password field again
    await passwordInput.click();
    await page.waitForTimeout(200);

    // Custom toggle button must still exist and function
    const toggleBtn = page.getByRole('button', { name: /mật khẩu/i });
    await expect(toggleBtn).toBeVisible();

    // Verify toggle still switches type
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(passwordInput).toHaveValue('password123');
  });

  // Test F — Toggle does not submit form
  test('Test F — Toggle does not submit form', async ({ page }) => {
    await page.goto('/login');

    let loginRequestDispatched = false;
    page.on('request', (req) => {
      if (req.url().includes('/auth/login')) {
        loginRequestDispatched = true;
      }
    });

    const passwordInput = page.getByPlaceholder('Nhập mật khẩu...');
    await passwordInput.fill('password123');

    const toggleBtn = page.getByRole('button', { name: 'Hiện mật khẩu' });
    await toggleBtn.click();
    await page.waitForTimeout(500);

    // Verify still on /login and no login request was sent
    expect(page.url()).toContain('/login');
    expect(loginRequestDispatched).toBe(false);
  });

  // Test G — Password preserved through multiple toggles
  test('Test G — Password preserved through multiple toggles', async ({ page }) => {
    await page.goto('/login');

    const testPassword = 'TestPassword123!';
    const passwordInput = page.getByPlaceholder('Nhập mật khẩu...');
    await passwordInput.fill(testPassword);

    // Toggle 4 times: Eye -> EyeOff -> Eye -> EyeOff
    for (let i = 0; i < 4; i++) {
      const toggleBtn = page.getByRole('button', { name: /mật khẩu/i });
      await toggleBtn.click();
      await expect(passwordInput).toHaveValue(testPassword);
    }

    // Final state should be hidden and value unchanged
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(passwordInput).toHaveValue(testPassword);
  });

  // Test H — Actual login flow regression
  test('Test H — Actual login flow regression with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('Nhập địa chỉ email...').fill('client@example.com');
    await page.getByPlaceholder('Nhập mật khẩu...').fill('password123');

    // Toggle password visibility during login flow
    await page.getByRole('button', { name: 'Hiện mật khẩu' }).click();
    await expect(page.getByPlaceholder('Nhập mật khẩu...')).toHaveAttribute('type', 'text');
    await expect(page.getByPlaceholder('Nhập mật khẩu...')).toHaveValue('password123');

    // Submit login form
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

    // Verify successful login redirects away from /login
    await expect(page).not.toHaveURL(/\/login$/, { timeout: 10000 });
  });

  // Form validation regression test
  test('Hiển thị thông báo lỗi kiểm tra khi gửi form trống', async ({ page }) => {
    await page.goto('/login');

    // Nhấn nút đăng nhập khi chưa nhập thông tin
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

    // Mong đợi xuất hiện thông báo lỗi
    await expect(page.getByText('Email là bắt buộc')).toBeVisible();
    await expect(page.getByText('Mật khẩu là bắt buộc')).toBeVisible();
  });

  // Google OAuth button presence
  test('Hiển thị nút Đăng nhập bằng Google trên trang đăng nhập', async ({ page }) => {
    await page.goto('/login');
    const googleBtn = page.getByRole('button', { name: /Đăng nhập bằng Google/i });
    await expect(googleBtn).toBeVisible();
  });

  // Responsive Layout Verifications
  const viewports = [
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 812 },
  ];

  for (const vp of viewports) {
    test(`Responsive Verification - ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/login');

      // Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

      // Verify form elements remain visible and within view
      const emailInput = page.getByPlaceholder('Nhập địa chỉ email...');
      const passwordInput = page.getByPlaceholder('Nhập mật khẩu...');
      const submitBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
      const toggleBtn = page.getByRole('button', { name: 'Hiện mật khẩu' });

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(submitBtn).toBeVisible();
      await expect(toggleBtn).toBeVisible();

      // Verify toggle button is positioned inside the password input bounds
      const btnBox = await toggleBtn.boundingBox();
      const inputBox = await passwordInput.boundingBox();
      expect(btnBox).not.toBeNull();
      expect(inputBox).not.toBeNull();
      if (btnBox && inputBox) {
        expect(btnBox.x).toBeGreaterThan(inputBox.x);
        expect(btnBox.x + btnBox.width).toBeLessThanOrEqual(inputBox.x + inputBox.width + 1);
      }
    });
  }
});
