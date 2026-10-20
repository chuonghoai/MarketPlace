import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from '../helpers/auth.helper';

/**
 * UC21: Quản lý nghệ danh / nghệ nhân Admin (MKP_099 -> MKP_100)
 * Kiểm thử hộp đen giao diện người dùng
 */
test.describe('UC21: Quản lý nghệ danh (MKP_099 -> MKP_100)', () => {

  test('Form Thêm mới nghệ danh kiểm tra ràng buộc ngày sinh không được trong tương lai (MKP_099)', async ({ page }) => {
    // Mock API backend artisans
    await page.route('*/**:3000/artisans*', async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'mock-artisan-future',
            fullName: 'Đạt',
            birthDate: '2029-12-31',
          }),
        });
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          total: 0,
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/artisans');
    await page.waitForLoadState('domcontentloaded');

    const addArtisanBtn = page.getByRole('link', { name: /Thêm mới/i });
    await expect(addArtisanBtn).toBeVisible({ timeout: 5000 });
    await addArtisanBtn.click();
    await page.waitForURL('**/admin/artisans/create');
    await expect(page.getByRole('heading', { name: 'Thêm mới nghệ danh' })).toBeVisible({ timeout: 5000 });

    const dialogMessages: string[] = [];
    page.on('dialog', async (dialog) => {
      dialogMessages.push(dialog.message());
      await dialog.accept();
    });

    await page.locator('input[name="fullName"]').fill('Đạt');
    const birthDateInput = page.locator('input[name="birthDate"]');
    await birthDateInput.fill('2029-12-31');

    const saveBtn = page.getByRole('button', { name: /Lưu thông tin/i });
    await saveBtn.click();

    await page.waitForTimeout(1000);

    const hasFutureDateWarning = dialogMessages.some((msg) => /ngày sinh.*(tương lai|không hợp lệ)|không được lớn hơn/i.test(msg));
    expect(hasFutureDateWarning, 'Form phải hiển thị cảnh báo khi chọn ngày sinh trong tương lai').toBe(true);
  });

  test('Quản trị viên tìm kiếm nghệ danh theo từ khóa trên danh sách nghệ danh (MKP_100)', async ({ page }) => {
    const mockArtisans = [
      {
        id: 'art-1',
        fullName: 'Nghệ nhân Gốm Trần Độ',
        avatar: '',
        birthDate: '1965-05-10T00:00:00Z',
        productCount: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'art-2',
        fullName: 'Nghệ nhân Mây Tre Nguyễn Văn B',
        avatar: '',
        birthDate: '1975-08-20T00:00:00Z',
        productCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    await page.route('*/**:3000/artisans*', async (route) => {
      const url = route.request().url();
      if (url.includes('search=Tr%E1%BA%A7n') || url.includes('search=Trần') || url.includes('search=Tran')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [mockArtisans[0]],
            total: 1,
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: mockArtisans,
            total: 2,
          }),
        });
      }
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/artisans');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Nghệ nhân Gốm Trần Độ')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Nghệ nhân Mây Tre Nguyễn Văn B')).toBeVisible({ timeout: 10000 });

    const searchInput = page.getByPlaceholder(/Tìm kiếm nghệ danh.../i);
    await searchInput.fill('Trần Độ');

    await expect(page.locator('text=Nghệ nhân Gốm Trần Độ')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Nghệ nhân Mây Tre Nguyễn Văn B')).not.toBeVisible({ timeout: 3000 });
  });

});
