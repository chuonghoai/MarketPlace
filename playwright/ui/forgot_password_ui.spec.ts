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

test.describe('Giao diện - Đặt lại mật khẩu (MKP-024)', () => {
  const resetPasswordUrl = '/reset-password?email=client@example.com';

  // Test A — OTP rejects alphabetic input
  test('Test A — OTP rejects alphabetic input', async ({ page }) => {
    await page.goto(resetPasswordUrl, { waitUntil: 'domcontentloaded' });
    const otpInput = page.getByPlaceholder(/Nhập mã 6 chữ số|Enter 6-digit code/i);
    await expect(otpInput).toBeVisible();

    await otpInput.fill('abcdef');
    await expect(otpInput).not.toHaveValue('abcdef');
    await expect(otpInput).toHaveValue('');
  });

  // Test B — OTP accepts digits
  test('Test B — OTP accepts digits', async ({ page }) => {
    await page.goto(resetPasswordUrl, { waitUntil: 'domcontentloaded' });
    const otpInput = page.getByPlaceholder(/Nhập mã 6 chữ số|Enter 6-digit code/i);
    await expect(otpInput).toBeVisible();

    await otpInput.fill('123456');
    await expect(otpInput).toHaveValue('123456');
  });

  // Test C — OTP limits to 6 digits
  test('Test C — OTP limits to 6 digits', async ({ page }) => {
    await page.goto(resetPasswordUrl, { waitUntil: 'domcontentloaded' });
    const otpInput = page.getByPlaceholder(/Nhập mã 6 chữ số|Enter 6-digit code/i);
    await expect(otpInput).toBeVisible();

    await otpInput.fill('123456789');
    await expect(otpInput).toHaveValue('123456');
  });

  // Test D — OTP validation
  test('Test D — OTP validation shows error for fewer than 6 digits', async ({ page }) => {
    await page.goto(resetPasswordUrl, { waitUntil: 'domcontentloaded' });
    const otpInput = page.getByPlaceholder(/Nhập mã 6 chữ số|Enter 6-digit code/i);
    await expect(otpInput).toBeVisible();

    await otpInput.fill('12345');
    const submitBtn = page.getByRole('button', { name: /Đặt lại mật khẩu|Reset Password/i });
    await submitBtn.click();

    await expect(page.getByText(/OTP phải gồm đúng 6 chữ số|OTP must contain exactly 6 digits/i)).toBeVisible();
  });

  // Test E — OTP paste sanitization
  test('Test E — OTP paste sanitization strips non-digits and limits to 6', async ({ page }) => {
    await page.goto(resetPasswordUrl, { waitUntil: 'domcontentloaded' });
    const otpInput = page.getByPlaceholder(/Nhập mã 6 chữ số|Enter 6-digit code/i);
    await expect(otpInput).toBeVisible();

    // Trigger paste event with 'abc123456xyz'
    await page.evaluate(() => {
      const input = document.querySelector<HTMLInputElement>('input[inputmode="numeric"]');
      if (input) {
        input.focus();
        const dt = new DataTransfer();
        dt.setData('text/plain', 'abc123456xyz');
        const pasteEvent = new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: dt,
        });
        input.dispatchEvent(pasteEvent);
      }
    });

    await expect(otpInput).toHaveValue('123456');
  });

  // Test F — New password visibility
  test('Test F — New password visibility toggle', async ({ page }) => {
    await page.goto(resetPasswordUrl, { waitUntil: 'domcontentloaded' });
    const newPasswordInput = page.getByPlaceholder(/Nhập mật khẩu mới\.\.\.|Enter new password\.\.\./i);
    await expect(newPasswordInput).toBeVisible();
    await expect(newPasswordInput).toHaveAttribute('type', 'password');

    await newPasswordInput.fill('Secret123!');

    const toggleBtn = page.getByRole('button', { name: /Hiện mật khẩu$/i });
    await expect(toggleBtn).toBeVisible();

    await toggleBtn.click();
    await expect(newPasswordInput).toHaveAttribute('type', 'text');
    await expect(newPasswordInput).toHaveValue('Secret123!');

    const hideBtn = page.getByRole('button', { name: /Ẩn mật khẩu$/i });
    await expect(hideBtn).toBeVisible();

    await hideBtn.click();
    await expect(newPasswordInput).toHaveAttribute('type', 'password');
    await expect(newPasswordInput).toHaveValue('Secret123!');
  });

  // Test G — Confirm password visibility
  test('Test G — Confirm password visibility toggle', async ({ page }) => {
    await page.goto(resetPasswordUrl, { waitUntil: 'domcontentloaded' });
    const confirmPasswordInput = page.getByPlaceholder(/Nhập lại mật khẩu mới\.\.\.|Re-enter new password\.\.\./i);
    await expect(confirmPasswordInput).toBeVisible();
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    await confirmPasswordInput.fill('Secret123!');

    const toggleBtn = page.getByRole('button', { name: /Hiện mật khẩu xác nhận/i });
    await expect(toggleBtn).toBeVisible();

    await toggleBtn.click();
    await expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    await expect(confirmPasswordInput).toHaveValue('Secret123!');

    const hideBtn = page.getByRole('button', { name: /Ẩn mật khẩu xác nhận/i });
    await expect(hideBtn).toBeVisible();

    await hideBtn.click();
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    await expect(confirmPasswordInput).toHaveValue('Secret123!');
  });

  // Test H — Toggle survives blur/refocus
  test('Test H — Toggle survives blur/refocus', async ({ page }) => {
    await page.goto(resetPasswordUrl, { waitUntil: 'domcontentloaded' });
    const newPasswordInput = page.getByPlaceholder(/Nhập mật khẩu mới\.\.\.|Enter new password\.\.\./i);
    await newPasswordInput.fill('Pass123456');

    // Blur
    await newPasswordInput.blur();

    // Refocus
    await newPasswordInput.focus();

    // Verify toggle still exists and works
    const toggleBtn = page.getByRole('button', { name: /Hiện mật khẩu$/i });
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();

    await expect(newPasswordInput).toHaveAttribute('type', 'text');
    await expect(newPasswordInput).toHaveValue('Pass123456');
  });

  // Test I — Eye button does not submit
  test('Test I — Eye button does not trigger form submit', async ({ page }) => {
    await page.goto(resetPasswordUrl, { waitUntil: 'domcontentloaded' });

    let submitRequested = false;
    await page.route('**/auth/**', async (route) => {
      submitRequested = true;
      await route.continue();
    });

    const toggleBtn = page.getByRole('button', { name: /Hiện mật khẩu$/i });
    await toggleBtn.click();

    // Verify URL does not change and no request sent
    await expect(page).toHaveURL(/reset-password/);
    expect(submitRequested).toBe(false);
  });

  // Test J — OTP guidance visible on Desktop and Mobile
  for (const vp of [{ name: 'Desktop', width: 1280, height: 720 }, { name: 'Mobile', width: 375, height: 812 }]) {
    test(`Test J — OTP guidance visible on ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(resetPasswordUrl, { waitUntil: 'domcontentloaded' });

      const guidanceNote = page.getByRole('note');
      await expect(guidanceNote).toBeVisible();
      await expect(guidanceNote.getByText(/Spam|Thư rác/i)).toBeVisible();

      // Check no horizontal overflow
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  }

  // Test K — Existing reset password flow
  test('Test K — Existing valid reset password flow succeeds', async ({ page }) => {
    let apiCalled = false;
    await page.route('**/auth/forgot-password', async (route) => {
      apiCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập.',
          data: null,
        }),
      });
    });

    await page.goto(resetPasswordUrl, { waitUntil: 'domcontentloaded' });

    await page.getByPlaceholder(/Nhập mã 6 chữ số|Enter 6-digit code/i).fill('123456');
    await page.getByPlaceholder(/Nhập mật khẩu mới\.\.\.|Enter new password\.\.\./i).fill('NewSecret123');
    await page.getByPlaceholder(/Nhập lại mật khẩu mới\.\.\.|Re-enter new password\.\.\./i).fill('NewSecret123');

    await page.getByRole('button', { name: /Đặt lại mật khẩu|Reset Password/i }).click();

    await expect.poll(() => apiCalled).toBe(true);
    await expect(page).toHaveURL(/\/login/, { timeout: 7000 });
  });
});
