import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from '../helpers/auth.helper';

test.describe('Giao diện - Chi tiết sản phẩm', () => {
  let sampleProductId: string;

  test.beforeAll(async ({ request }) => {
    const response = await request.get('http://127.0.0.1:3000/products?pageSize=1');
    if (response.ok()) {
      const body = await response.json();
      const list = body.data?.products || body.data?.items || (Array.isArray(body.data) ? body.data : []);
      if (list.length > 0) {
        sampleProductId = list[0].id;
      }
    }
  });

  test('Hiển thị thông tin chi tiết sản phẩm, hình ảnh, giá và nút Thêm vào giỏ (MKP_006)', async ({ page }) => {
    if (!sampleProductId) test.skip();

    await page.goto(`/product/${sampleProductId}`, { waitUntil: 'domcontentloaded' });

    // Kiểm tra tiêu đề và nút Thêm vào giỏ
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Thêm vào giỏ', exact: true })).toBeVisible({ timeout: 10000 });
  });

  test('Kiểm tra giới hạn số lượng tối thiểu không cho giảm dưới 1 (MKP_046)', async ({ page }) => {
    if (!sampleProductId) test.skip();

    await page.goto(`/product/${sampleProductId}`, { waitUntil: 'domcontentloaded' });

    const decreaseBtn = page.getByRole('button', { name: 'Giảm số lượng' });
    const increaseBtn = page.getByRole('button', { name: 'Tăng số lượng' });
    const qtyInput = page.locator('input[type="number"][readonly]');

    if (await decreaseBtn.isVisible({ timeout: 5000 })) {
      // 1. Số lượng mặc định = 1
      await expect(qtyInput).toHaveValue('1');

      // 2. Nút trừ (-) bị vô hiệu hóa (disabled) khi số lượng = 1
      await expect(decreaseBtn).toBeDisabled();

      // 3. Click nút trừ (-) khi đang ở biên dưới không làm số lượng giảm dưới 1
      await decreaseBtn.click({ force: true }).catch(() => {});
      await expect(qtyInput).toHaveValue('1');

      // Thử click thêm 2 lần liên tiếp để đảm bảo số lượng không về 0 hay âm
      await decreaseBtn.click({ force: true }).catch(() => {});
      await decreaseBtn.click({ force: true }).catch(() => {});
      await expect(qtyInput).toHaveValue('1');

      // 4. Bấm nút cộng (+) để tăng lên 2 -> nút trừ (-) được kích hoạt lại
      await increaseBtn.click();
      await expect(qtyInput).toHaveValue('2');
      await expect(decreaseBtn).toBeEnabled();

      // 5. Bấm nút trừ (-) để giảm về 1 -> nút trừ (-) trở lại trạng thái disabled
      await decreaseBtn.click();
      await expect(qtyInput).toHaveValue('1');
      await expect(decreaseBtn).toBeDisabled();
    }
  });

  test('Truy cập trực tiếp URL sản phẩm có chữ "p" trong tên không bị lỗi chuyển hướng (MKP-049)', async ({ page }) => {
    // Sản phẩm thực tế trong DB: "Tượng Phật Di Lặc dâng vàng"
    const targetSlug = '/tuong-phat-di-lac-dang-vang-pprod0019-0000-0000-0000-000000000019';
    let requestedProductId = '';

    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('/products/')) {
        const parts = url.split('/products/');
        if (parts[1]) {
          requestedProductId = parts[1].split('?')[0];
        }
      }
    });

    await page.goto(targetSlug, { waitUntil: 'domcontentloaded' });

    // Đảm bảo không bị chuyển hướng về trang chủ
    await expect(page).toHaveURL(new RegExp(targetSlug));

    // Đảm bảo API nhận đúng product ID (không bị cắt nhầm thành hat-di-lac-...)
    expect(requestedProductId).toBe('prod0019-0000-0000-0000-000000000019');

    // Trang chi tiết hiển thị đúng tên, giá và nút mua hàng
    await expect(page.locator('h1').first()).toContainText('Tượng Phật Di Lặc dâng vàng', { timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Thêm vào giỏ', exact: true })).toBeVisible({ timeout: 10000 });
  });

  test('Truy cập trực tiếp URL sản phẩm dạng UUID v4 thực tế trong DB không bị lỗi chuyển hướng (MKP-049)', async ({ page }) => {
    if (!sampleProductId) test.skip();

    // Sản phẩm UUID v4 thực tế trong DB: "Phễu đan tre" (tên có chữ "P")
    const targetSlug = `/pheu-dan-tre-p${sampleProductId}`;
    let requestedProductId = '';

    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('/products/')) {
        const parts = url.split('/products/');
        if (parts[1]) {
          requestedProductId = parts[1].split('?')[0];
        }
      }
    });

    await page.goto(targetSlug, { waitUntil: 'domcontentloaded' });

    // Đảm bảo không bị chuyển hướng về trang chủ
    await expect(page).toHaveURL(new RegExp(targetSlug));

    // Đảm bảo API nhận đúng UUID thực tế
    expect(requestedProductId).toBe(sampleProductId);

    // Trang chi tiết hiển thị đúng tên và nút mua hàng từ dữ liệu thật
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Thêm vào giỏ', exact: true })).toBeVisible({ timeout: 10000 });
  });

  test('Truy cập URL tái hiện issue MKP-049 với UUID chuẩn gọi đúng API ID (MKP-049)', async ({ page }) => {
    const issueUrl = '/tuong-phat-di-lac-dang-vang-p335e38eb-62b1-4c6e-8ee5-87ad183f06c1';
    let apiRequestedId = '';

    // Mock response cho UUID tái hiện của issue
    await page.route('**/products/335e38eb-62b1-4c6e-8ee5-87ad183f06c1', async (route) => {
      apiRequestedId = '335e38eb-62b1-4c6e-8ee5-87ad183f06c1';
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Lấy chi tiết sản phẩm thành công',
          data: {
            id: '335e38eb-62b1-4c6e-8ee5-87ad183f06c1',
            name: 'Tượng Phật Di Lặc dâng vàng',
            price: 500000,
            originalPrice: 600000,
            discountPercentage: 16,
            rating: 5,
            stock: 10,
            soldCount: 5,
            imageUrl: 'https://picsum.photos/400/400',
            images: ['https://picsum.photos/400/400'],
            description: 'Tượng Phật Di Lặc dâng vàng thủ công mỹ nghệ cao cấp',
            category: { id: 'cat-1', name: 'Bát đĩa gốm sứ' },
          },
        }),
      });
    });

    await page.goto(issueUrl, { waitUntil: 'domcontentloaded' });

    // Trang chi tiết hiển thị đúng tên và nút Thêm vào giỏ
    await expect(page.locator('h1').first()).toContainText('Tượng Phật Di Lặc dâng vàng', { timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Thêm vào giỏ', exact: true })).toBeVisible({ timeout: 10000 });

    // Kiểm tra API được gọi với đúng UUID
    expect(apiRequestedId).toBe('335e38eb-62b1-4c6e-8ee5-87ad183f06c1');
  });

  test('Slug không chứa ID hợp lệ chuyển hướng về trang chủ (MKP-049)', async ({ page }) => {
    // Slug không có ID
    await page.goto('/tuong-phat-di-lac-dang-vang', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/^(http:\/\/localhost:5173\/|\/)$/, { timeout: 10000 });
  });

  test('Kiểm tra truy cập trang chi tiết sản phẩm với UUID v4 hợp lệ nhưng không tồn tại trong hệ thống (MKP_048)', async ({ page }) => {
    // UUID v4 hợp lệ nhưng không tồn tại trong DB
    const nonExistentUuid = '00000000-0000-4000-a000-000000000000';
    let apiStatus = 0;

    page.on('response', (res) => {
      if (res.url().includes(`/products/${nonExistentUuid}`)) {
        apiStatus = res.status();
      }
    });

    await page.goto(`/product/${nonExistentUuid}`, { waitUntil: 'domcontentloaded' });

    // Đợi phản hồi API và chuyển hướng an toàn
    await page.waitForTimeout(1000);

    // Xác nhận API backend trả về 404 cho sản phẩm không tồn tại nếu nhận response
    if (apiStatus > 0) {
      expect(apiStatus).toBe(404);
    }

    // Xác nhận hệ thống điều hướng an toàn về trang chủ (hoặc trang lỗi 404)
    await expect(page).toHaveURL(/^(http:\/\/localhost:5173\/|\/)$/, { timeout: 10000 });

    // Xác nhận hiển thị thông báo lỗi phù hợp
    const toast = page.locator('.fixed').getByText(/Sản phẩm không tồn tại|lỗi/i).first();
    await expect(toast).toBeVisible({ timeout: 5000 });

    // Không render thông tin sản phẩm giả hoặc crash trắng trang
    await expect(page.locator('h1')).not.toHaveText(nonExistentUuid);
  });

  test('Kiểm tra thêm và bỏ sản phẩm vào danh sách yêu thích từ trang chi tiết (MKP_050)', async ({ page }) => {
    if (!sampleProductId) test.skip();

    // 1. Đăng nhập tài khoản kiểm thử
    await loginViaUI(page, TEST_USERS.client);

    // 2. Mở trang chi tiết sản phẩm hợp lệ
    await page.goto(`/product/${sampleProductId}`, { waitUntil: 'domcontentloaded' });

    const favButton = page.locator('[data-testid="product-favorite-button"]').first();
    await expect(favButton).toBeVisible({ timeout: 10000 });

    // Lấy trạng thái yêu thích ban đầu
    const initialLabel = await favButton.getAttribute('aria-label');
    const wasFavorite = initialLabel === 'Bỏ yêu thích';

    // 3. Click nút yêu thích
    await favButton.click();

    // 4. Kiểm tra hiển thị Toast thông báo thành công
    const expectedToastRegex = wasFavorite
      ? /xóa khỏi bộ sưu tập yêu thích|xóa khỏi|thành công/i
      : /thêm vào bộ sưu tập yêu thích|thêm vào|thành công/i;
    const toast = page.locator('.fixed').getByText(expectedToastRegex);
    await expect(toast).toBeVisible({ timeout: 5000 });

    // 5. Kiểm tra trạng thái nút thay đổi
    const expectedLabel = wasFavorite ? 'Yêu thích' : 'Bỏ yêu thích';
    await expect(favButton).toHaveAttribute('aria-label', expectedLabel, { timeout: 5000 });

    // 6. Tải lại trang (F5) để kiểm tra trạng thái yêu thích được lưu bền vững
    await page.reload({ waitUntil: 'domcontentloaded' });
    const reloadedFavBtn = page.locator('[data-testid="product-favorite-button"]').first();
    await expect(reloadedFavBtn).toBeVisible({ timeout: 10000 });
    await expect(reloadedFavBtn).toHaveAttribute('aria-label', expectedLabel, { timeout: 5000 });

    // 7. Click lại lần nữa để khôi phục trạng thái ban đầu
    await reloadedFavBtn.click();
    const restoreToastRegex = wasFavorite
      ? /thêm vào bộ sưu tập yêu thích|thêm vào|thành công/i
      : /xóa khỏi bộ sưu tập yêu thích|xóa khỏi|thành công/i;
    const restoreToast = page.locator('.fixed').getByText(restoreToastRegex);
    await expect(restoreToast).toBeVisible({ timeout: 5000 });
    await expect(reloadedFavBtn).toHaveAttribute('aria-label', initialLabel || 'Yêu thích', { timeout: 5000 });
  });
});
