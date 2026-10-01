# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\cart_ui.spec.ts >> Giao diện - Giỏ hàng >> Vô hiệu hóa nút "+" hoặc cảnh báo khi số lượng đạt mức tồn kho tối đa (MKP_007)
- Location: playwright\ui\cart_ui.spec.ts:51:7

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator:  getByRole('button', { name: 'Increase quantity' }).first()
Expected: disabled
Received: enabled
Timeout:  3000ms

Call log:
  - Expect "toBeDisabled" getByRole('button', { name: 'Increase quantity' }).first() with timeout 3000ms
  - waiting for getByRole('button', { name: 'Increase quantity' }).first()
    10 × locator resolved to <button aria-label="Increase quantity" class="w-11 md:w-auto md:px-3 h-full md:py-1.5 flex items-center justify-center text-gray-600 hover:bg-[#FFFBF5] hover:text-[#C2410C] disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 rounded-r-[4px] transition-colors">+</button>
       - unexpected value "enabled"

```

```yaml
- button "Increase quantity": +
```

# Test source

```ts
  1  | import { test, expect, Page } from '@playwright/test';
  2  | import { loginViaUI } from '../helpers/auth.helper';
  3  | 
  4  | // Hàm kiểm tra giỏ hàng: nếu chưa có sản phẩm nào thì tự động thêm từ sàn trước khi test
  5  | async function ensureCartHasItem(page: Page) {
  6  |   await page.goto('/cart', { waitUntil: 'domcontentloaded' });
  7  | 
  8  |   const emptyState = page.getByRole('heading', { name: 'Giỏ hàng của bạn đang trống' });
  9  |   const itemInCart = page.locator('button[aria-label="Xóa khỏi giỏ hàng"]').first();
  10 | 
  11 |   // Đợi cho giỏ hàng tải xong dữ liệu từ backend (hiển thị trạng thái rỗng hoặc có ít nhất 1 sản phẩm)
  12 |   await Promise.race([
  13 |     emptyState.waitFor({ state: 'visible', timeout: 10000 }),
  14 |     itemInCart.waitFor({ state: 'visible', timeout: 10000 }),
  15 |   ]).catch(() => {});
  16 | 
  17 |   if (await emptyState.isVisible()) {
  18 |     // Nếu chưa có item trong giỏ, điều hướng tới sàn để chọn mua sản phẩm
  19 |     await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
  20 | 
  21 |     const productCard = page.locator('a[href*="-p"]').first();
  22 |     await expect(productCard).toBeVisible({ timeout: 15000 });
  23 |     await productCard.click();
  24 |     await page.waitForURL((url) => url.pathname.includes('-p'), { timeout: 10000 });
  25 | 
  26 |     // Nhấn "Thêm vào giỏ"
  27 |     const addToCartBtn = page.getByRole('button', { name: 'Thêm vào giỏ', exact: true });
  28 |     await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
  29 |     await addToCartBtn.click();
  30 | 
  31 |     // Quay lại giỏ hàng
  32 |     await page.goto('/cart', { waitUntil: 'domcontentloaded' });
  33 |   }
  34 | 
  35 |   // Đảm bảo giao diện giỏ hàng đã có sản phẩm
  36 |   await expect(itemInCart).toBeVisible({ timeout: 15000 });
  37 |   await expect(page.getByText('Tóm tắt đơn hàng')).toBeVisible({ timeout: 15000 });
  38 | }
  39 | 
  40 | test.describe('Giao diện - Giỏ hàng', () => {
  41 |   test.beforeEach(async ({ page }) => {
  42 |     await loginViaUI(page);
  43 |     await ensureCartHasItem(page);
  44 |   });
  45 | 
  46 |   test('Hiển thị giao diện giỏ hàng và bảng tóm tắt đơn hàng (MKP_010)', async ({ page }) => {
  47 |     await expect(page.getByText('Tóm tắt đơn hàng')).toBeVisible({ timeout: 10000 });
  48 |     await expect(page.getByText('Tổng tiền')).toBeVisible();
  49 |   });
  50 | 
  51 |   test('Vô hiệu hóa nút "+" hoặc cảnh báo khi số lượng đạt mức tồn kho tối đa (MKP_007)', async ({ page }) => {
  52 |     const plusBtn = page.getByRole('button', { name: 'Increase quantity' }).first();
  53 |     await expect(plusBtn).toBeVisible({ timeout: 10000 });
  54 | 
  55 |     // Kết quả mong đợi theo tài liệu kiểm thử MKP_007:
  56 |     // Khi đạt tối đa tồn kho, nút tăng số lượng phải bị vô hiệu hóa
> 57 |     await expect(plusBtn).toBeDisabled({ timeout: 3000 });
     |                           ^ Error: expect(locator).toBeDisabled() failed
  58 |   });
  59 | });
  60 | 
```