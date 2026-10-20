import { test, expect, Page } from '@playwright/test';
import { loginViaUI, getAuthToken } from '../helpers/auth.helper';

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

  test('Vô hiệu hóa nút "+" hoặc cảnh báo khi số lượng đạt mức tồn kho tối đa (MKP_007)', async ({ page, request }) => {
    const plusBtn = page.getByTestId('cart-increase-quantity').first();
    await expect(plusBtn).toBeVisible({ timeout: 10000 });

    const token = await getAuthToken(request);
    const cartRes = await request.get('http://127.0.0.1:3000/cart/items', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const cartData = await cartRes.json();
    const items = cartData.data || [];
    expect(items.length).toBeGreaterThan(0);

    const firstItem = items[0];
    const stock = Number(firstItem.product?.stock ?? 10);
    const productId = firstItem.product?.id || firstItem.productId;

    // 1. Khi quantity < stock: nút tăng phải enabled
    if (firstItem.quantity < stock) {
      await expect(plusBtn).toBeEnabled();
    }

    // 2. Cập nhật quantity đạt tối đa tồn kho để kiểm tra vô hiệu hóa
    const updateRes = await request.put(`http://127.0.0.1:3000/cart/items/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { quantity: stock },
    });
    expect([200, 400]).toContain(updateRes.status());

    // Tải lại trang giỏ hàng để cập nhật trạng thái mới nhất
    await page.reload({ waitUntil: 'domcontentloaded' });
    const refreshedPlusBtn = page.getByTestId('cart-increase-quantity').first();
    await expect(refreshedPlusBtn).toBeVisible({ timeout: 10000 });

    // Khi quantity == stock: nút tăng phải bị disabled theo đúng requirement MKP_007
    await expect(refreshedPlusBtn).toBeDisabled({ timeout: 5000 });

    // 3. Khi vượt quá tồn kho: backend từ chối trả về 400
    const overStockRes = await request.put(`http://127.0.0.1:3000/cart/items/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { quantity: stock + 1000 },
    });
    expect(overStockRes.status()).toBe(400);

    // Khôi phục lại số lượng về 1 để giữ trạng thái an toàn cho các test khác
    await request.put(`http://127.0.0.1:3000/cart/items/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { quantity: 1 },
    });
  });
});
