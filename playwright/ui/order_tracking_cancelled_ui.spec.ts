import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from '../helpers/auth.helper';

test.describe('MKP-062: Hiển thị đơn hàng đã hủy tại tab Tất cả (/profile/orders)', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, TEST_USERS.client);
  });

  test('Test A — Tab Tất cả (ALL) hiển thị đầy đủ đơn đã hủy (CANCELLED) và badge trạng thái', async ({ page }) => {
    // 1. Truy cập /profile/orders
    await page.goto('/profile/orders', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h2', { hasText: 'Theo dõi đơn hàng' })).toBeVisible({ timeout: 10000 });

    // 2. Xác nhận tab "Tất cả" đang active
    const allTab = page.getByRole('button', { name: 'Tất cả', exact: false });
    await expect(allTab).toBeVisible();
    await expect(allTab).toHaveClass(/border-market-primary/);

    // Chờ danh sách đơn hàng tải xong
    const cards = page.locator('div.border-border-subtle.rounded-xl');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    // 3. Không hiển thị empty state "Chưa có đơn hàng"
    await expect(page.locator('h3', { hasText: 'Chưa có đơn hàng' })).not.toBeVisible();

    // 4. Xác nhận các đơn CANCELLED xuất hiện với badge "Đã hủy"
    const cancelledBadges = cards.locator('span', { hasText: 'Đã hủy' });
    await expect(cancelledBadges.first()).toBeVisible({ timeout: 5000 });

    // Tài khoản kiểm thử client@example.com có 3 đơn đã hủy
    const count = await cancelledBadges.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('Test B — Tab Đã hủy (CANCELLED) chỉ hiển thị các đơn có trạng thái hủy', async ({ page }) => {
    await page.goto('/profile/orders', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h2', { hasText: 'Theo dõi đơn hàng' })).toBeVisible({ timeout: 10000 });

    // Click chọn tab "Đã hủy"
    const cancelledTab = page.getByRole('button', { name: 'Đã hủy', exact: false });
    await cancelledTab.click();
    await expect(cancelledTab).toHaveClass(/border-market-primary/);

    // Chờ danh sách tải xong
    const cards = page.locator('div.border-border-subtle.rounded-xl');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    const totalCards = await cards.count();
    expect(totalCards).toBe(3);

    // Tất cả các thẻ hiển thị đều phải có badge "Đã hủy"
    const cancelledBadges = cards.locator('span', { hasText: 'Đã hủy' });
    expect(await cancelledBadges.count()).toBe(totalCards);

    // Đảm bảo không có các trạng thái khác như "Chờ xác nhận"
    const pendingBadges = cards.locator('span', { hasText: 'Chờ xác nhận' });
    expect(await pendingBadges.count()).toBe(0);
  });

  test('Test C — Nhiều trạng thái: Tab Tất cả chứa cả đơn chờ xác nhận và đơn đã hủy', async ({ page }) => {
    await page.goto('/profile/orders', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h2', { hasText: 'Theo dõi đơn hàng' })).toBeVisible({ timeout: 10000 });

    const allCards = page.locator('div.border-border-subtle.rounded-xl');
    await expect(allCards.first()).toBeVisible({ timeout: 10000 });
    const allCount = await allCards.count();

    // Xác nhận có cả đơn Chờ xác nhận và Đã hủy trong tab Tất cả
    const pendingBadges = allCards.locator('span', { hasText: 'Chờ xác nhận' });
    const cancelledBadges = allCards.locator('span', { hasText: 'Đã hủy' });

    expect(await pendingBadges.count()).toBeGreaterThan(0);
    expect(await cancelledBadges.count()).toBeGreaterThan(0);
    expect(allCount).toBe((await pendingBadges.count()) + (await cancelledBadges.count()));

    // Chuyển sang tab "Chờ xác nhận"
    const pendingTab = page.getByRole('button', { name: 'Chờ xác nhận', exact: false });
    await pendingTab.click();
    await expect(pendingTab).toHaveClass(/border-market-primary/);

    const pendingOnlyCards = page.locator('div.border-border-subtle.rounded-xl');
    await expect(pendingOnlyCards.first()).toBeVisible({ timeout: 5000 });
    const pendingOnlyCount = await pendingOnlyCards.count();
    expect(pendingOnlyCount).toBe(await pendingBadges.count());

    // Không có đơn nào bị loại bỏ nhầm ở tab Tất cả
    expect(allCount).toBeGreaterThan(pendingOnlyCount);
  });

  test('Test D — API trả về danh sách rỗng: hiển thị empty state đúng', async ({ page }) => {
    // Mock API trả về danh sách rỗng
    await page.route('**/orders/tracking**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Lấy danh sách đơn hàng thành công',
          data: [],
        }),
      });
    });

    await page.goto('/profile/orders', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h2', { hasText: 'Theo dõi đơn hàng' })).toBeVisible({ timeout: 10000 });

    // Xác nhận hiển thị empty state "Chưa có đơn hàng" và nút "Tiếp tục mua sắm"
    await expect(page.locator('h3', { hasText: 'Chưa có đơn hàng' })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('link', { name: 'Tiếp tục mua sắm' })).toBeVisible();
  });

  test('Test E — Phân quyền: Người dùng chưa đăng nhập bị chặn khi truy cập /profile/orders', async ({ browser }) => {
    // Tạo context mới không có session đăng nhập
    const anonymousContext = await browser.newContext();
    const anonymousPage = await anonymousContext.newPage();

    await anonymousPage.goto('/profile/orders', { waitUntil: 'domcontentloaded' });
    // AuthGuard phải chuyển hướng về /login
    await expect(anonymousPage).toHaveURL(/.*\/login/, { timeout: 10000 });
    await anonymousContext.close();
  });
});
