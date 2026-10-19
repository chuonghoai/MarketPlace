import { test, expect } from '@playwright/test';
import { getAuthToken, TEST_USERS } from '../helpers/auth.helper';

test.describe('API - Order Tracking & Filter (MKP-062)', () => {
  let clientToken: string;

  test.beforeAll(async ({ request }) => {
    clientToken = await getAuthToken(request, TEST_USERS.client);
  });

  test('Test G1: GET /orders/tracking không truyền status trả về toàn bộ đơn hàng (bao gồm CANCELLED)', async ({ request }) => {
    const response = await request.get('/orders/tracking', {
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);

    const orders: any[] = body.data;
    // Kiểm tra có chứa đơn CANCELLED
    const cancelledOrders = orders.filter((o) => o.orderStatus === 'CANCELLED');
    expect(cancelledOrders.length).toBeGreaterThanOrEqual(3);

    // Kiểm tra có chứa đơn PENDING
    const pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING');
    expect(pendingOrders.length).toBeGreaterThanOrEqual(1);

    // Tổng số đơn phải bao gồm cả PENDING và CANCELLED
    expect(orders.length).toBeGreaterThanOrEqual(pendingOrders.length + cancelledOrders.length);
  });

  test('Test G2: GET /orders/tracking?status=ALL trả về toàn bộ đơn hàng (bao gồm CANCELLED)', async ({ request }) => {
    const response = await request.get('/orders/tracking?status=ALL', {
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);

    const orders: any[] = body.data;
    const cancelledOrders = orders.filter((o) => o.orderStatus === 'CANCELLED');
    expect(cancelledOrders.length).toBeGreaterThanOrEqual(3);
  });

  test('Test G3: GET /orders/tracking?status=CANCELLED chỉ trả về đơn hàng ở trạng thái CANCELLED', async ({ request }) => {
    const response = await request.get('/orders/tracking?status=CANCELLED', {
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);

    const orders: any[] = body.data;
    expect(orders.length).toBe(3);
    for (const order of orders) {
      expect(order.orderStatus).toBe('CANCELLED');
    }
  });

  test('Test G4: GET /orders/tracking/count tính đầy đủ số lượng cho tab "all" gồm cả đơn CANCELLED', async ({ request }) => {
    const response = await request.get('/orders/tracking/count', {
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    const count = body.data;

    expect(count.cancelled).toBe(3);
    expect(count.all).toBeGreaterThanOrEqual(count.cancelled + count.pending);
    expect(count.all).toBe(count.pending + count.preparing + count.shipping + count.success + count.cancelled + count.returned);
  });

  test('Test G5: GET /orders/tracking yêu cầu xác thực JWT (bảo vệ quyền truy cập)', async ({ request }) => {
    const response = await request.get('/orders/tracking');
    expect(response.status()).toBe(401);
  });

  test('Test G6: GET /orders/tracking?status=ABC (status không hợp lệ) bị từ chối với HTTP 400 Bad Request', async ({ request }) => {
    const response = await request.get('/orders/tracking?status=ABC', {
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBeDefined();
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.message).toContain('status must be one of the following values');
  });

  test('Test G7: GET /orders/tracking?status=all (chữ thường) được chuẩn hóa và trả về toàn bộ đơn hàng', async ({ request }) => {
    const response = await request.get('/orders/tracking?status=all', {
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    const orders: any[] = body.data;
    const cancelledOrders = orders.filter((o) => o.orderStatus === 'CANCELLED');
    expect(cancelledOrders.length).toBeGreaterThanOrEqual(3);
  });

  test('Test G8: GET /orders/tracking?status=cancelled (chữ thường) được chuẩn hóa và chỉ trả về đơn CANCELLED', async ({ request }) => {
    const response = await request.get('/orders/tracking?status=cancelled', {
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    const orders: any[] = body.data;
    expect(orders.length).toBe(3);
    for (const order of orders) {
      expect(order.orderStatus).toBe('CANCELLED');
    }
  });
});
