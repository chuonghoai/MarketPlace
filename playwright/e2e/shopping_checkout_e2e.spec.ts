import { test, expect } from '@playwright/test';
import { loginViaUI } from '../helpers/auth.helper';

test.describe('E2E - Quy trình mua sắm và thanh toán', () => {
  test('Người dùng duyệt sản phẩm, xem chi tiết, thêm vào giỏ và tiến hành thanh toán (MKP_006, MKP_010)', async ({ page }) => {
    // 1. Đăng nhập qua giao diện người dùng
    await loginViaUI(page);

    // 2. Truy cập sàn thương mại
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });

    // 3. Nhấp vào sản phẩm đầu tiên
    const productCard = page.locator('a[href*="-p"]').first();
    await expect(productCard).toBeVisible({ timeout: 15000 });
    await productCard.click();
    await page.waitForURL((url) => url.pathname.includes('-p'), { timeout: 10000 });

    // 4. Tại trang chi tiết sản phẩm, nhấn "Thêm vào giỏ"
    const addToCartBtn = page.getByRole('button', { name: 'Thêm vào giỏ', exact: true });
    await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
    await addToCartBtn.click();

    // 5. Chuyển sang trang Giỏ hàng
    await page.goto('/cart', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Tóm tắt đơn hàng')).toBeVisible({ timeout: 10000 });

    // 6. Đảm bảo chọn tất cả sản phẩm
    const selectAllLabel = page.locator('label[for="selectAll"]');
    if (await selectAllLabel.isVisible({ timeout: 3000 })) {
      const selectAllInput = page.locator('#selectAll');
      if (!(await selectAllInput.isChecked())) {
        await selectAllLabel.click();
      }
    }

    // 7. Nhấn nút Tiến hành thanh toán
    const checkoutBtn = page.getByRole('button', { name: /Tiến hành thanh toán/i });
    await expect(checkoutBtn).toBeEnabled({ timeout: 10000 });
    await checkoutBtn.click();

    // 8. Kiểm tra chuyển hướng thành công đến trang thanh toán
    await expect(page).toHaveURL(/\/order\/checkout/, { timeout: 10000 });
  });
});
