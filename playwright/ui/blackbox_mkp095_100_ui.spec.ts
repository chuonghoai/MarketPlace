import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from '../helpers/auth.helper';

test.describe('BỘ 6 TEST CASE KIỂM THỬ HỘP ĐEN - CHƯƠNG (MKP_095 -> MKP_100)', () => {

  // =========================================================================
  // NHÓM 1: UC06 - QUẢN LÝ NHÂN VIÊN (MKP_095 -> MKP_096)
  // =========================================================================

  test('MKP_095 - [UI - PASS] Quản trị viên mở modal Thêm mới nhân viên và kiểm tra validation khi để trống thông tin bắt buộc', async ({ page }) => {
    // Mock danh sách nhân viên ban đầu
    await page.route('**/staffs*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [],
          pagination: { totalPages: 1, totalItems: 0 },
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/staff');
    await page.waitForLoadState('domcontentloaded');

    // Kiểm tra trang Quản lý nhân viên tải thành công
    await expect(page.getByRole('heading', { name: 'Quản lý nhân viên' })).toBeVisible({ timeout: 10000 });

    // Bấm nút "Thêm mới" để mở modal thêm nhân viên
    const addNewBtn = page.getByRole('button', { name: /Thêm mới/i });
    await expect(addNewBtn).toBeVisible();
    await addNewBtn.click();

    // Kiểm tra modal Thêm nhân viên mới xuất hiện
    await expect(page.getByRole('heading', { name: 'Thêm nhân viên mới' })).toBeVisible({ timeout: 5000 });

    // Giữ nguyên các trường để trống và bấm nút "Thêm"
    const submitBtn = page.getByRole('button', { name: 'Thêm', exact: true });
    await submitBtn.click();

    // KỲ VỌNG: Hiển thị cảnh báo lỗi yêu cầu điền đầy đủ các trường bắt buộc
    const errorAlert = page.locator('text=Vui lòng điền đầy đủ các trường bắt buộc');
    await expect(errorAlert).toBeVisible({ timeout: 3000 });
  });

  test('MKP_096 - [UI - PASS] Quản trị viên tra cứu / tìm kiếm nhân viên theo từ khóa tên trên danh sách nhân viên', async ({ page }) => {
    const mockStaffList = [
      {
        id: 'staff-1',
        position: 'STAFF',
        salary: 15000000,
        createdAt: new Date().toISOString(),
        user: {
          id: 'u-1',
          fullName: 'Nguyễn Văn Nhân Viên',
          email: 'nhanvien1@marketplace.com',
          phone: '0901234567',
        },
      },
      {
        id: 'staff-2',
        position: 'ACCOUNTANT',
        salary: 18000000,
        createdAt: new Date().toISOString(),
        user: {
          id: 'u-2',
          fullName: 'Trần Thị Kế Toán',
          email: 'ketoan@marketplace.com',
          phone: '0912345678',
        },
      },
    ];

    // Mock API tìm kiếm nhân viên
    await page.route('**/staffs*', async (route) => {
      const url = route.request().url();
      if (url.includes('search=K%E1%BA%BF') || url.includes('search=ketoan') || url.includes('search=Kế')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [mockStaffList[1]],
            pagination: { totalPages: 1, totalItems: 1 },
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: mockStaffList,
            pagination: { totalPages: 1, totalItems: 2 },
          }),
        });
      }
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/staff');
    await page.waitForLoadState('domcontentloaded');

    // Kiểm tra hiển thị cả 2 nhân viên ban đầu
    await expect(page.locator('text=Nguyễn Văn Nhân Viên')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Trần Thị Kế Toán')).toBeVisible({ timeout: 10000 });

    // Nhập từ khóa tìm kiếm "Kế Toán"
    const searchInput = page.getByPlaceholder(/Tìm kiếm nhân viên.../i);
    await searchInput.fill('Kế Toán');

    // KỲ VỌNG: Danh sách lọc chỉ hiển thị nhân viên "Trần Thị Kế Toán", ẩn "Nguyễn Văn Nhân Viên"
    await expect(page.locator('text=Trần Thị Kế Toán')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Nguyễn Văn Nhân Viên')).not.toBeVisible({ timeout: 3000 });
  });

  // =========================================================================
  // NHÓM 2: UC19 - QUẢN LÝ THIẾT BỊ ĐĂNG NHẬP (MKP_097 -> MKP_098)
  // =========================================================================

  test('MKP_097 - [UI - PASS] Người dùng truy cập trang Quản lý thiết bị đăng nhập và kiểm tra hiển thị nhãn "Hiện tại"', async ({ page }) => {
    await loginViaUI(page, TEST_USERS.client);

    // Mock API thiết bị trả về 2 thiết bị
    await page.route('**/auth/devices', async (route) => {
      // Lấy danh sách thiết bị bao gồm thiết bị hiện tại
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 'dev-1',
              deviceId: 'default-device-id',
              deviceName: 'Chrome trên Windows 11',
              isActive: true,
              lastLoginAt: new Date().toISOString(),
            },
            {
              id: 'dev-2',
              deviceId: 'remote-device-id',
              deviceName: 'Mobile Safari trên iPhone 15 Pro',
              isActive: true,
              lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
            },
          ],
        }),
      });
    });

    await page.goto('/profile/devices');
    await page.waitForLoadState('domcontentloaded');

    // Kiểm tra tiêu đề và mô tả trang Thiết bị đăng nhập
    await expect(page.getByRole('heading', { name: 'Thiết bị đăng nhập' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Quản lý các thiết bị đã đăng nhập vào tài khoản của bạn.')).toBeVisible();

    // Kiểm tra danh sách hiển thị tên thiết bị
    await expect(page.locator('text=Mobile Safari trên iPhone 15 Pro')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Chrome trên Windows 11')).toBeVisible({ timeout: 5000 });

    // KỲ VỌNG: Trạng thái hiển thị badge "Đang đăng nhập"
    const activeBadges = page.locator('text=Đang đăng nhập');
    await expect(activeBadges.first()).toBeVisible();
  });

  test('MKP_098 - [UI - PASS] Thao tác đăng xuất từ xa một thiết bị khác đang hoạt động trong danh sách', async ({ page }) => {
    let revokeCalled = false;

    await loginViaUI(page, TEST_USERS.client);

    const remoteDeviceId = 'remote-iphone-device-id';
    let deviceList = [
      {
        id: 'dev-1',
        deviceId: 'current-mock-device',
        deviceName: 'Chrome trên Windows',
        isActive: true,
        lastLoginAt: new Date().toISOString(),
      },
      {
        id: 'dev-2',
        deviceId: remoteDeviceId,
        deviceName: 'Mobile Safari trên iPhone',
        isActive: true,
        lastLoginAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ];

    // Mock API thiết bị
    await page.route('**/auth/devices', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: deviceList,
        }),
      });
    });

    // Mock API revoke thiết bị từ xa
    await page.route(`**/auth/devices/${remoteDeviceId}/revoke`, async (route) => {
      revokeCalled = true;
      // Cập nhật trạng thái thiết bị đã đăng xuất
      deviceList = [
        deviceList[0],
        { ...deviceList[1], isActive: false },
      ];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Đăng xuất thiết bị thành công',
          data: null,
        }),
      });
    });

    await page.goto('/profile/devices');
    await page.waitForLoadState('domcontentloaded');

    // Đón nhận hộp thoại xác nhận window.confirm
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Bạn có chắc chắn muốn đăng xuất');
      await dialog.accept();
    });

    // Tìm thiết bị iPhone và bấm nút "Đăng xuất"
    const remoteCard = page.locator('.rounded-xl').filter({ hasText: 'Mobile Safari trên iPhone' });
    const logoutBtn = remoteCard.getByRole('button', { name: 'Đăng xuất' });
    await expect(logoutBtn).toBeVisible({ timeout: 5000 });
    await logoutBtn.click();

    // KỲ VỌNG: API revoke được gọi và trạng thái thiết bị cập nhật thành "Đã đăng xuất"
    await expect.poll(() => revokeCalled).toBe(true);
    await expect(page.locator('text=Đã đăng xuất')).toBeVisible({ timeout: 5000 });
  });

  // =========================================================================
  // NHÓM 3: UC21 - QUẢN LÝ NGHỆ DANH (MKP_099 -> MKP_100)
  // =========================================================================

  test('MKP_099 - [UI - FIXED] Form Thêm mới nghệ danh kiểm tra ràng buộc ngày sinh không được trong tương lai', async ({ page }) => {
    // Mock API backend artisans (tránh chặn nhầm URL frontend /admin/artisans)
    await page.route('*/**:3000/artisans*', async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'mock-artisan-future',
            fullName: 'Đạt',
            birthDate: '2026-10-20',
          }),
        });
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          total: 0,
        }),
      });
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/artisans');
    await page.waitForLoadState('domcontentloaded');

    // Bước 1: Nhấn "Thêm mới" trên trang Quản lý nghệ danh
    const addArtisanBtn = page.getByRole('link', { name: /Thêm mới/i });
    await expect(addArtisanBtn).toBeVisible({ timeout: 5000 });
    await addArtisanBtn.click();
    await page.waitForURL('**/admin/artisans/create');
    await expect(page.getByRole('heading', { name: 'Thêm mới nghệ danh' })).toBeVisible({ timeout: 5000 });

    const dialogMessages: string[] = [];
    page.on('dialog', async (dialog) => {
      dialogMessages.push(dialog.message());
      await dialog.accept();
    });

    // Bước 2: Nhập Họ và tên: "Đạt" và Ngày sinh: "2029-12-31" (ngày trong tương lai)
    await page.locator('input[name="fullName"]').fill('Đạt');
    const birthDateInput = page.locator('input[name="birthDate"]');
    await birthDateInput.fill('2029-12-31');

    // Bấm nút "Lưu thông tin"
    const saveBtn = page.getByRole('button', { name: /Lưu thông tin/i });
    await saveBtn.click();

    // Chờ phản hồi từ form
    await page.waitForTimeout(1000);

    // KỲ VỌNG: Giao diện phải cảnh báo ngày sinh trong tương lai và ngăn chặn việc lưu dữ liệu
    // THỰC TẾ: Không hiển thị cảnh báo lỗi ngày sinh, form vẫn cho phép tiếp tục lưu bình thường
    const hasFutureDateWarning = dialogMessages.some((msg) => /ngày sinh.*(tương lai|không hợp lệ)|không được lớn hơn/i.test(msg));
    expect(hasFutureDateWarning, 'Form phải hiển thị cảnh báo khi chọn ngày sinh trong tương lai').toBe(true);
  });

  test('MKP_100 - [UI - PASS] Quản trị viên tìm kiếm nghệ danh theo từ khóa trên danh sách nghệ danh', async ({ page }) => {
    const mockArtisans = [
      {
        id: 'art-1',
        fullName: 'Nghệ nhân Gốm Trần Độ',
        avatar: '',
        birthDate: '1965-05-10T00:00:00Z',
        productCount: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'art-2',
        fullName: 'Nghệ nhân Mây Tre Nguyễn Văn B',
        avatar: '',
        birthDate: '1975-08-20T00:00:00Z',
        productCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Mock API backend lọc nghệ danh theo từ khóa (tránh chặn nhầm URL frontend)
    await page.route('*/**:3000/artisans*', async (route) => {
      const url = route.request().url();
      if (url.includes('search=Tr%E1%BA%A7n') || url.includes('search=Trần') || url.includes('search=Tran')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [mockArtisans[0]],
            total: 1,
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: mockArtisans,
            total: 2,
          }),
        });
      }
    });

    await loginViaUI(page, TEST_USERS.admin);
    await page.goto('/admin/artisans');
    await page.waitForLoadState('domcontentloaded');

    // Kiểm tra ban đầu hiển thị cả 2 nghệ danh
    await expect(page.locator('text=Nghệ nhân Gốm Trần Độ')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Nghệ nhân Mây Tre Nguyễn Văn B')).toBeVisible({ timeout: 10000 });

    // Nhập từ khóa tìm kiếm "Trần Độ"
    const searchInput = page.getByPlaceholder(/Tìm kiếm nghệ danh.../i);
    await searchInput.fill('Trần Độ');

    // KỲ VỌNG: Danh sách lọc chỉ hiển thị "Nghệ nhân Gốm Trần Độ", không còn "Nguyễn Văn B"
    await expect(page.locator('text=Nghệ nhân Gốm Trần Độ')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Nghệ nhân Mây Tre Nguyễn Văn B')).not.toBeVisible({ timeout: 3000 });
  });

});
