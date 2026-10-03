import { test, expect } from '@playwright/test';
import { getAuthToken, TEST_USERS } from '../helpers/auth.helper';

test.describe('API - Thống kê KPI nhân viên (Staff KPI)', () => {
  let adminToken: string;
  let staffToken: string;
  let clientToken: string;

  const validStartDate = '2026-03-01';
  const validEndDate = '2026-03-31';

  test.beforeAll(async ({ request }) => {
    adminToken = await getAuthToken(request, TEST_USERS.admin);
    staffToken = await getAuthToken(request, TEST_USERS.staff);
    clientToken = await getAuthToken(request, TEST_USERS.client);
  });

  test.beforeEach(async () => {
    // Tránh chạm ngưỡng rate-limit của backend (6 req/s)
    await new Promise((resolve) => setTimeout(resolve, 200));
  });

  test('Admin lấy thống kê KPI nhân viên thành công (GET /kpi/staffs)', async ({ request }) => {
    const response = await request.get(`/kpi/staffs?startDate=${validStartDate}&endDate=${validEndDate}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();

    // Kiểm tra cấu trúc dữ liệu trả về
    const { items, summary, timeSeries, pagination } = body.data;
    expect(Array.isArray(items)).toBe(true);
    expect(summary).toBeDefined();
    expect(typeof summary.totalAssigned).toBe('number');
    expect(typeof summary.totalResolved).toBe('number');
    expect(typeof summary.overallResolveRate).toBe('number');
    expect(Array.isArray(timeSeries)).toBe(true);
    expect(pagination).toBeDefined();
    expect(pagination.page).toBe(1);
  });

  test('Admin lọc KPI theo staffId cụ thể thành công (GET /kpi/staffs?staffId=...)', async ({ request }) => {
    // Lấy danh sách staff trước
    const staffListRes = await request.get(`/kpi/staffs?startDate=${validStartDate}&endDate=${validEndDate}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const staffListBody = await staffListRes.json();
    const items = staffListBody.data?.items || [];

    if (items.length > 0) {
      const targetStaffId = items[0].staffId;
      const response = await request.get(
        `/kpi/staffs?startDate=${validStartDate}&endDate=${validEndDate}&staffId=${targetStaffId}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.items.length).toBeLessThanOrEqual(1);
      if (body.data.items.length === 1) {
        expect(body.data.items[0].staffId).toBe(targetStaffId);
      }
    }
  });

  test('Báo lỗi 400 khi thiếu tham số startDate hoặc endDate', async ({ request }) => {
    const responseNoEnd = await request.get(`/kpi/staffs?startDate=${validStartDate}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(responseNoEnd.status()).toBe(400);

    const responseNoStart = await request.get(`/kpi/staffs?endDate=${validEndDate}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(responseNoStart.status()).toBe(400);
  });

  test('Báo lỗi 400 khi startDate lớn hơn endDate', async ({ request }) => {
    const response = await request.get(`/kpi/staffs?startDate=2026-04-01&endDate=2026-03-01`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(response.status()).toBe(400);
  });

  test('Báo lỗi 400 khi khoảng thời gian vượt quá 366 ngày', async ({ request }) => {
    const response = await request.get(`/kpi/staffs?startDate=2024-01-01&endDate=2026-01-01`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(response.status()).toBe(400);
  });

  test('Nhân viên (STAFF) không được phép truy cập KPI toàn thể công ty của Admin (GET /kpi/staffs)', async ({ request }) => {
    const response = await request.get(`/kpi/staffs?startDate=${validStartDate}&endDate=${validEndDate}`, {
      headers: { Authorization: `Bearer ${staffToken}` },
    });

    expect(response.status()).toBe(403);
  });

  test('Khách hàng (USER) không được phép truy cập KPI toàn thể công ty (GET /kpi/staffs)', async ({ request }) => {
    const response = await request.get(`/kpi/staffs?startDate=${validStartDate}&endDate=${validEndDate}`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    expect(response.status()).toBe(403);
  });

  test('Nhân viên lấy KPI cá nhân của chính mình thành công (GET /kpi/staffs/me)', async ({ request }) => {
    const response = await request.get(`/kpi/staffs/me?startDate=${validStartDate}&endDate=${validEndDate}`, {
      headers: { Authorization: `Bearer ${staffToken}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();

    // Dữ liệu cá nhân chỉ chứa 1 item của chính staff đó
    expect(body.data.items).toBeDefined();
    expect(body.data.summary).toBeDefined();
    expect(body.data.timeSeries).toBeDefined();
  });

  test('Khách hàng (USER) không có quyền gọi endpoint KPI nhân viên cá nhân (GET /kpi/staffs/me)', async ({ request }) => {
    const response = await request.get(`/kpi/staffs/me?startDate=${validStartDate}&endDate=${validEndDate}`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    expect(response.status()).toBe(403);
  });
});
