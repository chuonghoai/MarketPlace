import { test, expect } from '@playwright/test';
import { loginViaUI } from '../helpers/auth.helper';

test.describe('Giao diện - Hồ sơ cá nhân', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page);
  });

  test('Hiển thị trang thông tin cá nhân và nút chỉnh sửa', async ({ page }) => {
    await page.goto('/profile/dashboard', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'Thông tin cá nhân' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Chỉnh sửa' })).toBeVisible();
  });

  test('Cập nhật thông tin cá nhân phải lập tức đồng bộ lên thanh điều hướng sidebar mà không cần tải lại trang (MKP_026)', async ({ page }) => {
    await page.goto('/profile/dashboard', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: 'Chỉnh sửa' })).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'Chỉnh sửa' }).click();

    const newName = `Client ${Date.now()}`;
    const nameInput = page.locator('input[placeholder*="họ và tên" i], input[value]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill(newName);
    }

    const saveBtn = page.getByRole('button', { name: /Lưu thay đổi|Lưu/i });
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
    }

    // Kết quả mong đợi theo tài liệu kiểm thử MKP_026:
    // Tên mới phải cập nhật ngay trên thanh sidebar mà không cần F5 lại trang
    const sidebar = page.locator('aside');
    await expect(sidebar.getByText(newName)).toBeVisible({ timeout: 3000 });
  });
});
