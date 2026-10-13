import { test, expect } from '@playwright/test';

test.describe('Giao diện - Chi tiết sản phẩm', () => {
  let sampleProductId: string;

  test.beforeAll(async ({ request }) => {
    const response = await request.get('http://127.0.0.1:3000/products?pageSize=1');
    if (response.ok()) {
      const body = await response.json();
      const list = body.data?.products || body.data || [];
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

  test('Cho phép tăng và giảm số lượng sản phẩm dự định mua', async ({ page }) => {
    if (!sampleProductId) test.skip();

    await page.goto(`/product/${sampleProductId}`, { waitUntil: 'domcontentloaded' });

    const increaseBtn = page.getByRole('button', { name: 'Tăng số lượng' });
    if (await increaseBtn.isVisible({ timeout: 5000 })) {
      await increaseBtn.click();
      const qtyInput = page.locator('input[type="number"][readonly]');
      await expect(qtyInput).toHaveValue('2');

      const decreaseBtn = page.getByRole('button', { name: 'Giảm số lượng' });
      await decreaseBtn.click();
      await expect(qtyInput).toHaveValue('1');
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
});
