import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from '../helpers/auth.helper';

const mockSupportTicket = {
  id: '838e2a0f-b3ee-4760-9fd3-d039cd1433e2',
  title: 'Playwright API Test - Cần hỗ trợ thanh toán',
  content: 'Tôi cần hỗ trợ tra cứu tiến độ xử lý và khiếu nại thanh toán đơn hàng.',
  status: 'RESOLVED',
  requesterId: 'client-user-id',
  assignedStaffId: 'staff-user-id',
  assignedStaff: {
    id: 'staff-user-id',
    fullName: 'Trần Thị Mai',
    email: 'mai.tran@marketnest.vn',
  },
  createdAt: new Date(Date.now() - 86400000).toISOString(),
  messages: [
    {
      id: 'msg-1',
      requestId: '838e2a0f-b3ee-4760-9fd3-d039cd1433e2',
      senderId: 'client-user-id',
      content: 'Chào ban hỗ trợ, đơn hàng của tôi bị trừ tiền nhưng chưa thấy cập nhật.',
      createdAt: new Date(Date.now() - 72000000).toISOString(),
      sender: { fullName: 'Khách hàng' },
    },
    {
      id: 'msg-2',
      requestId: '838e2a0f-b3ee-4760-9fd3-d039cd1433e2',
      senderId: 'staff-user-id',
      content: 'Chào bạn, chúng tôi đã đối soát với cổng thanh toán và xác nhận đơn hàng thành công.',
      createdAt: new Date(Date.now() - 36000000).toISOString(),
      sender: { fullName: 'Trần Thị Mai' },
    },
  ],
};

const mockOpenTicket = {
  id: 'open-ticket-test-id',
  title: 'Yêu cầu kiểm thử tự động Playwright - Tra cứu',
  content: 'Tôi cần hỗ trợ tra cứu tiến độ xử lý và khiếu nại',
  status: 'OPEN',
  requesterId: 'client-user-id',
  createdAt: new Date().toISOString(),
  messages: [],
};

test.describe('UC20: Yêu cầu hỗ trợ (MKP_063 -> MKP_069)', () => {
  test('Người dùng tạo yêu cầu hỗ trợ mới thành công với dữ liệu hợp lệ (MKP_063)', async ({ page }) => {
    let createdTicket = mockOpenTicket;

    await page.route('**/support-requests/my*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [createdTicket],
        }),
      });
    });

    await page.route('**/support-requests', async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: mockOpenTicket,
          }),
        });
      }
      return route.continue();
    });

    await loginViaUI(page, TEST_USERS.client);
    await page.goto('/profile/support', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1', { hasText: 'Yêu cầu hỗ trợ' })).toBeVisible({ timeout: 10000 });

    // Mở modal tạo yêu cầu
    await page.getByRole('button', { name: 'Tạo yêu cầu mới' }).click();
    await expect(page.locator('h3', { hasText: 'Tạo yêu cầu mới' })).toBeVisible();

    // Điền tiêu đề và nội dung hợp lệ
    const titleInput = page.getByPlaceholder('Mô tả ngắn gọn vấn đề bạn gặp phải...');
    await titleInput.fill('Yêu cầu kiểm thử tự động Playwright - Tra cứu');

    const contentInput = page.getByPlaceholder('Cung cấp thêm chi tiết (mã đơn hàng, ảnh chụp màn hình, thời gian...)...');
    await contentInput.fill('Tôi cần hỗ trợ tra cứu tiến độ xử lý và khiếu nại');

    // Nhấn Xác nhận gửi form
    await page.getByRole('button', { name: 'Xác nhận' }).click();

    // Toast thành công hiển thị
    await expect(page.getByText('Đã tạo yêu cầu hỗ trợ thành công')).toBeVisible({ timeout: 5000 });

    // Modal được đóng
    await expect(page.locator('h3', { hasText: 'Tạo yêu cầu mới' })).not.toBeVisible();
  });

  test('Xác thực form khi để trống tiêu đề hoặc nội dung yêu cầu hỗ trợ (MKP_064)', async ({ page }) => {
    let apiCalled = false;
    await page.route('**/support-requests', async (route) => {
      if (route.request().method() === 'POST') {
        apiCalled = true;
        await route.abort();
      } else {
        await route.continue();
      }
    });

    await loginViaUI(page, TEST_USERS.client);
    await page.goto('/profile/support', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1', { hasText: 'Yêu cầu hỗ trợ' })).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'Tạo yêu cầu mới' }).click();
    await expect(page.locator('h3', { hasText: 'Tạo yêu cầu mới' })).toBeVisible();

    const titleInput = page.getByPlaceholder('Mô tả ngắn gọn vấn đề bạn gặp phải...');
    const contentInput = page.getByPlaceholder('Cung cấp thêm chi tiết (mã đơn hàng, ảnh chụp màn hình, thời gian...)...');
    const submitBtn = page.getByRole('button', { name: 'Xác nhận' });

    // Trường hợp 1: Để trống cả 2 ô
    await submitBtn.click();
    expect(apiCalled).toBe(false);
    await expect(page.locator('h3', { hasText: 'Tạo yêu cầu mới' })).toBeVisible();

    // Trường hợp 2: Chỉ nhập tiêu đề, để trống nội dung
    await titleInput.fill('Tiêu đề có nội dung nhưng chi tiết để trống');
    await submitBtn.click();
    expect(apiCalled).toBe(false);
    await expect(page.locator('h3', { hasText: 'Tạo yêu cầu mới' })).toBeVisible();

    // Trường hợp 3: Xóa tiêu đề, chỉ nhập chi tiết
    await titleInput.fill('');
    await contentInput.fill('Chi tiết có nội dung nhưng tiêu đề để trống');
    await submitBtn.click();
    expect(apiCalled).toBe(false);
    await expect(page.locator('h3', { hasText: 'Tạo yêu cầu mới' })).toBeVisible();
  });

  test('Xác thực độ dài: Tiêu đề <= 255 ký tự thành công, 256 ký tự bị chặn (MKP_065)', async ({ page }) => {
    let dialogTriggered = false;
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    await loginViaUI(page, TEST_USERS.client);
    await page.goto('/profile/support', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1', { hasText: 'Yêu cầu hỗ trợ' })).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'Tạo yêu cầu mới' }).click();

    // Nhập tiêu đề 256 ký tự
    const title256 = 'B'.repeat(256);
    const titleInput = page.getByPlaceholder('Mô tả ngắn gọn vấn đề bạn gặp phải...');
    await titleInput.fill(title256);

    const contentInput = page.getByPlaceholder('Cung cấp thêm chi tiết (mã đơn hàng, ảnh chụp màn hình, thời gian...)...');
    await contentInput.fill('Chi tiết vấn đề cho test 256 ký tự.');

    // Nhấn Xác nhận
    await page.getByRole('button', { name: 'Xác nhận' }).click();

    // 1. Kiểm tra inline error xuất hiện bên dưới trường tiêu đề
    const inlineError = page.locator('#title-error');
    await expect(inlineError).toBeVisible({ timeout: 5000 });
    await expect(inlineError).toHaveText('Tiêu đề tối đa 255 ký tự');

    // 2. Không có native alert nào được bật lên
    expect(dialogTriggered).toBe(false);

    // 3. Khi người dùng giảm xuống 255 ký tự, lỗi biến mất
    await titleInput.fill('B'.repeat(255));
    await expect(inlineError).not.toBeVisible();
  });

  test('Lọc danh sách yêu cầu hỗ trợ theo trạng thái xử lý Đã giải quyết (MKP_066)', async ({ page }) => {
    const listTickets = [
      { ...mockSupportTicket, id: 'ticket-res-1', status: 'RESOLVED', title: 'Ticket Đã giải quyết' },
      { ...mockOpenTicket, id: 'ticket-open-1', status: 'OPEN', title: 'Ticket Đang mở' },
    ];

    await page.route('**/support-requests/my*', async (route) => {
      const url = route.request().url();
      if (url.includes('status=RESOLVED')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [listTickets[0]],
          }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: listTickets,
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.client);
    await page.goto('/profile/support', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1', { hasText: 'Yêu cầu hỗ trợ' })).toBeVisible({ timeout: 10000 });

    // Ban đầu có cả 2 ticket
    await expect(page.getByText('Ticket Đang mở')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Ticket Đã giải quyết')).toBeVisible({ timeout: 5000 });

    // Chọn lọc trạng thái "Đã giải quyết"
    const statusSelect = page.locator('select').first();
    await statusSelect.selectOption({ label: 'Đã giải quyết' });

    // Chỉ còn ticket Đã giải quyết hiển thị
    await expect(page.getByText('Ticket Đã giải quyết')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Ticket Đang mở')).not.toBeVisible();

    // Chọn lại "Tất cả trạng thái"
    await statusSelect.selectOption({ value: '' });
    await expect(page.getByText('Ticket Đang mở')).toBeVisible({ timeout: 5000 });
  });

  test('Xem chi tiết yêu cầu hỗ trợ và lịch sử trao đổi tin nhắn hai chiều (MKP_067)', async ({ page }) => {
    await page.route('**/support-requests/my*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [mockSupportTicket],
        }),
      });
    });

    await page.route(`**/support-requests/${mockSupportTicket.id}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockSupportTicket,
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.client);
    await page.goto('/profile/support', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1', { hasText: 'Yêu cầu hỗ trợ' })).toBeVisible({ timeout: 10000 });

    // Click chọn ticket trong danh sách
    await page.getByText(mockSupportTicket.title).click();

    // Khung chi tiết bên phải hiển thị tiêu đề và tin nhắn trao đổi
    await expect(page.locator('h2, h3, h4').filter({ hasText: mockSupportTicket.title }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Chào ban hỗ trợ, đơn hàng của tôi bị trừ tiền')).toBeVisible();
    await expect(page.getByText('Chào bạn, chúng tôi đã đối soát với cổng thanh toán')).toBeVisible();
  });

  test('Nhân viên hỗ trợ xem danh sách yêu cầu cần xử lý tại trang quản trị (MKP_068)', async ({ page }) => {
    await page.route('**/support-requests/assigned*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [mockSupportTicket],
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.staff);
    await page.goto('/admin/support', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');

    // Tiêu đề trang quản lý hỗ trợ hiển thị
    await expect(page.getByRole('heading', { name: /Yêu cầu được phân công|Tất cả yêu cầu/i })).toBeVisible({ timeout: 10000 });

    // Danh sách yêu cầu hiển thị ticket cần xử lý
    await expect(page.getByText(mockSupportTicket.title)).toBeVisible({ timeout: 5000 });
  });

  test('Khách hàng gửi thêm phản hồi vào vé đã giải quyết cập nhật ngay sang Đang xử lý (MKP_069)', async ({ page }) => {
    const ticketId = 'ticket-resolved-test-mkp069';
    const mockResolvedTicket = {
      id: ticketId,
      title: 'Ticket cần hỗ trợ lại sau khi đã giải quyết',
      content: 'Nội dung ban đầu của ticket.',
      status: 'RESOLVED',
      requesterId: 'client-user-id',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg-init',
          requestId: ticketId,
          senderId: 'client-user-id',
          content: 'Nội dung ban đầu của ticket.',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          sender: { fullName: 'Khách hàng Test' },
        },
        {
          id: 'msg-staff',
          requestId: ticketId,
          senderId: 'staff-user-id',
          content: 'Chúng tôi đã giải quyết xong vấn đề cho bạn.',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          sender: { fullName: 'Nhân viên hỗ trợ' },
        },
      ],
    };

    let currentStatus = 'RESOLVED';

    await page.route('**/support-requests/my*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [{ ...mockResolvedTicket, status: currentStatus }],
        }),
      });
    });

    await page.route(`**/support-requests/${ticketId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { ...mockResolvedTicket, status: currentStatus },
        }),
      });
    });

    await page.route(`**/support-requests/${ticketId}/messages`, async (route) => {
      currentStatus = 'IN_PROGRESS';
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'msg-customer-reopen',
            requestId: ticketId,
            senderId: 'client-user-id',
            content: 'Tôi vẫn gặp lỗi này, nhờ bạn kiểm tra lại giúp.',
            createdAt: new Date().toISOString(),
            sender: { fullName: 'Khách hàng Test' },
            updatedRequest: {
              ...mockResolvedTicket,
              status: 'IN_PROGRESS',
            },
          },
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.client);
    await page.goto('/profile/support', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1', { hasText: 'Yêu cầu hỗ trợ' })).toBeVisible({ timeout: 10000 });

    // Chọn ticket RESOLVED
    await page.getByText('Ticket cần hỗ trợ lại sau khi đã giải quyết').click();

    // Xác nhận ban đầu hiển thị badge "Đã giải quyết"
    await expect(page.locator('span', { hasText: 'Đã giải quyết' }).first()).toBeVisible();

    // Nhập nội dung phản hồi
    const replyInput = page.getByPlaceholder('Nhập phản hồi hoặc hướng dẫn xử lý...');
    await replyInput.fill('Tôi vẫn gặp lỗi này, nhờ bạn kiểm tra lại giúp.');

    // Nhấn Gửi phản hồi
    await page.getByRole('button', { name: 'Gửi phản hồi' }).click();

    // Xác nhận trạng thái ngay lập tức chuyển sang "Đang xử lý" mà không cần reload
    await expect(page.locator('span', { hasText: 'Đang xử lý' }).first()).toBeVisible({ timeout: 5000 });
  });
});
