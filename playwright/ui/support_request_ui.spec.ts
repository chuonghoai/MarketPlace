import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from '../helpers/auth.helper';

test.describe('MKP-065: Replace Native alert() with Toast Notification on Support Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, TEST_USERS.client);
  });

  test('Test A — 255-character title: Tiêu đề đúng 255 ký tự được chấp nhận và gửi thành công', async ({ page }) => {
    let dialogTriggered = false;
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    await page.goto('/profile/support', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1', { hasText: 'Yêu cầu hỗ trợ' })).toBeVisible({ timeout: 10000 });

    // Mở modal tạo yêu cầu
    await page.getByRole('button', { name: 'Tạo yêu cầu mới' }).click();
    await expect(page.locator('h3', { hasText: 'Tạo yêu cầu mới' })).toBeVisible();

    // Nhập tiêu đề đúng 255 ký tự
    const title255 = 'A'.repeat(255);
    const titleInput = page.getByPlaceholder('Mô tả ngắn gọn vấn đề bạn gặp phải...');
    await titleInput.fill(title255);

    const contentInput = page.getByPlaceholder('Cung cấp thêm chi tiết (mã đơn hàng, ảnh chụp màn hình, thời gian...)...');
    await contentInput.fill('Nội dung yêu cầu hỗ trợ kiểm thử tiêu đề 255 ký tự hợp lệ.');

    // Xác nhận không có lỗi inline khi tiêu đề đúng 255 ký tự
    await expect(page.locator('#title-error')).not.toBeVisible();

    // Mock API thành công để bảo đảm test không phụ thuộc vào trạng thái server
    await page.route('**/support-requests', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 'test-255-char-id',
              title: title255,
              content: 'Nội dung kiểm thử',
              status: 'OPEN',
              createdAt: new Date().toISOString(),
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Nhấn Xác nhận
    await page.getByRole('button', { name: 'Xác nhận' }).click();

    // Xác nhận Toast thành công hiển thị
    await expect(page.getByText('Đã tạo yêu cầu hỗ trợ thành công')).toBeVisible({ timeout: 5000 });

    // Modal được đóng
    await expect(page.locator('h3', { hasText: 'Tạo yêu cầu mới' })).not.toBeVisible();

    // Không có dialog alert nào được kích hoạt
    expect(dialogTriggered).toBe(false);
  });

  test('Test B — 256-character title: Bị từ chối bởi client validation, hiển thị Toast và inline error, không gọi alert/API', async ({ page }) => {
    let dialogTriggered = false;
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    let apiCalled = false;
    await page.route('**/support-requests', async (route) => {
      if (route.request().method() === 'POST') {
        apiCalled = true;
        await route.abort();
      } else {
        await route.continue();
      }
    });

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

    // 2. Kiểm tra Toast error xuất hiện
    await expect(page.getByText('Tiêu đề tối đa 255 ký tự').first()).toBeVisible({ timeout: 5000 });

    // 3. Không có native alert nào được bật lên
    expect(dialogTriggered).toBe(false);

    // 4. API không được gọi vì client validation đã chặn submit
    expect(apiCalled).toBe(false);

    // 5. Form vẫn mở để người dùng sửa đổi
    await expect(page.locator('h3', { hasText: 'Tạo yêu cầu mới' })).toBeVisible();

    // 6. Khi người dùng xóa bớt 1 ký tự (còn 255 ký tự), inline error tự động biến mất
    await titleInput.fill('B'.repeat(255));
    await expect(inlineError).not.toBeVisible();
  });

  test('Test C — Backend validation error: Hiển thị standard Toast và không dùng alert khi backend báo lỗi', async ({ page }) => {
    let dialogTriggered = false;
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    // Giả lập backend từ chối với lỗi validation
    await page.route('**/support-requests', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Tiêu đề tối đa 255 ký tự',
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/profile/support', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Tạo yêu cầu mới' }).click();

    await page.getByPlaceholder('Mô tả ngắn gọn vấn đề bạn gặp phải...').fill('Tiêu đề hợp lệ ở client nhưng backend giả lập lỗi');
    await page.getByPlaceholder('Cung cấp thêm chi tiết (mã đơn hàng, ảnh chụp màn hình, thời gian...)...').fill('Nội dung hợp lệ.');

    await page.getByRole('button', { name: 'Xác nhận' }).click();

    // Kiểm tra Toast error hiển thị thông báo lỗi từ backend
    await expect(page.getByText('Tiêu đề tối đa 255 ký tự').first()).toBeVisible({ timeout: 5000 });

    // Không dùng window.alert()
    expect(dialogTriggered).toBe(false);

    // Form vẫn mở để người dùng tiếp tục thao tác
    await expect(page.locator('h3', { hasText: 'Tạo yêu cầu mới' })).toBeVisible();
  });

  test('Test D — Generic submission error: Hiển thị thông báo fallback khi gặp lỗi mạng/hệ thống', async ({ page }) => {
    let dialogTriggered = false;
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    // Giả lập lỗi mạng ngắt kết nối
    await page.route('**/support-requests', async (route) => {
      if (route.request().method() === 'POST') {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });

    await page.goto('/profile/support', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Tạo yêu cầu mới' }).click();

    await page.getByPlaceholder('Mô tả ngắn gọn vấn đề bạn gặp phải...').fill('Vấn đề kết nối mạng');
    await page.getByPlaceholder('Cung cấp thêm chi tiết (mã đơn hàng, ảnh chụp màn hình, thời gian...)...').fill('Chi tiết lỗi mạng.');

    await page.getByRole('button', { name: 'Xác nhận' }).click();

    // Toast hiển thị thông báo fallback dịch chuẩn (hoặc message lỗi mạng an toàn)
    const toastElem = page.locator('div.fixed.top-6 span');
    await expect(toastElem.first()).toBeVisible({ timeout: 5000 });

    // Không dùng window.alert()
    expect(dialogTriggered).toBe(false);

    // Form vẫn mở và nút không bị disable vĩnh viễn
    await expect(page.locator('h3', { hasText: 'Tạo yêu cầu mới' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Xác nhận' })).toBeEnabled();
  });

  test('Test E — Successful submission: Luồng gửi yêu cầu thành công với backend thật hoạt động chuẩn xác', async ({ page }) => {
    let dialogTriggered = false;
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    await page.goto('/profile/support', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Tạo yêu cầu mới' }).click();

    const uniqueTitle = `Yêu cầu hỗ trợ Playwright E2E - ${Date.now()}`;
    await page.getByPlaceholder('Mô tả ngắn gọn vấn đề bạn gặp phải...').fill(uniqueTitle);
    await page.getByPlaceholder('Cung cấp thêm chi tiết (mã đơn hàng, ảnh chụp màn hình, thời gian...)...').fill('Nội dung hỗ trợ gửi thành công.');

    await page.getByRole('button', { name: 'Xác nhận' }).click();

    // Toast thành công hiển thị
    await expect(page.getByText('Đã tạo yêu cầu hỗ trợ thành công')).toBeVisible({ timeout: 10000 });

    // Modal đóng
    await expect(page.locator('h3', { hasText: 'Tạo yêu cầu mới' })).not.toBeVisible();

    // Không có alert native nào
    expect(dialogTriggered).toBe(false);

    // Danh sách yêu cầu hiển thị ticket vừa tạo
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10000 });
  });

  test('Test F — Frontend status refresh (MKP-069): Khách hàng gửi phản hồi trên ticket RESOLVED thấy trạng thái cập nhật ngay sang Đang xử lý mà không cần tải lại trang', async ({ page }) => {
    const ticketId = 'ticket-resolved-test-f';
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

    await page.route(`**/support-requests/my*`, async (route) => {
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
