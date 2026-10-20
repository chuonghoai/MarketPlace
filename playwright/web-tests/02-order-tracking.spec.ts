import { test, expect, type Page } from '@playwright/test';

// Hàm helper để tự động login
async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByPlaceholder('Nhập địa chỉ email...').fill(email);
  await page.getByPlaceholder('Nhập mật khẩu...').fill(password);
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await page.waitForURL((url: URL) => !url.pathname.includes('/login'));
}

test.describe.serial('Theo dõi đơn hàng (Order Tracking)', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Đăng nhập trước
    await loginAs(page, '23110131@student.hcmute.edu.vn', '123456');
    // 2. Đi tới trang Đơn hàng của User
    await page.goto('/profile/order/tracking');
  });

  test('TC04: Xem danh sách đơn hàng đã đặt thành công', async ({ page }) => {
    await expect(page.locator('h2').filter({ hasText: 'Theo dõi đơn hàng' })).toBeVisible();
    await expect(page.locator('div.hide-scrollbar > button').first()).toBeVisible();
    
    // Chờ loading xong: Hoặc thấy chữ "Chưa có đơn hàng" hoặc thấy link "Xem chi tiết"
    const noOrderText = page.locator('h3', { hasText: 'Chưa có đơn hàng' });
    const detailLink = page.getByRole('link', { name: 'Xem chi tiết' }).first();
    await expect(noOrderText.or(detailLink)).toBeVisible();

    if (await noOrderText.isVisible()) {
        await expect(page.getByRole('link', { name: 'Tiếp tục mua sắm' })).toBeVisible();
    } else {
        await expect(detailLink).toBeVisible();
    }
  });

  test('TC05: Lọc đơn hàng theo trạng thái (chờ xác nhận, đang giao...)', async ({ page }) => {
    const shippingTab = page.getByRole('button', { name: 'Đang giao', exact: false });
    await shippingTab.click();
    await expect(shippingTab).toHaveClass(/border-market-primary/);
  });

  test('TC06: Xem chi tiết một đơn hàng cụ thể', async ({ page }) => {
    // Chỉ click nếu có đơn hàng
    const detailLink = page.getByRole('link', { name: 'Xem chi tiết' }).first();
    const noOrderText = page.locator('h3', { hasText: 'Chưa có đơn hàng' });
    await expect(noOrderText.or(detailLink)).toBeVisible();

    if (await detailLink.isVisible()) {
        await detailLink.click();
        await expect(page).toHaveURL(/.*\/profile\/order\/tracking\/.+/);
    }
  });

  test('TC07: Gửi yêu cầu đổi/trả hàng hoặc hủy đơn', async ({ page }) => {
    // Chỉ click Hủy đơn nếu nút này hiển thị trên 1 đơn hàng Pending
    const cancelBtn = page.getByRole('button', { name: 'Hủy đơn' }).first();
    const noOrderText = page.locator('h3', { hasText: 'Chưa có đơn hàng' });
    const detailLink = page.getByRole('link', { name: 'Xem chi tiết' }).first();
    
    await expect(noOrderText.or(detailLink)).toBeVisible();

    if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await expect(page.getByText('Lý do hủy')).toBeVisible();
    }
  });

});
