import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from '../helpers/auth.helper';

/**
 * UC06: Quản lý nhân viên Admin (MKP_095 -> MKP_096)
 * Kiểm thử hộp đen giao diện người dùng
 */
test.describe('UC06: Quản lý nhân viên (MKP_095 -> MKP_096)', () => {

  test('Quản trị viên mở modal Thêm mới nhân viên và kiểm tra validation khi để trống thông tin bắt buộc (MKP_095)', async ({ page }) => {
    await page.route('**/staffs*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [],
          pagination: { totalPages: 1, totalItems: 0 },
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/staff');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: 'Quản lý nhân viên' })).toBeVisible({ timeout: 10000 });

    const addNewBtn = page.getByRole('button', { name: /Thêm mới/i });
    await expect(addNewBtn).toBeVisible();
    await addNewBtn.click();

    await expect(page.getByRole('heading', { name: 'Thêm nhân viên mới' })).toBeVisible({ timeout: 5000 });

    const submitBtn = page.getByRole('button', { name: 'Thêm', exact: true });
    await submitBtn.click();

    const errorAlert = page.locator('text=Vui lòng điền đầy đủ các trường bắt buộc');
    await expect(errorAlert).toBeVisible({ timeout: 3000 });
  });

  test('Quản trị viên tra cứu / tìm kiếm nhân viên theo từ khóa tên trên danh sách nhân viên (MKP_096)', async ({ page }) => {
    const mockStaffList = [
      {
        id: 'staff-1',
        position: 'STAFF',
        salary: 15000000,
        createdAt: new Date().toISOString(),
        user: {
          id: 'u-1',
          fullName: 'Nguyễn Văn Nhân Viên',
          email: 'nhanvien1@marketplace.com',
          phone: '0901234567',
        },
      },
      {
        id: 'staff-2',
        position: 'ACCOUNTANT',
        salary: 18000000,
        createdAt: new Date().toISOString(),
        user: {
          id: 'u-2',
          fullName: 'Trần Thị Kế Toán',
          email: 'ketoan@marketplace.com',
          phone: '0912345678',
        },
      },
    ];

    await page.route('**/staffs*', async (route) => {
      const url = route.request().url();
      if (url.includes('search=K%E1%BA%BF') || url.includes('search=ketoan') || url.includes('search=Kế')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [mockStaffList[1]],
            pagination: { totalPages: 1, totalItems: 1 },
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: mockStaffList,
            pagination: { totalPages: 1, totalItems: 2 },
          }),
        });
      }
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/staff');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Nguyễn Văn Nhân Viên')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Trần Thị Kế Toán')).toBeVisible({ timeout: 10000 });

    const searchInput = page.getByPlaceholder(/Tìm kiếm nhân viên.../i);
    await searchInput.fill('Kế Toán');

    await expect(page.locator('text=Trần Thị Kế Toán')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Nguyễn Văn Nhân Viên')).not.toBeVisible({ timeout: 3000 });
  });

});
