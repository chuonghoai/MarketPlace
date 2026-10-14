import { test, expect } from '@playwright/test';
import { TEST_USERS, getAuthToken } from '../helpers/auth.helper';

/**
 * BỘ KIỂM THỬ HỘP ĐEN API (MKP_077 -> MKP_094)
 * Dự án: Sàn thương mại điện tử MarketPlace
 * Người thực hiện: Đạt (Nguyễn Tiến Đạt)
 * Module: UC18 - Quản lý ví điện tử
 */

test.describe('BỘ KIỂM THỬ HỘP ĐEN API - NGUYỄN TIẾN ĐẠT (MKP_077 -> MKP_094)', () => {

  test('MKP_088 - [API/Security - EXPECTED FAIL] Lỗ hổng nạp tiền ví khi gửi phương thức cổng thanh toán lạ tự động cộng tiền thẳng vào ví', async ({ request }) => {
    // 1. Lấy token xác thực của khách hàng hợp lệ
    const token = await getAuthToken(request, TEST_USERS.client);

    // 2. Gửi request nạp tiền với phương thức thanh toán không tồn tại ("DIRECT")
    const response = await request.post('http://127.0.0.1:3000/wallets/topup', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        amount: 50000,
        paymentMethod: 'DIRECT',
      },
    });

    // KỲ VỌNG: Hệ thống phải kiểm tra whitelist phương thức thanh toán hợp lệ (VNPAY, MOMO, PAYPAL).
    // Máy chủ phải từ chối yêu cầu với HTTP 400 Bad Request: "Phương thức thanh toán không hợp lệ" và không cộng tiền vào ví.
    // THỰC TẾ: Backend chấp nhận request và tự động ghi nhận thành công, cộng 50.000 VNĐ vào ví người dùng không qua cổng thanh toán.
    expect(response.status(), 'Máy chủ phải trả về lỗi 400 Bad Request khi nhận phương thức thanh toán không hợp lệ').toBe(400);
  });

});
