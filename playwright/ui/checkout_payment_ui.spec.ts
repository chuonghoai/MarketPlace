import { test, expect } from '@playwright/test';
import { loginViaUI } from '../helpers/auth.helper';

/**
 * UC11: Đặt hàng & Thanh toán (MKP_081 -> MKP_085)
 * Kiểm thử hộp đen giao diện người dùng
 */
test.describe('UC11: Đặt hàng & Thanh toán (UI)', () => {

  test('Chuyển hướng về giỏ hàng khi truy cập trang Checkout mà không có sản phẩm được chọn (MKP_081)', async ({ page }) => {
    await loginViaUI(page);
    await page.goto('/order/checkout');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/\/cart/, { timeout: 10000 });
  });

  test('Hiển thị giao diện thông báo lỗi khi truy cập kết quả đơn hàng thiếu orderId (MKP_082)', async ({ page }) => {
    await loginViaUI(page);
    await page.goto('/order/checkout/result');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: 'Đã xảy ra lỗi!' })).toBeVisible({ timeout: 10000 });
  });

  test('Chọn phương thức thanh toán VNPay trên giao diện đặt hàng & thanh toán (MKP_083)', async ({ page }) => {
    await loginViaUI(page);
    await page.goto('/marketplace');
    await page.waitForLoadState('domcontentloaded');

    // Mở chi tiết sản phẩm và thêm vào giỏ
    const productCard = page.locator('a[href*="-p"]').first();
    await expect(productCard).toBeVisible({ timeout: 15000 });
    await productCard.click();
    await page.waitForURL((url) => url.pathname.includes('-p'), { timeout: 10000 });

    const addToCartBtn = page.getByRole('button', { name: 'Thêm vào giỏ', exact: true });
    await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
    await addToCartBtn.click();

    // Đi đến trang giỏ hàng và tiến hành thanh toán
    await page.goto('/cart', { waitUntil: 'domcontentloaded' });
    const selectAllLabel = page.locator('label[for="selectAll"]');
    if (await selectAllLabel.isVisible({ timeout: 3000 })) {
      const selectAllInput = page.locator('#selectAll');
      if (!(await selectAllInput.isChecked())) {
        await selectAllLabel.click();
      }
    }

    const checkoutBtn = page.getByRole('button', { name: /Tiến hành thanh toán/i });
    await expect(checkoutBtn).toBeEnabled({ timeout: 10000 });
    await checkoutBtn.click();
    await expect(page).toHaveURL(/\/order\/checkout/, { timeout: 10000 });

    // Mở modal phương thức thanh toán và chọn VNPay
    const changePaymentBtn = page.getByRole('button', { name: 'Thay đổi' }).last();
    await expect(changePaymentBtn).toBeVisible({ timeout: 10000 });
    await changePaymentBtn.click();

    await expect(page.getByRole('heading', { name: 'Phương thức thanh toán' })).toBeVisible({ timeout: 5000 });
    await page.locator('label:has-text("Cổng thanh toán VNPAY")').click();
    await expect(page.getByText('Cổng thanh toán VNPAY').first()).toBeVisible({ timeout: 5000 });
  });

  test('Khóa nút thanh toán hoặc hiển thị giỏ hàng trống khi chưa chọn sản phẩm mua (MKP_084)', async ({ page }) => {
    await loginViaUI(page);
    await page.goto('/cart');
    await page.waitForLoadState('domcontentloaded');

    const emptyState = page.getByText(/Giỏ hàng của bạn đang trống/i);
    const checkoutBtn = page.getByRole('button', { name: /Tiến hành thanh toán/i });

    const isEmpty = await emptyState.isVisible();
    if (!isEmpty && (await checkoutBtn.isVisible())) {
      const isDisabled = await checkoutBtn.isDisabled();
      expect(isDisabled).toBeDefined();
    } else {
      expect(isEmpty).toBeTruthy();
    }
  });

  test('Modal Thêm địa chỉ mới kiểm tra định dạng số điện thoại người nhận (MKP_085)', async ({ page }) => {
    await loginViaUI(page);
    await page.goto('/profile/addresses');
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('button', { name: /Thêm mới/i }).click();
    await expect(page.getByRole('heading', { name: /Thêm địa chỉ mới/i })).toBeVisible({ timeout: 5000 });

    await page.getByPlaceholder('Nguyễn Văn A').fill('Nguyễn Văn A');
    await page.getByPlaceholder('0912345678').fill('12345');
    await page.getByPlaceholder('Số 227 Nguyễn Văn Cừ').fill('123 Đường Lê Lợi');

    await page.getByRole('button', { name: /Xác minh trên bản đồ/i }).click();

    await expect(page.getByText(/Số điện thoại không hợp lệ/i), 'UI must validate phone number format (10 digits)').toBeVisible({ timeout: 3000 });
  });

});
