import { test, expect } from '@playwright/test';
import { getAuthToken } from '../helpers/auth.helper';

test.describe('API - Ví điện tử của web (UC20, QĐ4)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test('Lấy thông tin ví thành công hoặc tự động khởi tạo nếu chưa có', async ({ request }) => {
    const response = await request.get('/wallets/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('balance');
    expect(body.data).toHaveProperty('status');
    expect(typeof body.data.balance).toBe('number');
    expect(body.data.balance).toBeGreaterThanOrEqual(0);
  });

  test('Nạp tiền vào ví điện tử thành công', async ({ request }) => {
    const topupAmount = 50000;
    const response = await request.post('/wallets/topup', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        amount: topupAmount,
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.success).toBe(true);
    expect(body.data.balance).toBeGreaterThanOrEqual(topupAmount);
    expect(body.data.transaction.amount).toBe(topupAmount);
    expect(body.data.transaction.type).toBe('TOPUP');
  });

  test('Từ chối nạp tiền nếu số tiền nhỏ hơn 1.000 ₫', async ({ request }) => {
    const response = await request.post('/wallets/topup', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        amount: 500,
      },
    });

    expect(response.status()).toBe(400);
  });

  test('Lấy danh sách lịch sử biến động số dư thành công', async ({ request }) => {
    const response = await request.get('/wallets/transactions?page=1&limit=10', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data.items)).toBe(true);
    expect(body.data.items.length).toBeGreaterThan(0);
    expect(body.data).toHaveProperty('total');
    expect(body.data).toHaveProperty('page');
  });

  test('API prepare checkout trả về thông tin ví khả dụng của khách hàng', async ({ request }) => {
    // Lấy 1 sản phẩm để prepare
    const prodRes = await request.get('/products?pageSize=1');
    const prodBody = await prodRes.json();
    const list = prodBody.data?.products || prodBody.data || [];
    if (list.length === 0) return;

    const sampleProductId = list[0].id;
    const prepRes = await request.post('/orders/prepare-cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        items: [{ productId: sampleProductId, quantity: 1 }],
      },
    });

    expect(prepRes.status()).toBe(201);
    const prepBody = await prepRes.json();
    expect(prepBody.success).toBe(true);
    expect(prepBody.data).toHaveProperty('walletInfo');
    expect(prepBody.data.walletInfo).toHaveProperty('balance');
    expect(prepBody.data.walletInfo).toHaveProperty('status');
  });

  test('Thanh toán đơn hàng bằng ví điện tử và tự động hoàn tiền khi hủy đơn (UC20, QĐ4)', async ({ request }) => {
    // 1. Nạp đủ tiền vào ví
    const topupAmount = 2000000;
    await request.post('/wallets/topup', {
      headers: { Authorization: `Bearer ${token}` },
      data: { amount: topupAmount },
    });

    const walletBeforeRes = await request.get('/wallets/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const walletBefore = (await walletBeforeRes.json()).data.balance;

    // 2. Lấy sản phẩm và địa chỉ
    const prodRes = await request.get('/products?pageSize=1');
    const prodList = (await prodRes.json()).data?.products || (await prodRes.json()).data || [];
    if (prodList.length === 0) return;
    const sampleProduct = prodList[0];

    const addrRes = await request.get('/users/me/address', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const addrs = (await addrRes.json()).data || [];
    let addressId = addrs.length > 0 ? addrs[0].id : null;

    if (!addressId) {
      const newAddrRes = await request.post('/users/me/address', {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          fullName: 'Test User',
          phoneNumber: '0912345678',
          provinceCode: 79,
          provinceName: 'TP. Hồ Chí Minh',
          districtCode: 760,
          districtName: 'Quận 1',
          wardCode: 26734,
          wardName: 'Phường Bến Nghé',
          street: '123 Le Loi',
          fullAddress: '123 Le Loi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
          isDefault: true,
        },
      });
      addressId = (await newAddrRes.json()).data.id;
    }

    // 3. Đặt hàng sử dụng ví điện tử (Full Payment)
    const checkoutRes = await request.post('/orders/checkout', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        items: [{ productId: sampleProduct.id, quantity: 1 }],
        addressId,
        paymentMethod: 'COD',
        useWallet: true,
      },
    });

    expect(checkoutRes.status()).toBe(201);
    const checkoutBody = await checkoutRes.json();
    expect(checkoutBody.success).toBe(true);
    const orderId = checkoutBody.data.orderId;
    expect(orderId).toBeDefined();

    // 4. Kiểm tra số dư ví sau khi trừ
    const walletAfterRes = await request.get('/wallets/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const walletAfter = (await walletAfterRes.json()).data.balance;
    expect(walletAfter).toBeLessThan(walletBefore);
    const deducted = walletBefore - walletAfter;

    // 5. Kiểm tra chi tiết đơn hàng
    const orderDetailRes = await request.get(`/orders/tracking/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(orderDetailRes.status()).toBe(200);

    // 6. Hủy đơn hàng và kiểm tra tự động hoàn tiền về ví (QĐ4)
    const cancelRes = await request.patch(`/orders/tracking/${orderId}/status`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        newStatus: 'CANCELLED',
        note: 'Hủy đơn kiểm thử hoàn tiền ví điện tử',
      },
    });
    expect(cancelRes.status()).toBe(200);

    // 7. Kiểm tra số dư ví đã được hoàn lại đúng số tiền đã cấn trừ
    const walletRefundRes = await request.get('/wallets/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const walletRefund = (await walletRefundRes.json()).data.balance;
    expect(walletRefund).toBe(walletAfter + deducted);

    // 8. Kiểm tra giao dịch REFUND được ghi nhận trong lịch sử
    const txRes = await request.get('/wallets/transactions?limit=1', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const latestTx = (await txRes.json()).data.items[0];
    expect(latestTx.type).toBe('REFUND');
    expect(latestTx.amount).toBe(deducted);
  });
});
