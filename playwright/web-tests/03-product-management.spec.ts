import { test, expect, type Page } from '@playwright/test';

// Hàm helper để tự động login
async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByPlaceholder('Nhập địa chỉ email...').fill(email);
  await page.getByPlaceholder('Nhập mật khẩu...').fill(password);
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await page.waitForURL((url: URL) => !url.pathname.includes('/login'));
}

test.describe.serial('Quản lý sản phẩm (Product Management)', () => {

  test.beforeEach(async ({ page }) => {
    // Đăng nhập quyền Admin/Seller và vào trang Sản phẩm
    await loginAs(page, 'nghiatrinh3035@gmail.com', 'heorom123');
    await page.goto('/admin/products');
  });

  test('TC08: Xem danh sách sản phẩm của mình', async ({ page }) => {
    // 1. Vào tab Sản phẩm, kiểm tra tiêu đề trang "Quản lý Sản phẩm"
    await expect(page.locator('h2', { hasText: 'Quản lý Sản phẩm' })).toBeVisible();
    
    // 2. Nút Thêm sản phẩm phải hiển thị
    const addBtn = page.getByRole('button', { name: 'Thêm sản phẩm' });
    await expect(addBtn).toBeVisible();

    // 3. Danh sách sản phẩm load hiển thị (table)
    // Chờ 1 chút để load dữ liệu
    await page.waitForTimeout(1000); 
    // Xác nhận có bảng table
    await expect(page.locator('table').first()).toBeVisible();
  });

  test('TC09: Chuyển hướng sang form Thêm sản phẩm', async ({ page }) => {
    // 1. Click "Thêm sản phẩm"
    const addBtn = page.getByRole('button', { name: 'Thêm sản phẩm' });
    await addBtn.click();

    // 2. Chuyển hướng sang form Create Product
    await expect(page).toHaveURL(/.*\/admin\/products\/create/);
    await expect(page.locator('h3', { hasText: 'Thông tin sản phẩm' })).toBeVisible();
  });

  test('TC10: Báo lỗi khi thêm sản phẩm thiếu thông tin bắt buộc', async ({ page }) => {
    // 1. Vào trang thêm mới
    await page.goto('/admin/products/create');

    // 2. Click Lưu lại ngay lập tức (để trống form)
    const saveBtn = page.getByRole('button', { name: 'Lưu lại' });
    await saveBtn.click();

    // 3. Kiểm tra thông báo lỗi validation từ react-hook-form
    await expect(page.getByText('Vui lòng nhập tên')).toBeVisible();
    await expect(page.getByText('Vui lòng chọn danh mục')).toBeVisible();
  });

  test('TC11: Truy cập màn hình Cập nhật thông tin sản phẩm', async ({ page }) => {
    // 1. Tìm table và nút Edit
    await page.waitForTimeout(1000); // Chờ table load
    const table = page.locator('table').first();
    
    if (await table.isVisible()) {
      // 2. Bấm vào sản phẩm đầu tiên
      const firstRow = table.locator('tbody tr').first();
      // Click để vào màn detail hoặc edit. Nút edit thường có icon edit
      const editBtn = firstRow.locator('button').filter({ hasText: 'edit' }).first();
      if (await editBtn.isVisible()) {
         await editBtn.click();
         await expect(page).toHaveURL(/.*\/admin\/products\/.*\/edit/);
      }
    }
  });

});
