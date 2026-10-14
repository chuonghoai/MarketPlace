import { test, expect, Page } from '@playwright/test';
import { loginViaUI } from '../helpers/auth.helper';

// Hàm kiểm tra giỏ hàng: nếu chưa có sản phẩm nào thì tự động thêm từ sàn trước khi test
async function ensureCartHasItem(page: Page) {
  await page.goto('/cart', { waitUntil: 'domcontentloaded' });

  const emptyState = page.getByRole('heading', { name: 'Giỏ hàng của bạn đang trống' });
  const itemInCart = page.locator('button[aria-label="Xóa khỏi giỏ hàng"]').first();

  // Đợi cho giỏ hàng tải xong dữ liệu từ backend (hiển thị trạng thái rỗng hoặc có ít nhất 1 sản phẩm)
  await Promise.race([
    emptyState.waitFor({ state: 'visible', timeout: 10000 }),
    itemInCart.waitFor({ state: 'visible', timeout: 10000 }),
  ]).catch(() => {});

  if (await emptyState.isVisible()) {
    // Nếu chưa có item trong giỏ, điều hướng tới sàn để chọn mua sản phẩm
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });

    const productCard = page.locator('a[href*="-p"]').first();
    await expect(productCard).toBeVisible({ timeout: 15000 });
    await productCard.click();
    await page.waitForURL((url) => url.pathname.includes('-p'), { timeout: 10000 });

    // Nhấn "Thêm vào giỏ"
    const addToCartBtn = page.getByRole('button', { name: 'Thêm vào giỏ', exact: true });
    await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
    await addToCartBtn.click();

    // Quay lại giỏ hàng
    await page.goto('/cart', { waitUntil: 'domcontentloaded' });
  }

  // Đảm bảo giao diện giỏ hàng đã có sản phẩm
  await expect(itemInCart).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Tóm tắt đơn hàng')).toBeVisible({ timeout: 15000 });
}

test.describe('Giao diện - Giỏ hàng', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page);
    await ensureCartHasItem(page);
  });

  test('Hiển thị giao diện giỏ hàng và bảng tóm tắt đơn hàng (MKP_010)', async ({ page }) => {
    await expect(page.getByText('Tóm tắt đơn hàng')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Tổng tiền')).toBeVisible();
  });

  test('Vô hiệu hóa nút "+" hoặc cảnh báo khi số lượng đạt mức tồn kho tối đa (MKP_007)', async ({ page }) => {
    const plusBtn = page.getByRole('button', { name: 'Increase quantity' }).first();
    await expect(plusBtn).toBeVisible({ timeout: 10000 });

    // Kết quả mong đợi theo tài liệu kiểm thử MKP_007:
    // Khi đạt tối đa tồn kho, nút tăng số lượng phải bị vô hiệu hóa
    await expect(plusBtn).toBeDisabled({ timeout: 3000 });
  });
});
