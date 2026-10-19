import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from '../helpers/auth.helper';

const BACKEND_URL = 'http://127.0.0.1:3000';
const PHEU_DAN_TRE_ID = 'e2f6a99e-0fa6-4928-b846-1e7cd29f7ea4';

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

async function checkProductInWishlist(productId: string): Promise<boolean> {
  const token = await getBackendToken();
  const res = await fetch(`${BACKEND_URL}/users/me/wishlist?page=1&pageSize=40`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const items: Array<{ id: string }> = data.data?.items || [];
  return items.some((item) => item.id === productId);
}

test.describe('UC13: Quản lý sản phẩm yêu thích (MKP_051 -> MKP_055)', () => {
  test.afterEach(async () => {
    // Luôn dọn dẹp hoặc đảm bảo Phễu đan tre có lại trong wishlist cho các lần test tiếp theo
    await ensureProductInWishlist(PHEU_DAN_TRE_ID).catch(() => {});
  });

  test('Hiển thị danh sách sản phẩm yêu thích trong trang cá nhân (MKP_051)', async ({ page }) => {
    await ensureProductInWishlist(PHEU_DAN_TRE_ID);
    await loginViaUI(page, TEST_USERS.client);

    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/profile\/dashboard/);

    // Khu vực danh sách yêu thích
    await expect(page.getByRole('heading', { name: 'Danh sách yêu thích' })).toBeVisible({ timeout: 10000 });

    // Tìm thẻ sản phẩm Phễu đan tre
    const pheuCard = page.locator('a', { hasText: 'Phễu đan tre' });
    await expect(pheuCard).toBeVisible({ timeout: 10000 });

    // Thẻ sản phẩm hiển thị ảnh, tiêu đề và giá tiền
    await expect(pheuCard.locator('img')).toBeVisible();
    await expect(pheuCard.getByText('Phễu đan tre')).toBeVisible();
    await expect(pheuCard.getByText(/45\.000/)).toBeVisible();

    // Bấm vào thẻ sản phẩm chuyển sang trang chi tiết
    await pheuCard.getByText('Phễu đan tre').click();
    await page.waitForURL(/.*pheu-dan-tre.*/, { timeout: 10000 });
    expect(page.url()).toContain('pheu-dan-tre');
    await expect(page.getByRole('heading', { name: 'Phễu đan tre' })).toBeVisible({ timeout: 10000 });
  });

  test('Bỏ yêu thích sản phẩm từ trang chi tiết sản phẩm (MKP_052)', async ({ page }) => {
    await ensureProductInWishlist(PHEU_DAN_TRE_ID);
    await loginViaUI(page, TEST_USERS.client);

    await page.goto(`/product/${PHEU_DAN_TRE_ID}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Phễu đan tre' })).toBeVisible({ timeout: 10000 });

    // Quan sát nút yêu thích đang ở trạng thái đã thích (Bỏ yêu thích)
    const favButton = page.getByRole('button', { name: /Bỏ yêu thích/i }).first();
    await expect(favButton).toBeVisible({ timeout: 5000 });

    // Bấm để bỏ yêu thích
    await favButton.click();

    // Hiển thị toast thông báo thành công và nút chuyển về trạng thái chưa chọn (Yêu thích)
    const unFavButton = page.getByRole('button', { name: /^Yêu thích$/i }).first();
    await expect(unFavButton).toBeVisible({ timeout: 5000 });

    // Kiểm tra trên backend sản phẩm đã được xóa khỏi wishlist
    const inWishlist = await checkProductInWishlist(PHEU_DAN_TRE_ID);
    expect(inWishlist).toBeFalsy();
  });

  test('Yêu cầu đăng nhập khi bấm yêu thích sản phẩm lúc chưa đăng nhập (MKP_053)', async ({ page, context }) => {
    await context.clearCookies();

    await page.goto(`/product/${PHEU_DAN_TRE_ID}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Phễu đan tre' })).toBeVisible({ timeout: 10000 });

    // Nút yêu thích ở trạng thái khách vãng lai
    const favButton = page.getByRole('button', { name: /Yêu thích/i }).first();
    await expect(favButton).toBeVisible({ timeout: 5000 });
    await favButton.click();

    // Ngăn chặn và chuyển hướng về /login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Đăng nhập/i })).toBeVisible({ timeout: 5000 });
  });

  test('Hiển thị trạng thái danh sách yêu thích rỗng khi chưa có sản phẩm nào (MKP_054)', async ({ page }) => {
    // Mock API wishlist trả về rỗng
    await page.route('**/users/me/wishlist*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { items: [] },
          pagination: { page: 1, pageSize: 40, totalItems: 0, totalPages: 0 },
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.client);
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/profile\/dashboard/);

    // Xác nhận hiển thị Empty State
    await expect(page.getByText('Chưa có sản phẩm yêu thích')).toBeVisible({ timeout: 5000 });
    const exploreBtn = page.getByRole('link', { name: 'Khám phá ngay' });
    await expect(exploreBtn).toBeVisible({ timeout: 5000 });

    // Bấm nút Khám phá ngay điều hướng về trang chủ / danh mục
    await exploreBtn.click();
    await page.waitForURL((url) => url.pathname === '/' || url.pathname.includes('/product'), { timeout: 10000 });
  });

  test('Bấm icon trái tim trên thẻ sản phẩm trong trang danh sách yêu thích biến mất lập tức (MKP_055)', async ({ page }) => {
    await ensureProductInWishlist(PHEU_DAN_TRE_ID);
    await loginViaUI(page, TEST_USERS.client);

    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/profile\/dashboard/);

    const pheuCard = page.locator('a', { hasText: 'Phễu đan tre' });
    await expect(pheuCard).toBeVisible({ timeout: 10000 });

    const heartBtn = pheuCard.getByRole('button', { name: 'Bỏ yêu thích sản phẩm' });
    await expect(heartBtn).toBeVisible();

    // Click nút trái tim
    await heartBtn.click();

    // URL không bị chuyển hướng sang trang chi tiết sản phẩm
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/profile/dashboard');

    // Thẻ sản phẩm biến mất khỏi danh sách ngay tại chỗ
    await expect(pheuCard).not.toBeVisible({ timeout: 5000 });

    // Hiển thị thông báo toast thành công
    const toast = page.locator('.fixed').getByText(/Đã xóa khỏi bộ sưu tập yêu thích|thành công/i);
    await expect(toast).toBeVisible({ timeout: 5000 });

    // Xác minh với backend: sản phẩm đã không còn trong wishlist
    const inWishlist = await checkProductInWishlist(PHEU_DAN_TRE_ID);
    expect(inWishlist).toBeFalsy();
  });
});
