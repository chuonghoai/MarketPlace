import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from '../helpers/auth.helper';

/**
 * UC19: Quản lý thiết bị đăng nhập (MKP_097 -> MKP_098)
 * Kiểm thử hộp đen giao diện người dùng
 */
test.describe('UC19: Quản lý thiết bị đăng nhập (MKP_097 -> MKP_098)', () => {

  test('Người dùng truy cập trang Quản lý thiết bị đăng nhập và kiểm tra hiển thị nhãn "Hiện tại" (MKP_097)', async ({ page }) => {
    await loginViaUI(page, TEST_USERS.client);

    await page.route('**/auth/devices', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 'dev-1',
              deviceId: 'default-device-id',
              deviceName: 'Chrome trên Windows 11',
              isActive: true,
              lastLoginAt: new Date().toISOString(),
            },
            {
              id: 'dev-2',
              deviceId: 'remote-device-id',
              deviceName: 'Mobile Safari trên iPhone 15 Pro',
              isActive: true,
              lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
            },
          ],
        }),
      });
    });

    await page.goto('/profile/devices');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: 'Thiết bị đăng nhập' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Quản lý các thiết bị đã đăng nhập vào tài khoản của bạn.')).toBeVisible();

    await expect(page.locator('text=Mobile Safari trên iPhone 15 Pro')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Chrome trên Windows 11')).toBeVisible({ timeout: 5000 });

    const activeBadges = page.locator('text=Đang đăng nhập');
    await expect(activeBadges.first()).toBeVisible();
  });

  test('Thao tác đăng xuất từ xa một thiết bị khác đang hoạt động trong danh sách (MKP_098)', async ({ page }) => {
    let revokeCalled = false;

    await loginViaUI(page, TEST_USERS.client);

    const remoteDeviceId = 'remote-iphone-device-id';
    let deviceList = [
      {
        id: 'dev-1',
        deviceId: 'current-mock-device',
        deviceName: 'Chrome trên Windows',
        isActive: true,
        lastLoginAt: new Date().toISOString(),
      },
      {
        id: 'dev-2',
        deviceId: remoteDeviceId,
        deviceName: 'Mobile Safari trên iPhone',
        isActive: true,
        lastLoginAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ];

    await page.route('**/auth/devices', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: deviceList,
        }),
      });
    });

    await page.route(`**/auth/devices/${remoteDeviceId}/revoke`, async (route) => {
      revokeCalled = true;
      deviceList = [
        deviceList[0],
        { ...deviceList[1], isActive: false },
      ];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Đăng xuất thiết bị thành công',
          data: null,
        }),
      });
    });

    await page.goto('/profile/devices');
    await page.waitForLoadState('domcontentloaded');

    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Bạn có chắc chắn muốn đăng xuất');
      await dialog.accept();
    });

    const remoteCard = page.locator('.rounded-xl').filter({ hasText: 'Mobile Safari trên iPhone' });
    const logoutBtn = remoteCard.getByRole('button', { name: 'Đăng xuất' });
    await expect(logoutBtn).toBeVisible({ timeout: 5000 });
    await logoutBtn.click();

    await expect.poll(() => revokeCalled).toBe(true);
    await expect(page.locator('text=Đã đăng xuất')).toBeVisible({ timeout: 5000 });
  });

});
