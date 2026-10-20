import { test, expect } from '@playwright/test';
import { getAuthToken, TEST_USERS } from '../helpers/auth.helper';

test.describe('API - Yêu cầu hỗ trợ (Support Requests)', () => {
  test.describe.configure({ mode: 'serial' });

  let clientToken: string;
  let adminToken: string;
  let staffToken: string;
  let createdRequestId: string;
  let staffId: string;

  const authHeader = (token: string) => ({
    Authorization: `Bearer ${token}`,
    Cookie: `accessToken=${token}`,
  });

  async function getOrCreateRequestId(request: any): Promise<string> {
    if (createdRequestId) return createdRequestId;
    const response = await request.post('/support-requests', {
      headers: authHeader(clientToken),
      data: {
        title: 'Playwright API Test - Auto Support Request',
        content: 'Nội dung chi tiết tự động tạo phục vụ kiểm thử độc lập.',
      },
    });
    if (response.ok()) {
      const body = await response.json();
      createdRequestId = body.data?.id;
    }
    return createdRequestId;
  }

  test.beforeAll(async ({ request }) => {
    clientToken = await getAuthToken(request, TEST_USERS.client);
    adminToken = await getAuthToken(request, TEST_USERS.admin);
    staffToken = await getAuthToken(request, TEST_USERS.staff);

    // Lấy staffId của đúng tài khoản staff đang dùng trong test (staff1@marketnest.vn)
    const staffRes = await request.get('/staffs', {
      headers: authHeader(adminToken),
    });
    if (staffRes.ok()) {
      const staffBody = await staffRes.json();
      const staffList = staffBody.data || [];
      const matched = staffList.find(
        (s: { user?: { email: string }; email?: string }) =>
          s.user?.email === TEST_USERS.staff.email || s.email === TEST_USERS.staff.email,
      );
      staffId = matched ? matched.id : (staffList[0]?.id || '');
    }
  });

  test.beforeEach(async () => {
    // Tránh chạm ngưỡng rate-limit của backend
    await new Promise((resolve) => setTimeout(resolve, 200));
  });

  test('Khách hàng tạo yêu cầu hỗ trợ thành công (POST /support-requests)', async ({ request }) => {
    const response = await request.post('/support-requests', {
      headers: authHeader(clientToken),
      data: {
        title: 'Playwright API Test - Cần hỗ trợ thanh toán',
        content: 'Nội dung chi tiết yêu cầu hỗ trợ được tạo từ Playwright API test.',
      },
    });

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
    expect(body.data.title).toBe('Playwright API Test - Cần hỗ trợ thanh toán');
    expect(body.data.status).toBe('OPEN');

    createdRequestId = body.data.id;
  });

  test('Báo lỗi 400 khi thiếu tiêu đề hoặc nội dung yêu cầu', async ({ request }) => {
    const response = await request.post('/support-requests', {
      headers: authHeader(clientToken),
      data: {
        title: '',
        content: '',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('Khách hàng xem danh sách yêu cầu của chính mình (GET /support-requests/my)', async ({ request }) => {
    const response = await request.get('/support-requests/my', {
      headers: authHeader(clientToken),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    const found = body.data.some((r: { id: string }) => r.id === createdRequestId);
    expect(found).toBe(true);
  });

  test('Admin xem danh sách tất cả yêu cầu hỗ trợ (GET /support-requests)', async ({ request }) => {
    const response = await request.get('/support-requests', {
      headers: authHeader(adminToken),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('Khách hàng không có quyền xem danh sách tất cả yêu cầu (GET /support-requests)', async ({ request }) => {
    const response = await request.get('/support-requests', {
      headers: authHeader(clientToken),
    });

    expect(response.status()).toBe(403);
  });

  test('Admin phân công nhân viên xử lý yêu cầu (PATCH /support-requests/:id/assign)', async ({ request }) => {
    const reqId = await getOrCreateRequestId(request);
    test.skip(!reqId || !staffId, 'Cần createdRequestId và staffId để chạy test');

    const response = await request.patch(`/support-requests/${reqId}/assign`, {
      headers: authHeader(adminToken),
      data: {
        staffId: staffId,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('ASSIGNED');
    expect(body.data.assignedStaffId).toBe(staffId);
  });

  test('Khách hàng không có quyền phân công nhân viên (PATCH /support-requests/:id/assign)', async ({ request }) => {
    const reqId = await getOrCreateRequestId(request);
    test.skip(!reqId, 'Cần createdRequestId');

    const response = await request.patch(`/support-requests/${reqId}/assign`, {
      headers: authHeader(clientToken),
      data: { staffId: staffId || 'some-id' },
    });

    expect(response.status()).toBe(403);
  });

  test('Nhân viên gửi tin nhắn phản hồi đầu tiên và chuyển ticket sang IN_PROGRESS (POST /support-requests/:id/messages)', async ({ request }) => {
    const reqId = await getOrCreateRequestId(request);
    test.skip(!reqId, 'Cần createdRequestId');

    const response = await request.post(`/support-requests/${reqId}/messages`, {
      headers: authHeader(staffToken),
      data: {
        content: 'Chào bạn, tôi là nhân viên hỗ trợ. Tôi đang xử lý vấn đề của bạn.',
      },
    });

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.content).toContain('Chào bạn, tôi là nhân viên hỗ trợ');

    // Kiểm tra chi tiết request đã chuyển sang IN_PROGRESS
    const detailRes = await request.get(`/support-requests/${createdRequestId}`, {
      headers: authHeader(staffToken),
    });
    expect(detailRes.status()).toBe(200);
    const detailBody = await detailRes.json();
    expect(detailBody.data.status).toBe('IN_PROGRESS');
    expect(detailBody.data.firstResponseAt).toBeDefined();
  });

  test('Nhân viên đánh dấu đã giải quyết yêu cầu (PATCH /support-requests/:id/resolve)', async ({ request }) => {
    const reqId = await getOrCreateRequestId(request);
    test.skip(!reqId, 'Cần createdRequestId');

    const response = await request.patch(`/support-requests/${reqId}/resolve`, {
      headers: authHeader(staffToken),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('RESOLVED');
    expect(body.data.resolvedAt).toBeDefined();
  });

  test('MKP-069: Nhân viên gửi tin nhắn vào ticket RESOLVED không làm mở lại ticket (vẫn giữ RESOLVED)', async ({ request }) => {
    const reqId = await getOrCreateRequestId(request);
    test.skip(!reqId, 'Cần createdRequestId');

    const response = await request.post(`/support-requests/${reqId}/messages`, {
      headers: authHeader(staffToken),
      data: { content: 'Ghi chú thêm từ nhân viên hỗ trợ khi ticket đang RESOLVED' },
    });

    expect([200, 201]).toContain(response.status());

    // Trạng thái ticket vẫn phải là RESOLVED
    const detailRes = await request.get(`/support-requests/${createdRequestId}`, {
      headers: authHeader(clientToken),
    });
    expect(detailRes.status()).toBe(200);
    const detailBody = await detailRes.json();
    expect(detailBody.data.status).toBe('RESOLVED');
  });

  test('MKP-069: Khách hàng gửi tin nhắn mới khi ticket đang RESOLVED -> tự động chuyển trạng thái sang IN_PROGRESS', async ({ request }) => {
    const reqId = await getOrCreateRequestId(request);
    test.skip(!reqId, 'Cần createdRequestId');

    const response = await request.post(`/support-requests/${reqId}/messages`, {
      headers: authHeader(clientToken),
      data: { content: 'Tôi vẫn gặp vấn đề này, nhờ hỗ trợ kiểm tra lại giúp tôi' },
    });

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(true);

    // Xác nhận chi tiết ticket đã được cập nhật sang IN_PROGRESS
    const detailRes = await request.get(`/support-requests/${createdRequestId}`, {
      headers: authHeader(clientToken),
    });
    expect(detailRes.status()).toBe(200);
    const detailBody = await detailRes.json();
    expect(detailBody.data.status).toBe('IN_PROGRESS');

    // Nhân viên đánh dấu đã giải quyết lại để chuẩn bị cho các test tiếp theo
    await request.patch(`/support-requests/${createdRequestId}/resolve`, {
      headers: authHeader(staffToken),
    });
  });

  test('Khách hàng đóng yêu cầu hỗ trợ thành công (PATCH /support-requests/:id/close)', async ({ request }) => {
    const reqId = await getOrCreateRequestId(request);
    test.skip(!reqId, 'Cần createdRequestId');

    const response = await request.patch(`/support-requests/${reqId}/close`, {
      headers: authHeader(clientToken),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('CLOSED');
    expect(body.data.closedAt).toBeDefined();
  });

  test('Không thể gửi thêm tin nhắn khi yêu cầu đã đóng (POST /support-requests/:id/messages)', async ({ request }) => {
    const reqId = await getOrCreateRequestId(request);
    test.skip(!reqId, 'Cần createdRequestId');

    const response = await request.post(`/support-requests/${reqId}/messages`, {
      headers: authHeader(clientToken),
      data: { content: 'Tin nhắn này không được gửi vì ticket đã đóng' },
    });

    expect(response.status()).toBe(400);
  });
});
