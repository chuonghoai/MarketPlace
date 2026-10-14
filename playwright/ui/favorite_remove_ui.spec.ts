import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from '../helpers/auth.helper';

const BACKEND_URL = 'http://127.0.0.1:3000';
const PHEU_DAN_TRE_ID = 'e2f6a99e-0fa6-4928-b846-1e7cd29f7ea4';
const GIO_DAN_MAY_ID = '79268256-cf4c-4a67-a324-f319569b0daf';

let cachedToken = '';

async function getBackendToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEST_USERS.client),
  });
  const data = await res.json();
  cachedToken = data.data?.accessToken || data.data?.token || '';
  return cachedToken;
}

async function ensureProductInWishlist(productId: string) {
  const token = await getBackendToken();
  const res = await fetch(`${BACKEND_URL}/users/me/wishlist?page=1&pageSize=40`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const items: Array<{ id: string }> = data.data?.items || [];
  const exists = items.some((item) => item.id === productId);
  if (!exists) {
    await fetch(`${BACKEND_URL}/products/${productId}/favorite`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

async function removeProductFromWishlist(productId: string) {
  const token = await getBackendToken();
  const res = await fetch(`${BACKEND_URL}/users/me/wishlist?page=1&pageSize=40`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const items: Array<{ id: string }> = data.data?.items || [];
  const exists = items.some((item) => item.id === productId);
  if (exists) {
    await fetch(`${BACKEND_URL}/products/${productId}/favorite`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

async function checkProductInWishlist(productId: string): Promise<boolean> {
  const token = await getBackendToken();
  const res = await fetch(`${BACKEND_URL}/users/me/wishlist?page=1&pageSize=40`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const items: Array<{ id: string }> = data.data?.items || [];
  return items.some((item) => item.id === productId);
}

test.describe('MKP-055: Nút trái tim danh sách yêu thích & Bỏ yêu thích', () => {
  test.beforeEach(async ({ page }) => {
    // Luôn đảm bảo sản phẩm Phễu đan tre có trong danh sách yêu thích trước mỗi test
    await ensureProductInWishlist(PHEU_DAN_TRE_ID);
    await loginViaUI(page);
  });

  test.afterEach(async () => {
    // Đảm bảo Phễu đan tre luôn được giữ trong danh sách yêu thích của tài khoản test
    await ensureProductInWishlist(PHEU_DAN_TRE_ID);
  });

  test('Test A — Bỏ yêu thích thành công: thẻ biến mất, hiển thị toast, không chuyển hướng', async ({ page }) => {
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/profile\/dashboard/);

    // Xác nhận sản phẩm "Phễu đan tre" đang xuất hiện trong danh sách yêu thích
    const pheuCard = page.locator('a', { hasText: 'Phễu đan tre' });
    await expect(pheuCard).toBeVisible({ timeout: 10000 });

    const heartBtn = pheuCard.getByRole('button', { name: 'Bỏ yêu thích sản phẩm' });
    await expect(heartBtn).toBeVisible();

    // Click nút trái tim
    await heartBtn.click();

    // 1. URL không bị chuyển hướng sang trang chi tiết sản phẩm
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/profile/dashboard');

    // 2. Thẻ sản phẩm biến mất khỏi danh sách ngay tại chỗ
    await expect(pheuCard).not.toBeVisible({ timeout: 5000 });

    // 3. Hiển thị thông báo toast thành công
    const toast = page.locator('.fixed').getByText(/Đã xóa khỏi bộ sưu tập yêu thích|thành công/i);
    await expect(toast).toBeVisible({ timeout: 5000 });

    // 4. Xác minh với backend thật: sản phẩm đã không còn trong wishlist
    const inWishlist = await checkProductInWishlist(PHEU_DAN_TRE_ID);
    expect(inWishlist).toBeFalsy();
  });

  test('Test B — Không điều hướng khi nhấn nút trái tim (kiểm tra async navigation)', async ({ page }) => {
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/profile\/dashboard/);

    const pheuCard = page.locator('a', { hasText: 'Phễu đan tre' });
    await expect(pheuCard).toBeVisible({ timeout: 10000 });

    const initialUrl = page.url();
    const heartBtn = pheuCard.getByRole('button', { name: 'Bỏ yêu thích sản phẩm' });

    // Click nút trái tim
    await heartBtn.click();

    // Chờ 2 giây để chắc chắn không phát sinh điều hướng trễ/bất đồng bộ
    await page.waitForTimeout(2000);
    expect(page.url()).toBe(initialUrl);
    expect(page.url()).not.toContain('pheu-dan-tre');
  });

  test('Test C — Điều hướng của thẻ vẫn hoạt động khi nhấn vào tên hoặc ảnh sản phẩm', async ({ page }) => {
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/profile\/dashboard/);

    const pheuCard = page.locator('a', { hasText: 'Phễu đan tre' });
    await expect(pheuCard).toBeVisible({ timeout: 10000 });

    // Click vào tên sản phẩm (không phải nút trái tim)
    const title = pheuCard.getByText('Phễu đan tre');
    await title.click();

    // Xác nhận trình duyệt chuyển hướng đúng sang trang chi tiết sản phẩm
    await page.waitForURL(/.*pheu-dan-tre.*/, { timeout: 10000 });
    expect(page.url()).toContain('pheu-dan-tre');
    await expect(page.getByRole('heading', { name: 'Phễu đan tre' })).toBeVisible({ timeout: 10000 });
  });

  test('Test D — API bỏ yêu thích thất bại: hiển thị thông báo lỗi, giữ nguyên thẻ trong state', async ({ page }) => {
    // Mock API thất bại (status 500)
    await page.route(`**/products/${PHEU_DAN_TRE_ID}/favorite`, (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: {
            code: 'SYSTEM_ERROR',
            message: 'Lỗi hệ thống khi bỏ yêu thích',
          },
        }),
      });
    });

    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/profile\/dashboard/);

    const pheuCard = page.locator('a', { hasText: 'Phễu đan tre' });
    await expect(pheuCard).toBeVisible({ timeout: 10000 });

    const heartBtn = pheuCard.getByRole('button', { name: 'Bỏ yêu thích sản phẩm' });
    await heartBtn.click();

    // Xác nhận hiển thị thông báo lỗi
    const errorToast = page.locator('.fixed').getByText(/Lỗi hệ thống khi bỏ yêu thích|Không thể bỏ yêu thích/i);
    await expect(errorToast).toBeVisible({ timeout: 5000 });

    // Xác nhận thẻ sản phẩm KHÔNG bị xóa khỏi danh sách
    await expect(pheuCard).toBeVisible();

    // Hủy mock và thử lại thành công
    await page.unroute(`**/products/${PHEU_DAN_TRE_ID}/favorite`);
    await heartBtn.click();

    // Thẻ biến mất khi request thật thành công
    await expect(pheuCard).not.toBeVisible({ timeout: 5000 });
  });

  test('Test E — Double-click và xử lý độc lập giữa các thẻ sản phẩm', async ({ page }) => {
    // Đảm bảo có cả 2 sản phẩm trong wishlist
    await ensureProductInWishlist(GIO_DAN_MAY_ID);

    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/profile\/dashboard/);

    const pheuCard = page.locator('a', { hasText: 'Phễu đan tre' });
    const gioCard = page.locator('a', { hasText: 'giỏ đan sợi mây' });

    await expect(pheuCard).toBeVisible({ timeout: 10000 });
    await expect(gioCard).toBeVisible({ timeout: 10000 });

    const pheuHeartBtn = pheuCard.getByRole('button', { name: 'Bỏ yêu thích sản phẩm' });

    // Double-click nhanh vào nút trái tim của Phễu đan tre
    await pheuHeartBtn.dblclick();

    // Xác nhận Phễu đan tre biến mất, nhưng giỏ đan sợi mây VẪN còn nguyên
    await expect(pheuCard).not.toBeVisible({ timeout: 5000 });
    await expect(gioCard).toBeVisible();

    // Dọn dẹp: bỏ thích giỏ đan sợi mây
    await removeProductFromWishlist(GIO_DAN_MAY_ID);
  });
});
