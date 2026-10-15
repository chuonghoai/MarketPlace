import { test, expect } from '@playwright/test';

test.describe('Giao diện - Quên mật khẩu', () => {
  // Test A — Info Box visible on Desktop
  test('Test A — Info Box visible on Desktop (1280x720)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });

    // Verify forgot password page heading visible
    await expect(page.getByRole('heading', { name: /Quên mật khẩu|Forgot Password/i })).toBeVisible();

    // Verify Info Box is visible
    const infoBox = page.getByRole('note');
    await expect(infoBox).toBeVisible();

    // Verify info text is visible inside Info Box
    await expect(infoBox.getByText(/email/i)).toBeVisible();

    // Verify email input is visible
    const emailInput = page.getByPlaceholder(/Nhập địa chỉ email|Enter your email/i);
    await expect(emailInput).toBeVisible();

    // Verify submit button is visible
    const submitButton = page.getByRole('button', { name: /Gửi mã|Xác nhận|Gửi|Send/i });
    await expect(submitButton).toBeVisible();
  });

  // Test B — Info Box visible on Mobile
  test('Test B — Info Box visible on Mobile (375x812)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });

    // Verify Info Box remains visible
    const infoBox = page.getByRole('note');
    await expect(infoBox).toBeVisible();

    // Verify instructions are not hidden
    await expect(infoBox.getByText(/OTP/i)).toBeVisible();

    // Verify email input and submit button visible
    const emailInput = page.getByPlaceholder(/Nhập địa chỉ email|Enter your email/i);
    await expect(emailInput).toBeVisible();

    const submitButton = page.getByRole('button', { name: /Gửi mã|Xác nhận|Gửi|Send/i });
    await expect(submitButton).toBeVisible();

    // Verify no horizontal overflow
    const isOverflowFree = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
    });
    expect(isOverflowFree).toBe(true);
  });

  // Test C — Instruction content
  test('Test C — Instruction content contains email, OTP, and 6-digit notice', async ({ page }) => {
    await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });

    const infoBox = page.getByRole('note');
    await expect(infoBox).toBeVisible();

    const infoText = await infoBox.innerText();
    expect(infoText).toMatch(/email/i);
    expect(infoText).toMatch(/OTP/i);
    expect(infoText).toMatch(/6\s*(?:chữ số|digit)/i);
  });

  // Test D — Forgot Password flow regression
  test('Test D — Forgot Password flow regression with valid submission', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    let apiRequested = false;
    await page.route('**/auth/send-otp', async (route) => {
      apiRequested = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Mã OTP đã được gửi đến email: client@example.com',
          data: null,
        }),
      });
    });

    await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });

    const emailInput = page.getByPlaceholder(/Nhập địa chỉ email|Enter your email/i);
    await emailInput.fill('client@example.com');

    const submitButton = page.getByRole('button', { name: /Gửi mã|Xác nhận|Gửi|Send/i });
    await submitButton.click();

    // Verify request was dispatched
    await expect.poll(() => apiRequested).toBe(true);

    // Verify navigation to /reset-password
    await expect(page).toHaveURL(/\/reset-password/, { timeout: 7000 });

    // Verify no JavaScript unhandled errors
    expect(pageErrors).toEqual([]);
  });

  // Test E — Responsive Verification across Desktop, Tablet, and Mobile
  const responsiveViewports = [
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 812 },
  ];

  for (const vp of responsiveViewports) {
    test(`Test E — Responsive layout on ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });

      // Verify no horizontal overflow
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

      // Verify Info Box is visible and fully within viewport bounds
      const infoBox = page.getByRole('note');
      await expect(infoBox).toBeVisible();
      const boxRect = await infoBox.boundingBox();
      expect(boxRect).not.toBeNull();
      if (boxRect) {
        expect(boxRect.x).toBeGreaterThanOrEqual(0);
        expect(boxRect.x + boxRect.width).toBeLessThanOrEqual(vp.width + 1);
      }

      // Verify input is visible and not clipped
      const emailInput = page.getByPlaceholder(/Nhập địa chỉ email|Enter your email/i);
      await expect(emailInput).toBeVisible();
      const inputRect = await emailInput.boundingBox();
      expect(inputRect).not.toBeNull();
      if (inputRect) {
        expect(inputRect.x).toBeGreaterThanOrEqual(0);
        expect(inputRect.x + inputRect.width).toBeLessThanOrEqual(vp.width + 1);
      }

      // Verify submit button is visible and not clipped
      const submitBtn = page.getByRole('button', { name: /Gửi mã|Xác nhận|Gửi|Send/i });
      await expect(submitBtn).toBeVisible();
      const btnRect = await submitBtn.boundingBox();
      expect(btnRect).not.toBeNull();
      if (btnRect) {
        expect(btnRect.x).toBeGreaterThanOrEqual(0);
        expect(btnRect.x + btnRect.width).toBeLessThanOrEqual(vp.width + 1);
      }
    });
  }

  // Existing tests
  test('Hiển thị form quên mật khẩu với trường nhập email', async ({ page }) => {
    await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /Quên mật khẩu|Forgot Password/i })).toBeVisible();
    await expect(page.getByPlaceholder(/Nhập địa chỉ email|Enter your email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Gửi mã|Xác nhận|Gửi|Send/i })).toBeVisible();
  });

  test('Hiển thị lỗi kiểm tra khi để trống email gửi yêu cầu', async ({ page }) => {
    await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });

    await page.getByRole('button', { name: /Gửi mã|Xác nhận|Gửi|Send/i }).click();
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
