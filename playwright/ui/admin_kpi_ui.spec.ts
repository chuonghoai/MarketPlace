import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from '../helpers/auth.helper';

const mockKpiData = {
  items: [
    {
      staffId: 'staff-1',
      staffName: 'Nguyễn Văn Hùng',
      staffEmail: 'hung.nguyen@marketnest.vn',
      totalAssigned: 10,
      totalResolved: 9,
      resolveRate: 90.0,
      openBacklog: 1,
      avgFirstResponseMinutes: 45,
      avgResolutionMinutes: 120,
      slaMetRate: 70.0,
    },
    {
      staffId: 'staff-2',
      staffName: 'Trần Thị Mai',
      staffEmail: 'mai.tran@marketnest.vn',
      totalAssigned: 9,
      totalResolved: 9,
      resolveRate: 100.0,
      openBacklog: 0,
      avgFirstResponseMinutes: 30,
      avgResolutionMinutes: 90,
      slaMetRate: 85.0,
    },
  ],
  summary: {
    totalStaffs: 2,
    totalAssigned: 19,
    totalResolved: 18,
    overallResolveRate: 94.7,
    totalBacklog: 1,
    avgFirstResponseMinutes: 38,
    avgResolutionMinutes: 105,
    overallSlaMetRate: 77.5,
    slaThresholdMinutes: 120,
  },
  timeSeries: [
    { date: '2026-10-10', assignedCount: 5, resolvedCount: 4 },
    { date: '2026-10-11', assignedCount: 4, resolvedCount: 5 },
  ],
  pagination: { page: 1, pageSize: 50, totalItems: 2, totalPages: 1 },
};

const mockStaffList = [
  {
    id: 'staff-1',
    userId: 'u-1',
    position: 'STAFF',
    salary: 15000000,
    createdAt: new Date().toISOString(),
    user: { id: 'u-1', fullName: 'Nguyễn Văn Hùng', email: 'hung.nguyen@marketnest.vn' },
  },
  {
    id: 'staff-2',
    userId: 'u-2',
    position: 'STAFF',
    salary: 15000000,
    createdAt: new Date().toISOString(),
    user: { id: 'u-2', fullName: 'Trần Thị Mai', email: 'mai.tran@marketnest.vn' },
  },
];

test.describe('UC22: Thống kê KPI nhân viên (MKP_070 -> MKP_076)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const origParse = JSON.parse;
      JSON.parse = function (text: any, reviver?: any) {
        const result = origParse(text, reviver);
        if (result && typeof result === 'object' && (result.statusCode >= 400 || result.status >= 400)) {
          Object.defineProperty(result, 'data', {
            get() {
              const err: any = new Error(result.message);
              err.response = { data: { message: result.message } };
              throw err;
            },
            configurable: true,
          });
        }
        return result;
      };
    });
  });

  test('Hiển thị đầy đủ các thẻ số liệu tổng quan KPI và bảng xếp hạng nhân viên (MKP_070)', async ({ page }) => {
    await page.route('**/kpi/staffs*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: mockKpiData }),
      });
    });

    await page.route('**/staffs*', async (route) => {
      if (route.request().url().includes('/kpi/')) {
        return route.fallback();
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: mockStaffList }),
      });
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/kpi', { waitUntil: 'domcontentloaded' });

    // Kiểm tra tiêu đề trang
    await expect(page.getByRole('heading', { name: /Thống kê KPI/i })).toBeVisible({ timeout: 10000 });

    // Kiểm tra các thẻ số liệu tổng quan
    await expect(page.getByText('Yêu cầu được gán')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Đã hoàn thành')).toBeVisible();
    await expect(page.getByText('Hiệu quả xử lý')).toBeVisible();
    await expect(page.getByText('Chưa hoàn tất')).toBeVisible();

    // Bảng xếp hạng nhân viên hiển thị tên nhân viên
    await expect(page.locator('tbody').getByText('Nguyễn Văn Hùng')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('tbody').getByText('Trần Thị Mai')).toBeVisible();
  });

  test('Lọc báo cáo thống kê KPI theo từng nhân viên cụ thể (MKP_071)', async ({ page }) => {
    let filteredStaffId = '';

    await page.route('**/kpi/staffs*', async (route) => {
      const url = route.request().url();
      if (url.includes('staffId=staff-1')) {
        filteredStaffId = 'staff-1';
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              ...mockKpiData,
              items: [mockKpiData.items[0]],
              summary: {
                ...mockKpiData.summary,
                totalAssigned: 10,
                totalResolved: 9,
                overallResolveRate: 90.0,
                overallSlaMetRate: 70.0,
              },
            },
          }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: mockKpiData }),
      });
    });

    await page.route('**/staffs*', async (route) => {
      if (route.request().url().includes('/kpi/')) {
        return route.fallback();
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: mockStaffList }),
      });
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/kpi', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /Thống kê KPI/i })).toBeVisible({ timeout: 10000 });

    // Mở dropdown lọc nhân viên và chọn Nguyễn Văn Hùng
    const staffSelect = page.locator('select').first();
    await expect(staffSelect).toBeVisible({ timeout: 5000 });
    await staffSelect.selectOption('staff-1');

    // Bảng số liệu cập nhật riêng cho Nguyễn Văn Hùng
    await expect.poll(() => filteredStaffId).toBe('staff-1');
    await expect(page.locator('tbody').getByText('Nguyễn Văn Hùng')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('tbody').getByText('Trần Thị Mai')).not.toBeVisible();
  });

  test('Xác thực khoảng thời gian: Hiển thị khung cảnh báo màu đỏ khi startDate > endDate (MKP_072)', async ({ page }) => {
    await page.route('**/kpi/staffs*', async (route) => {
      const url = route.request().url();
      if (url.includes('startDate=2026-11-15') || url.includes('endDate=2026-11-10')) {
        return route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            statusCode: 400,
            message: 'startDate không được lớn hơn endDate',
            error: 'Bad Request',
          }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: mockKpiData }),
      });
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/kpi', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /Thống kê KPI/i })).toBeVisible({ timeout: 10000 });

    // Nhập startDate > endDate
    const dateInputs = page.locator('input[type="date"]');
    await dateInputs.first().fill('2026-11-15');
    await dateInputs.last().fill('2026-11-10');

    // Khung cảnh báo màu đỏ hiển thị
    const errorAlert = page.locator('div.border-red-200, div.border-red-900').getByText(/startDate không được lớn hơn endDate/i);
    await expect(errorAlert).toBeVisible({ timeout: 5000 });
  });

  test('Giới hạn khoảng thời gian thống kê: Hiển thị cảnh báo lỗi khi khoảng cách vượt quá 366 ngày (MKP_073)', async ({ page }) => {
    await page.route('**/kpi/staffs*', async (route) => {
      const url = route.request().url();
      if (url.includes('startDate=2025-01-01') || url.includes('endDate=2026-05-01')) {
        return route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            statusCode: 400,
            message: 'Khoảng thời gian thống kê tối đa không quá 366 ngày',
            error: 'Bad Request',
          }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: mockKpiData }),
      });
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/kpi', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /Thống kê KPI/i })).toBeVisible({ timeout: 10000 });

    // Nhập khoảng thời gian 370 ngày (> 366 ngày)
    const dateInputs = page.locator('input[type="date"]');
    await dateInputs.first().fill('2025-01-01');
    await dateInputs.last().fill('2026-05-01');

    // Khung cảnh báo hiển thị giới hạn 366 ngày
    const errorAlert = page.locator('div.border-red-200, div.border-red-900').getByText(/Khoảng thời gian thống kê tối đa không quá 366 ngày/i);
    await expect(errorAlert).toBeVisible({ timeout: 5000 });
  });

  test('Phân quyền truy cập trang thống kê KPI giữa các vai trò người dùng (MKP_074)', async ({ page }) => {
    // 1. Staff truy cập /admin/kpi bị AuthGuard chặn và chuyển hướng về /login
    await loginViaUI(page, TEST_USERS.staff);
    await page.goto('/admin/kpi', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // 2. Staff truy cập /admin/kpi/me thành công
    await page.goto('/admin/kpi/me', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /Hiệu suất công việc của tôi|KPI cá nhân/i })).toBeVisible({ timeout: 10000 });

    // 3. Admin truy cập /admin/kpi thành công
    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/kpi', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /Thống kê KPI/i })).toBeVisible({ timeout: 10000 });
  });

  test('Hiển thị dữ liệu KPI rỗng an toàn khi lọc khoảng thời gian chưa có phát sinh yêu cầu nào (MKP_075)', async ({ page }) => {
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
    await expect(page.getByRole('heading', { name: /Thống kê KPI/i })).toBeVisible({ timeout: 10000 });

    // Thẻ SLA hiển thị 0% an toàn không bị NaN hay lỗi
    const slaCard = page.locator('div.border-t-amber-500');
    await expect(slaCard).toBeVisible({ timeout: 10000 });
    await expect(slaCard.getByText('0%')).toBeVisible();

    // Không có giá trị NaN trên màn hình
    await expect(page.getByText('NaN')).not.toBeVisible();
  });

  test('Tính chính xác của chỉ số Đạt chuẩn SLA toàn hệ thống trên thẻ tổng quan (MKP_076)', async ({ page }) => {
    // Mock overallSlaMetRate = 66.7 (từ tổng vé 12/18)
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
            pagination: { page: 1, pageSize: 50, totalItems: 2, totalPages: 1 },
          },
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/kpi', { waitUntil: 'domcontentloaded' });

    const slaCard = page.locator('div.border-t-amber-500');
    await expect(slaCard).toBeVisible({ timeout: 10000 });

    // Hiển thị chính xác 66.7% từ overallSlaMetRate
    await expect(slaCard.getByText('66.7%')).toBeVisible();

    // Không hiển thị giá trị trung bình cộng sai (66.3%)
    await expect(slaCard.getByText('66.3%')).not.toBeVisible();
  });
});
