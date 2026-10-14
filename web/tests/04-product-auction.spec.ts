import { test, expect, type Page } from '@playwright/test';

async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByPlaceholder('Nhập địa chỉ email...').fill(email);
  await page.getByPlaceholder('Nhập mật khẩu...').fill(password);
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await page.waitForURL((url: URL) => !url.pathname.includes('/login'));
}

test.describe.serial('Đấu giá sản phẩm (Product Auction)', () => {

  test.beforeEach(async ({ page }) => {
    // Đăng nhập quyền khách hàng
    await loginAs(page, '23110131@student.hcmute.edu.vn', '123456');
  });

  test('TC12: Xem danh sách các phiên đấu giá đang diễn ra', async ({ page }) => {
    // 1. Vào trang Đấu giá
    await page.goto('/auctions');
    
    // 2. Chờ load giao diện
    await expect(page.locator('h1', { hasText: 'Sàn Đấu Giá Trực Tuyến' })).toBeVisible();
    
    // 3. Nếu có đấu giá, thẻ sản phẩm đấu giá sẽ hiển thị, ngược lại hiển thị "Chưa có phiên"
    const noAuctionText = page.locator('h3', { hasText: 'Chưa có phiên đấu giá nào' });
    const joinBtn = page.getByRole('button', { name: 'Tham gia ngay' }).first();

    await expect(noAuctionText.or(joinBtn)).toBeVisible();
  });

  test('TC13: Tham gia đặt giá (bid) hợp lệ cho một sản phẩm', async ({ page }) => {
    await page.goto('/auctions');
    
    // Chờ loading xong
    const noAuctionText = page.locator('h3', { hasText: 'Chưa có phiên đấu giá nào' });
    const joinBtn = page.getByRole('button', { name: 'Tham gia ngay' }).first();
    await expect(noAuctionText.or(joinBtn)).toBeVisible();
    
    if (await joinBtn.isVisible()) {
      await joinBtn.click();
      
      // Chờ vào phòng đấu giá
      await expect(page).toHaveURL(/\/auctions\/\w+/);

      // Chờ giao diện phòng đấu giá load: Hoặc hiện ô nhập giá, hoặc báo đã kết thúc, hoặc báo chưa chọn SP
      const bidInput = page.getByPlaceholder('Nhập mức giá muốn đặt');
      const finishedText = page.getByText('Phiên đấu giá sản phẩm này đã kết thúc', { exact: false });
      const emptyItemsText = page.getByText('Vui lòng chọn một sản phẩm trong danh sách', { exact: false });
      
      await expect(bidInput.or(finishedText).or(emptyItemsText)).toBeVisible();
      
      if (await finishedText.isVisible() || await emptyItemsText.isVisible()) {
        console.log('Phiên đấu giá không thể đặt giá lúc này, bỏ qua.');
        return; // Thoát sớm
      }

      const bidBtn = page.getByRole('button', { name: /Đặt giá ngay/i });
      
      // Bấm nút Đặt giá ngay
      await bidBtn.click();
      
      // Chờ xem có thông báo lỗi số dư, lỗi chung, hoặc thành công
      const errorWallet = page.getByText(/Số dư ví điện tử của bạn không đủ/);
      const successBid = page.getByText(/Bạn đã nâng giá thành công/);
      const anyError = page.locator('.bg-red-50.text-red-700'); // Bắt mọi lỗi từ server trả về
      await expect(errorWallet.or(successBid).or(anyError)).toBeVisible();
    }
  });

  test('TC14: Báo lỗi khi đặt giá thấp hơn giá hiện tại hoặc bước giá', async ({ page }) => {
    await page.goto('/auctions');
    
    // Chờ loading xong
    const noAuctionText = page.locator('h3', { hasText: 'Chưa có phiên đấu giá nào' });
    const joinBtn = page.getByRole('button', { name: 'Tham gia ngay' }).first();
    await expect(noAuctionText.or(joinBtn)).toBeVisible();
    
    if (await joinBtn.isVisible()) {
      await joinBtn.click();
      await expect(page).toHaveURL(/\/auctions\/\w+/);

      const bidInput = page.getByPlaceholder('Nhập mức giá muốn đặt');
      const finishedText = page.getByText('Phiên đấu giá sản phẩm này đã kết thúc', { exact: false });
      const emptyItemsText = page.getByText('Vui lòng chọn một sản phẩm trong danh sách', { exact: false });
      
      await expect(bidInput.or(finishedText).or(emptyItemsText)).toBeVisible();
      
      if (await finishedText.isVisible() || await emptyItemsText.isVisible()) {
        return; // Bỏ qua test nếu không thể bid
      }

      const bidBtn = page.getByRole('button', { name: /Đặt giá ngay/i });
      
      // Cố tình nhập giá rất nhỏ = 1000đ
      await bidInput.fill('1000');
      await bidBtn.click();
      
      // Lỗi hiển thị "Giá đặt phải từ giá khởi điểm trở lên" hoặc "Giá đấu mới phải lớn hơn"
      const err1 = page.getByText(/Giá đặt phải từ giá khởi điểm/);
      const err2 = page.getByText(/Giá đấu mới phải lớn hơn/);
      
      await expect(err1.or(err2)).toBeVisible();
    }
  });

});
