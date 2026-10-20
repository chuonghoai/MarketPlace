import { test, expect } from '@playwright/test';
import { getAuthToken, TEST_USERS } from '../helpers/auth.helper';

/**
 * UC18: Ví điện tử - Kiểm thử API (MKP_088)
 */
test.describe('API - Ví điện tử (UC18 / MKP_088)', () => {
  let clientToken: string;

  test.beforeAll(async ({ request }) => {
    clientToken = await getAuthToken(request, TEST_USERS.client);
  });

  test('Lấy thông tin ví và số dư khả dụng của khách hàng thành công (GET /wallets/me)', async ({ request }) => {
    const response = await request.get('/wallets/me', {
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('balance');
    expect(body.data).toHaveProperty('status');
  });

  test('Từ chối nạp tiền ví khi gửi phương thức cổng thanh toán lạ (400 Bad Request) (MKP_088)', async ({ request }) => {
    const response = await request.post('/wallets/topup', {
      headers: { Authorization: `Bearer ${clientToken}` },
      data: {
        amount: 50000,
        paymentMethod: 'DIRECT',
      },
    });

    expect(response.status(), 'Máy chủ phải trả về 400 Bad Request khi paymentMethod không hợp lệ').toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('Từ chối nạp tiền khi số tiền nạp nhỏ hơn hạn mức tối thiểu 10.000 ₫ (POST /wallets/topup)', async ({ request }) => {
    const response = await request.post('/wallets/topup', {
      headers: { Authorization: `Bearer ${clientToken}` },
      data: {
        amount: 5000,
        paymentMethod: 'VNPAY',
      },
    });

    expect([400, 422]).toContain(response.status());
  });

  test('Từ chối yêu cầu rút tiền khi số tiền vượt quá số dư khả dụng (POST /wallets/withdraw)', async ({ request }) => {
    const response = await request.post('/wallets/withdraw', {
      headers: { Authorization: `Bearer ${clientToken}` },
      data: {
        amount: 999999999,
        bankName: 'MBBANK',
        bankAccountNumber: '0987654321',
        bankAccountName: 'NGUYEN VAN A',
      },
    });

    expect([400, 422]).toContain(response.status());
  });
});
