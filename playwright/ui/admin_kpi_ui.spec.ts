import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from '../helpers/auth.helper';

test.describe('Giao diện - Thống kê KPI nhân viên Admin (/admin/kpi) (MKP-076)', () => {
  test('Test G - Hiển thị giá trị thẻ Đạt chuẩn SLA trực tiếp từ API (66.7%), không tự tính trung bình cộng (66.3%)', async ({
    page,
  }) => {
    // 1. Mock API trả về overallSlaMetRate = 66.7 (tính theo tổng vé 12/18)
    // Nếu frontend tự tính trung bình cộng: (70 + 62.5) / 2 = 66.25% -> 66.3%
    await page.route('**/kpi/staffs*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            items: [
              {
                staffId: 'staff-a',
                staffName: 'Staff A',
                staffEmail: 'a@marketnest.vn',
                totalAssigned: 10,
                totalResolved: 8,
                resolveRate: 80,
                openBacklog: 2,
                avgFirstResponseMinutes: 30,
                avgResolutionMinutes: 100,
                slaMetRate: 70,
              },
              {
                staffId: 'staff-b',
                staffName: 'Staff B',
                staffEmail: 'b@marketnest.vn',
                totalAssigned: 8,
                totalResolved: 6,
                resolveRate: 75,
                openBacklog: 2,
                avgFirstResponseMinutes: 40,
                avgResolutionMinutes: 110,
                slaMetRate: 62.5,
              },
            ],
            summary: {
              totalStaffs: 2,
              totalAssigned: 18,
              totalResolved: 14,
              overallResolveRate: 77.8,
              totalBacklog: 4,
              avgFirstResponseMinutes: 35,
              avgResolutionMinutes: 105,
              overallSlaMetRate: 66.7,
              slaThresholdMinutes: 120,
            },
            timeSeries: [],
            pagination: {
              page: 1,
              pageSize: 50,
              totalItems: 2,
              totalPages: 1,
            },
          },
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/kpi', { waitUntil: 'domcontentloaded' });

    // 2. Chờ trang tải và thẻ "Đạt chuẩn SLA" hiển thị
    const slaCard = page.locator('div.border-t-amber-500');
    await expect(slaCard).toBeVisible({ timeout: 10000 });

    // 3. Xác minh thẻ hiển thị chính xác 66.7% (từ overallSlaMetRate của API)
    await expect(slaCard.getByText('66.7%')).toBeVisible();

    // 4. Xác minh không hiển thị giá trị trung bình cộng sai (66.3%)
    await expect(slaCard.getByText('66.3%')).not.toBeVisible();
  });

  test('Test G - Hiển thị 0% an toàn khi overallSlaMetRate là 0', async ({ page }) => {
    await page.route('**/kpi/staffs*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            items: [],
            summary: {
              totalStaffs: 0,
              totalAssigned: 0,
              totalResolved: 0,
              overallResolveRate: 0,
              totalBacklog: 0,
              avgFirstResponseMinutes: 0,
              avgResolutionMinutes: 0,
              overallSlaMetRate: 0,
              slaThresholdMinutes: 120,
            },
            timeSeries: [],
            pagination: { page: 1, pageSize: 50, totalItems: 0, totalPages: 1 },
          },
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/kpi', { waitUntil: 'domcontentloaded' });

    const slaCard = page.locator('div.border-t-amber-500');
    await expect(slaCard).toBeVisible({ timeout: 10000 });
    await expect(slaCard.getByText('0%')).toBeVisible();
  });
});
