import { test, expect } from '@playwright/test';
import { loginViaUI } from '../helpers/auth.helper';

/**
 * UC18: Ví điện tử - Kiểm thử giao diện người dùng (MKP_086, MKP_087, MKP_089, MKP_090)
 * Chú ý: Test case API MKP_088 đã được tách riêng vào playwright/api/wallet_api.spec.ts
 */
test.describe('UC18: Ví điện tử (UI)', () => {

  test('Hiển thị giao diện trang Ví điện tử với số dư, nút Nạp tiền và Rút tiền (MKP_086)', async ({ page }) => {
    await loginViaUI(page);
    await page.goto('/profile/wallet');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: /Ví điện tử của tôi/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Nạp tiền vào ví/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Rút tiền/i }).first()).toBeVisible();
  });

  test('Mở modal Nạp tiền, chọn mệnh giá nhanh 50.000 ₫ và cổng VNPAY (MKP_087)', async ({ page }) => {
    await loginViaUI(page);
    await page.goto('/profile/wallet');
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('button', { name: /Nạp tiền vào ví/i }).click();
    await expect(page.getByRole('heading', { name: /Nạp tiền vào ví điện tử/i })).toBeVisible({ timeout: 5000 });

    const vnpayRadio = page.locator('input[value="VNPAY"]');
    await vnpayRadio.check();
    await expect(vnpayRadio).toBeChecked();

    await page.getByRole('button', { name: '50.000 ₫' }).click();
    await expect(page.getByText('50.000 ₫').first()).toBeVisible();
  });

  test('Validation realtime trên modal Nạp tiền khi nhập số tiền nhỏ hơn 10.000 ₫ (MKP_089)', async ({ page }) => {
    await loginViaUI(page);
    await page.goto('/profile/wallet');
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('button', { name: /Nạp tiền vào ví/i }).click();
    await expect(page.getByRole('heading', { name: /Nạp tiền vào ví điện tử/i })).toBeVisible({ timeout: 5000 });

    const customInput = page.getByPlaceholder(/Nhập số tiền tối thiểu 10.000 ₫/i);
    await customInput.fill('5000');

    await expect(page.getByText('Số tiền nạp tối thiểu là 10.000 ₫')).toBeVisible({ timeout: 3000 });
  });

  test('Validation realtime và vô hiệu hóa nút gửi trên modal Rút tiền khi số tiền vượt quá số dư (MKP_090)', async ({ page }) => {
    await loginViaUI(page);
    await page.goto('/profile/wallet');
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('button', { name: /Rút tiền/i }).first().click();
    await expect(page.getByRole('heading', { name: /Yêu cầu rút tiền về tài khoản ngân hàng/i })).toBeVisible({ timeout: 5000 });

    const amountInput = page.getByPlaceholder(/Tối thiểu 10.000 ₫/i);
    await amountInput.fill('999999999');

    await expect(page.getByText(/không được vượt quá số dư khả dụng/i)).toBeVisible({ timeout: 3000 });

    const submitBtn = page.getByRole('button', { name: /Gửi yêu cầu rút tiền/i });
    await expect(submitBtn).toBeDisabled();
  });

});
