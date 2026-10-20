import { test, expect } from '@playwright/test';
import { TEST_USERS, loginViaUI } from '../helpers/auth.helper';

/**
 * UC23: Quản lý đổi trả hàng (MKP_091 -> MKP_094)
 * Kiểm thử hộp đen giao diện người dùng và quy trình đổi trả
 */
test.describe('UC23: Xử lý đổi trả hàng (MKP_091 -> MKP_094)', () => {

  const mockSuccessOrder = {
    id: '1299df2e-9fbc-4047-a0d1-f1abee3fa826',
    orderStatus: 'SUCCESS',
    paymentStatus: 'PAID',
    paymentMethod: 'VNPAY',
    totalAmount: 150000,
    totalProductQuantity: 1,
    firstProductName: 'Sản phẩm thủ công gốm Bát Tràng',
    firstProductImageUrl: 'https://via.placeholder.com/150',
    createdAt: new Date().toISOString(),
    statusHistory: [
      { status: 'SUCCESS', timestamp: new Date().toISOString() },
    ],
  };

  test('Quy trình duyệt đơn hoàn trả - Duy trì nút "Xử lý hoàn trả" trong các bước xử lý (MKP_091)', async ({ page }) => {
    const returnOrderId = 'eeb164d5-d103-4213-9825-8bae97e0151f';
    let currentReturnStatus = 'PICKING_UP';

    // Mock API chi tiết đơn hàng hoàn trả
    await page.route(`**/admin/order/${returnOrderId}*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: returnOrderId,
            orderStatus: 'RETURNED',
            returnStatus: currentReturnStatus,
            paymentStatus: 'PAID',
            paymentMethod: 'VNPAY',
            totalAmount: 150000,
            buyerName: 'Nguyễn Văn A',
            buyerPhone: '0901234567',
            buyerAddress: '123 Đường Lê Lợi, TP. Hồ Chí Minh',
            createdAt: new Date().toISOString(),
            items: [
              {
                productId: 'p-1',
                productName: 'Sản phẩm thủ công gốm Bát Tràng',
                productImageUrl: 'https://via.placeholder.com/150',
                price: 150000,
                originalPrice: 150000,
                discountPercentage: 0,
                quantity: 1,
                amount: 150000,
              },
            ],
            statusHistory: [
              { status: 'RETURNED', timestamp: new Date().toISOString(), note: 'Yêu cầu trả hàng đã được duyệt' },
            ],
          },
        }),
      });
    });

    // Mock danh sách return request và các endpoint cập nhật bước (pickup/refund/exchange)
    await page.route('**/admin/order/return-requests**', async (route) => {
      if (route.request().method() === 'PATCH' || route.request().method() === 'PUT') {
        currentReturnStatus = 'RECEIVED';
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, message: 'Cập nhật tiến trình thành công' }),
        });
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            items: [
              {
                id: 'ret-req-1',
                orderId: returnOrderId,
                type: 'RETURN_REFUND',
                status: currentReturnStatus,
                title: 'Sản phẩm lỗi nứt vỡ',
                reason: 'Giao hàng bị nứt phần đế',
              },
            ],
            total: 1,
          },
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto(`/admin/orders/${returnOrderId}`);
    await page.waitForLoadState('domcontentloaded');

    // Bước 1: Xem chi tiết đơn hoàn trả -> Hiển thị thông tin và nút "Xử lý hoàn trả"
    const processBtn = page.getByRole('button', { name: /Xử lý hoàn trả/i });
    await expect(processBtn, 'Trang chi tiết phải hiển thị nút "Xử lý hoàn trả"').toBeVisible({ timeout: 5000 });

    // Bước 2: Nhấn nút "Xử lý hoàn trả" -> Hiển thị modal quy trình hoàn trả
    await processBtn.click();
    await expect(page.getByRole('heading', { name: /Quy trình xử lý hoàn trả/i })).toBeVisible({ timeout: 5000 });

    // Bước 3: Nhấn nút xác nhận duyệt bước hiện tại
    const stepConfirmBtn = page.locator('button').filter({ hasText: /Xác nhận/i }).last();
    await expect(stepConfirmBtn).toBeVisible({ timeout: 5000 });
    await stepConfirmBtn.click();

    // KỲ VỌNG: Nút "Xử lý hoàn trả" vẫn hiển thị trên trang chi tiết để tiếp tục bước sau
    await expect(processBtn, 'Sau khi duyệt bước 1, nút "Xử lý hoàn trả" vẫn phải hiển thị trên trang chi tiết để tiếp tục bước sau').toBeVisible({ timeout: 3000 });
  });

  test('Vô hiệu hóa nút "Gửi yêu cầu xử lý" trên modal Đổi trả khi để trống thông tin bắt buộc (MKP_092)', async ({ page }) => {
    await page.route('**/orders/tracking*', async (route) => {
      if (route.request().url().includes('/orders/tracking/count')) {
        return route.continue();
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Lấy danh sách đơn hàng thành công',
          data: [mockSuccessOrder],
        }),
      });
    });

    await loginViaUI(page);
    await page.goto('/profile/order/tracking');
    await page.waitForLoadState('domcontentloaded');

    // Chuyển sang tab Đã giao
    await page.getByRole('button', { name: /Đã giao/i }).click();

    // Tìm thẻ đơn hàng và mở modal Yêu cầu trả hàng
    const returnBtn = page.getByRole('button', { name: 'Yêu cầu trả hàng', exact: true }).last();
    await expect(returnBtn).toBeVisible({ timeout: 5000 });
    await returnBtn.click();

    // Kiểm tra modal xuất hiện
    await expect(page.getByRole('heading', { name: /Yêu cầu xử lý đổi trả/i })).toBeVisible({ timeout: 5000 });

    // Khi chưa điền Tiêu đề và Lý do, nút "Gửi yêu cầu xử lý" phải bị disabled
    const submitBtn = page.getByRole('button', { name: /Gửi yêu cầu xử lý/i });
    await expect(submitBtn).toBeDisabled();
  });

  test('Quản trị viên truy cập trang quản lý yêu cầu rút tiền / hoàn tiền Admin (MKP_093)', async ({ page }) => {
    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/wallets/withdrawals');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: /Quản lý yêu cầu rút tiền/i })).toBeVisible({ timeout: 10000 });
  });

  test('Modal Yêu cầu đổi trả kiểm tra phần tải lên minh chứng hình ảnh/video (MKP_094)', async ({ page }) => {
    await page.route('**/orders/tracking*', async (route) => {
      if (route.request().url().includes('/orders/tracking/count')) {
        return route.continue();
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Lấy danh sách đơn hàng thành công',
          data: [mockSuccessOrder],
        }),
      });
    });

    await loginViaUI(page);
    await page.goto('/profile/order/tracking');
    await page.waitForLoadState('domcontentloaded');

    // Chuyển sang tab Đã giao
    await page.getByRole('button', { name: /Đã giao/i }).click();

    // Tìm thẻ đơn hàng và mở modal Yêu cầu trả hàng
    const returnBtn = page.getByRole('button', { name: 'Yêu cầu trả hàng', exact: true }).last();
    await expect(returnBtn).toBeVisible({ timeout: 5000 });
    await returnBtn.click();
    await expect(page.getByRole('heading', { name: /Yêu cầu xử lý đổi trả/i })).toBeVisible({ timeout: 5000 });

    const directUploadElement = page.locator('input[type="file"], button:has-text("Tải ảnh từ máy"), button:has-text("Tải video từ máy"), button:has-text("Tải lên trực tiếp")');
    await expect(directUploadElement.first(), 'Giao diện modal đổi trả phải cung cấp nút/input để tải ảnh hoặc video trực tiếp từ thiết bị').toBeVisible({ timeout: 2000 });
  });

});
