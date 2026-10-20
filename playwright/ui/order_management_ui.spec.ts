import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from '../helpers/auth.helper';

const mockPendingOrder = {
  id: 'dfc0bab3-8fc6-407a-9a99-b14be261c37b',
  orderStatus: 'PENDING',
  paymentStatus: 'PENDING',
  paymentMethod: 'COD',
  totalAmount: 45000,
  subTotal: 45000,
  shippingFee: 0,
  vouchers: [],
  totalProductQuantity: 1,
  firstProductName: 'Phễu đan tre',
  firstProductImageUrl: 'https://via.placeholder.com/150',
  createdAt: new Date().toISOString(),
  buyerName: 'Nguyễn Văn Test',
  buyerPhone: '0901234567',
  buyerAddress: '227 Nguyễn Văn Cừ, Quận 5, TP.HCM',
  statusHistory: [
    { status: 'PENDING', timestamp: new Date().toISOString(), note: 'Đơn hàng mới tạo' },
  ],
  items: [
    {
      productId: 'p-pheu-tre',
      productName: 'Phễu đan tre',
      productImageUrl: 'https://via.placeholder.com/150',
      price: 45000,
      originalPrice: 45000,
      discountPercentage: 0,
      quantity: 1,
      amount: 45000,
    },
  ],
};

const mockDeliveringOrder = {
  id: 'order-delivering-test-id',
  orderStatus: 'DELIVERING',
  paymentStatus: 'PAID',
  paymentMethod: 'VNPAY',
  totalAmount: 90000,
  subTotal: 90000,
  shippingFee: 0,
  vouchers: [],
  totalProductQuantity: 2,
  firstProductName: 'Sản phẩm đang vận chuyển',
  firstProductImageUrl: 'https://via.placeholder.com/150',
  createdAt: new Date().toISOString(),
  buyerName: 'Nguyễn Văn Test',
  buyerPhone: '0901234567',
  buyerAddress: '227 Nguyễn Văn Cừ, Quận 5, TP.HCM',
  statusHistory: [
    { status: 'PENDING', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { status: 'PREPARING', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { status: 'DELIVERING', timestamp: new Date().toISOString() },
  ],
  items: [
    {
      productId: 'p-item-delivering',
      productName: 'Sản phẩm đang vận chuyển',
      productImageUrl: 'https://via.placeholder.com/150',
      price: 90000,
      originalPrice: 90000,
      discountPercentage: 0,
      quantity: 2,
      amount: 90000,
    },
  ],
};

const mockAdminOrder = {
  id: 'admin-order-pending-id',
  createdAt: new Date().toISOString(),
  orderStatus: 'PENDING',
  paymentStatus: 'PAID',
  paymentMethod: 'VNPAY',
  totalAmount: 150000,
  subTotal: 150000,
  shippingFee: 0,
  discountAmount: 0,
  buyerName: 'Nguyễn Văn Test',
  buyerPhone: '0901234567',
  buyerAddress: '227 Nguyễn Văn Cừ, Quận 5, TP.HCM',
  latitude: 10.762622,
  longitude: 106.682333,
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
    { status: 'PENDING', timestamp: new Date().toISOString(), note: 'Đơn hàng mới tạo' },
  ],
};

test.describe('UC14: Quản lý đơn hàng (MKP_056 -> MKP_062)', () => {
  test('Hiển thị danh sách đơn hàng của người dùng khi đã đăng nhập (MKP_056)', async ({ page }) => {
    await loginViaUI(page, TEST_USERS.client);
    await page.goto('/profile/orders', { waitUntil: 'domcontentloaded' });

    // Kiểm tra tiêu đề trang
    await expect(page.locator('h2', { hasText: 'Theo dõi đơn hàng' })).toBeVisible({ timeout: 10000 });

    // Kiểm tra đầy đủ các tab trạng thái đơn hàng trên UI
    const expectedTabs = ['Tất cả', 'Chờ xác nhận', 'Đang chuẩn bị', 'Đang giao', 'Đã giao', 'Đã hủy'];
    for (const tabName of expectedTabs) {
      await expect(page.getByRole('button', { name: tabName, exact: false })).toBeVisible();
    }

    // Danh sách thẻ đơn hàng hiển thị
    const cards = page.locator('div.border-border-subtle.rounded-xl');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test('Chức năng hủy đơn hàng ở trạng thái Chờ xử lý (PENDING) (MKP_057)', async ({ page }) => {
    let orderStatus = 'PENDING';

    await page.route('**/orders/tracking/**/status', async (route) => {
      orderStatus = 'CANCELLED';
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Hủy đơn hàng thành công!',
          data: { ...mockPendingOrder, orderStatus: 'CANCELLED' },
        }),
      });
    });

    await page.route('**/orders/tracking*', async (route) => {
      const url = route.request().url();
      if (url.includes('/orders/tracking/count')) {
        return route.continue();
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [{ ...mockPendingOrder, orderStatus }],
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.client);
    await page.goto('/profile/orders', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h2', { hasText: 'Theo dõi đơn hàng' })).toBeVisible({ timeout: 10000 });

    // Tìm đơn hàng PENDING và bấm "Hủy đơn"
    const orderCard = page.locator('div.border-border-subtle.rounded-xl').first();
    const cancelBtn = orderCard.getByRole('button', { name: 'Hủy đơn' });
    await expect(cancelBtn).toBeVisible({ timeout: 5000 });
    await cancelBtn.click();

    // Modal xác nhận hủy mở ra
    await expect(page.locator('h3', { hasText: 'Hủy đơn hàng' })).toBeVisible({ timeout: 5000 });

    // Nhập lý do hủy bắt buộc
    const textarea = page.locator('#cancel-note');
    await expect(textarea).toBeVisible();
    await textarea.fill('Đổi ý không muốn mua nữa');

    // Chờ nút xác nhận được kích hoạt
    const confirmCancelBtn = page.getByRole('button', { name: 'Xác nhận hủy đơn hàng' });
    await expect(confirmCancelBtn).toBeEnabled({ timeout: 5000 });
    await confirmCancelBtn.click();

    // Hiển thị toast thông báo thành công
    const toast = page.locator('.fixed').getByText(/Hủy đơn hàng thành công|thành công/i);
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('Lọc đơn hàng theo tab trạng thái Đã hủy (MKP_058)', async ({ page }) => {
    await loginViaUI(page, TEST_USERS.client);
    await page.goto('/profile/orders', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h2', { hasText: 'Theo dõi đơn hàng' })).toBeVisible({ timeout: 10000 });

    // Click chọn tab "Đã hủy"
    const cancelledTab = page.getByRole('button', { name: 'Đã hủy', exact: false });
    await cancelledTab.click();
    await expect(cancelledTab).toHaveClass(/border-market-primary/);

    // Chờ danh sách tải xong
    const cards = page.locator('div.border-border-subtle.rounded-xl');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    const totalCards = await cards.count();
    expect(totalCards).toBeGreaterThanOrEqual(1);

    // Tất cả các thẻ hiển thị đều phải có badge "Đã hủy"
    const cancelledBadges = cards.locator('span', { hasText: 'Đã hủy' });
    expect(await cancelledBadges.count()).toBe(totalCards);

    // Không có các trạng thái khác như "Chờ xác nhận"
    const pendingBadges = cards.locator('span', { hasText: 'Chờ xác nhận' });
    expect(await pendingBadges.count()).toBe(0);
  });

  test('Khóa hoặc ẩn nút Hủy đơn hàng khi đơn đã chuyển sang trạng thái Đang giao hàng (MKP_059)', async ({ page }) => {
    // Mock danh sách đơn hàng chứa đơn Đang giao hàng
    await page.route('**/orders/tracking*', async (route) => {
      if (route.request().url().includes('/orders/tracking/count')) {
        return route.continue();
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [mockDeliveringOrder],
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.client);
    await page.goto('/profile/orders', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h2', { hasText: 'Theo dõi đơn hàng' })).toBeVisible({ timeout: 10000 });

    // Trên thẻ đơn hàng ở danh sách: Nút "Hủy đơn" không xuất hiện
    const orderCard = page.locator('div.border-border-subtle.rounded-xl').first();
    await expect(orderCard).toBeVisible({ timeout: 5000 });
    const cancelBtnOnList = orderCard.getByRole('button', { name: 'Hủy đơn' });
    await expect(cancelBtnOnList).not.toBeVisible();

    // Truy cập vào trang chi tiết đơn hàng đang giao
    await page.route(`**/orders/tracking/${mockDeliveringOrder.id}*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockDeliveringOrder,
        }),
      });
    });

    await page.goto(`/profile/orders/${mockDeliveringOrder.id}`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');

    // Nút "Hủy đơn" trên trang chi tiết cũng không xuất hiện
    const cancelBtnOnDetail = page.getByRole('button', { name: 'Hủy đơn' });
    await expect(cancelBtnOnDetail).not.toBeVisible();
  });

  test('Xem thông tin chi tiết một đơn hàng cụ thể (MKP_060)', async ({ page }) => {
    await page.route(`**/orders/tracking/${mockPendingOrder.id}*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockPendingOrder,
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.client);
    await page.goto(`/profile/orders/${mockPendingOrder.id}`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');

    // URL đúng mã đơn hàng
    expect(page.url()).toContain(mockPendingOrder.id);

    // Hiển thị thông tin địa chỉ giao hàng
    await expect(page.getByText('Địa chỉ nhận hàng')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('227 Nguyễn Văn Cừ')).toBeVisible();

    // Hiển thị danh sách sản phẩm và tổng tiền
    await expect(page.getByText('Phễu đan tre')).toBeVisible();
    await expect(page.getByText(/45\.000/).first()).toBeVisible();
  });

  test('Quản trị viên/Nhân viên cập nhật trạng thái đơn hàng từ PENDING sang PREPARING (MKP_061)', async ({ page }) => {
    const adminOrderId = 'admin-order-pending-id';

    await page.route('**/admin/order/**', async (route) => {
      const headers = {
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      };

      if (route.request().method() === 'OPTIONS') {
        return route.fulfill({ status: 204, headers });
      }

      if (route.request().method() === 'PATCH') {
        return route.fulfill({
          status: 200,
          headers,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Cập nhật trạng thái thành công',
            data: {
              ...mockAdminOrder,
              id: adminOrderId,
              orderStatus: 'PREPARING',
            },
          }),
        });
      }

      return route.fulfill({
        status: 200,
        headers,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            ...mockAdminOrder,
            id: adminOrderId,
          },
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto(`/admin/orders/${adminOrderId}`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');

    // Trang chi tiết đơn hàng hiển thị nút "Xác Nhận Đơn"
    const confirmBtn = page.getByRole('button', { name: /Xác Nhận Đơn/i });
    await expect(confirmBtn).toBeVisible({ timeout: 5000 });

    // Bấm nút cập nhật trạng thái
    await confirmBtn.click();

    // Trạng thái cập nhật thành PREPARING (hiển thị nút bước tiếp theo: Giao Cho ĐVVC)
    await expect(page.getByRole('button', { name: /Giao Cho ĐVVC/i })).toBeVisible({ timeout: 5000 });
  });

  test('Hiển thị danh sách đơn hàng tại tab Tất cả khi tài khoản có các đơn đã hủy (MKP_062)', async ({ page }) => {
    await loginViaUI(page, TEST_USERS.client);
    await page.goto('/profile/orders', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h2', { hasText: 'Theo dõi đơn hàng' })).toBeVisible({ timeout: 10000 });

    // Tab Tất cả đang được chọn
    const allTab = page.getByRole('button', { name: 'Tất cả', exact: false });
    await expect(allTab).toBeVisible();
    await expect(allTab).toHaveClass(/border-market-primary/);

    const cards = page.locator('div.border-border-subtle.rounded-xl');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    // Đảm bảo không hiển thị empty state khi có đơn
    await expect(page.locator('h3', { hasText: 'Chưa có đơn hàng' })).not.toBeVisible();

    // Các đơn CANCELLED xuất hiện với badge "Đã hủy"
    const cancelledBadges = cards.locator('span', { hasText: 'Đã hủy' });
    await expect(cancelledBadges.first()).toBeVisible({ timeout: 5000 });
  });
});
