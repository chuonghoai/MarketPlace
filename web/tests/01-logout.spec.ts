import { test, expect, type Page } from '@playwright/test';

// Hàm helper để tự động login
async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByPlaceholder('Nhập địa chỉ email...').fill(email);
  await page.getByPlaceholder('Nhập mật khẩu...').fill(password);
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  // Chờ cho đến khi chuyển hướng khỏi trang login thành công
  await page.waitForURL((url: URL) => !url.pathname.includes('/login'));
}

test.describe.serial('Đăng xuất (Logout)', () => {

  test('TC01: Đăng xuất thành công từ giao diện User', async ({ page }) => {
    // 1. Đăng nhập bằng tài khoản User (đã seed trong Backend)
    await loginAs(page, 'client@example.com', 'password123');
    
    // 2. Hover chuột vào khu vực user avatar trên Header để mở menu
    await page.locator('header img.rounded-full').hover();
    
    // 3. Click Đăng xuất
    const logoutBtn = page.getByRole('button', { name: 'Đăng xuất' });
    await logoutBtn.click();

    // 4. Xác nhận bị chuyển hướng về trang đăng nhập
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('TC02: Đăng xuất thành công từ giao diện Admin/Seller', async ({ page }) => {
    // 1. Đăng nhập quyền Admin
    await loginAs(page, 'admin@example.com', 'password123');
    await page.goto('/admin');
    
    // 2. Click vào nút menu avatar dưới cùng sidebar để mở popup
    const userMenuBtn = page.locator('button').filter({ hasText: 'expand_less' }).or(page.locator('button.w-full.flex.items-center.justify-between'));
    if (await userMenuBtn.isVisible()) {
        await userMenuBtn.click();
    }
    
    // 3. Click Đăng xuất trên menu vừa xổ ra
    const logoutBtn = page.getByRole('button', { name: 'Đăng xuất' });
    await logoutBtn.click();

    // 4. Xác nhận chuyển hướng về trang login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('TC03: Không thể truy cập trang yêu cầu đăng nhập sau khi đăng xuất', async ({ page }) => {
    // 1. Đăng nhập rồi đăng xuất
    await loginAs(page, 'client@example.com', 'password123');
    await page.locator('header img.rounded-full').hover();
    await page.getByRole('button', { name: 'Đăng xuất' }).click();
    await expect(page).toHaveURL(/.*\/login/);

    // 2. Cố gắng điều hướng tay tới /profile
    await page.goto('/profile');
    
    // 3. Hệ thống sẽ tự redirect về login do mất token
    await expect(page).toHaveURL(/.*\/login/);
  });

});
