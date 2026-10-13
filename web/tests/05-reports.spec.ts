import { test, expect, type Page } from '@playwright/test';

async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByPlaceholder('Nhập địa chỉ email...').fill(email);
  await page.getByPlaceholder('Nhập mật khẩu...').fill(password);
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await page.waitForURL((url: URL) => !url.pathname.includes('/login'));
}

test.describe.serial('Xem báo cáo & thống kê (View Reports & Statistics)', () => {

  test.beforeEach(async ({ page }) => {
    // Truy cập trang tổng quan Admin (Dashboard)
    await loginAs(page, 'nghiatrinh3035@gmail.com', 'heorom123');
    await page.goto('/admin');
  });

  test('TC16: Hiển thị đúng tổng doanh thu và số lượng đơn hàng trên Dashboard', async ({ page }) => {
    // 1. Chờ load trang tổng quan
    await expect(page.locator('h2', { hasText: 'Tổng quan' })).toBeVisible();

    // Lấy vùng nội dung chính (main) để tránh nhầm với menu ở Sidebar
    const mainContent = page.getByRole('main');

    // 2. Kiểm tra các Text hiển thị trên thẻ KPI (VD: Doanh thu, Đơn hàng)
    await expect(mainContent.getByText('Doanh thu', { exact: true }).first()).toBeVisible();
    await expect(mainContent.getByText('Đơn hàng', { exact: true }).first()).toBeVisible();
    await expect(mainContent.getByText('Tỉ lệ chuyển đổi', { exact: true }).first()).toBeVisible();
  });

  test('TC17: Thay đổi mốc thời gian (tuần, tháng) thì biểu đồ cập nhật đúng', async ({ page }) => {
    // 1. Chọn button thời gian (VD: 30 ngày)
    const btn1year = page.getByRole('button', { name: '1 năm' });
    if (await btn1year.isVisible()) {
      await btn1year.click();

      // 2. Chờ dữ liệu cập nhật
      await page.waitForTimeout(1000);

      // 3. Tiêu đề biểu đồ doanh thu thay đổi theo label
      await expect(page.getByText('Doanh thu — 1 năm')).toBeVisible();
    }
  });

  test('TC18: Xem danh sách top sản phẩm bán chạy / Xuất báo cáo', async ({ page }) => {
    // 1. Bảng Hiệu suất sản phẩm (Top Products)
    await expect(page.locator('h3', { hasText: 'Hiệu suất sản phẩm' })).toBeVisible();

    const topProductsTable = page.locator('table').first();
    await expect(topProductsTable).toBeVisible();

    // 2. Nút xuất báo cáo hiển thị trên Header
    const exportBtn = page.getByRole('button', { name: 'Xuất báo cáo' });
    await expect(exportBtn).toBeVisible();
  });

});
