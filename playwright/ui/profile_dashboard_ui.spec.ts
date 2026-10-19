import { test, expect, Page } from '@playwright/test';

async function setupProfileAuthAndRoutes(page: Page) {
  // Set authenticated user and token in localStorage (matches tokenService and userStorageService)
  await page.addInitScript(() => {
    const user = {
      id: 'test-user-id',
      email: 'client@example.com',
      fullName: 'Nguyễn Văn An',
      role: 'USER',
      avatarUrl: '',
    };
    window.localStorage.setItem('user', JSON.stringify(user));
    window.localStorage.setItem('access_token', JSON.stringify('mock-access-token'));
  });

  // Intercept profile user data
  await page.route('*/**:3000/users/me', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'test-user-id',
            email: 'client@example.com',
            fullName: 'Nguyễn Văn An',
            phone: '0901234567',
            gender: 'male',
            dateOfBirth: '1995-05-15',
            avatarUrl: '',
          },
        }),
      });
    } else if (route.request().method() === 'PUT') {
      const data = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data,
          message: 'Cập nhật thành công',
        }),
      });
    } else {
      await route.continue();
    }
  });

  // Intercept wishlist data
  await page.route('*/**:3000/users/me/wishlist*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          items: [
            {
              id: 'wishlist-item-1',
              name: 'Khăn len thổ cẩm dệt thủ công',
              thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500',
              price: 250000,
              discountPrice: 200000,
            },
          ],
        },
        pagination: {
          page: 1,
          pageSize: 40,
          totalItems: 1,
          totalPages: 1,
        },
      }),
    });
  });

  // Mock header notifications / cart to prevent unhandled network errors
  await page.route('*/**:3000/notifications*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [] }),
    });
  });

  await page.route('*/**:3000/cart*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { items: [], total: 0 } }),
    });
  });
}

test.describe('Giao diện - Thông tin cá nhân (MKP-025 Design Consistency)', () => {
  // Test A — Profile page renders
  test('Test A — Profile page renders without runtime errors', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await setupProfileAuthAndRoutes(page);
    await page.goto('/profile/dashboard', { waitUntil: 'domcontentloaded' });

    // Verify main components are visible
    await expect(page.locator('aside')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Thông tin cá nhân' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Danh sách yêu thích' })).toBeVisible();
    await expect(page.getByText('client@example.com').first()).toBeVisible();

    const runtimeExceptions = pageErrors.filter((msg) => !msg.includes('Network Error'));
    expect(runtimeExceptions).toEqual([]);
  });

  // Test B — Warm background
  test('Test B — Profile page uses Warm Cream background token', async ({ page }) => {
    await setupProfileAuthAndRoutes(page);
    await page.goto('/profile/dashboard', { waitUntil: 'domcontentloaded' });

    // ProfileLayout container must use bg-background-page and must NOT contain bg-stone-50/50
    const profileLayout = page.locator('div.w-full.min-h-screen.bg-background-page').first();
    await expect(profileLayout).toBeVisible({ timeout: 10000 });

    const classNames = (await profileLayout.getAttribute('class')) || '';
    expect(classNames).toContain('bg-background-page');
    expect(classNames).not.toContain('bg-stone-50/50');
    expect(classNames).not.toContain('bg-stone-50');

    // Verify computed background color is Warm Cream (#FFFBF5 -> rgb(255, 251, 245))
    const bgColor = await profileLayout.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bgColor).toBe('rgb(255, 251, 245)');
  });

  // Test C — Design consistency
  test('Test C — Cards and inputs adhere to design system without rounded-2xl or cold stone classes', async ({ page }) => {
    await setupProfileAuthAndRoutes(page);
    await page.goto('/profile/dashboard', { waitUntil: 'domcontentloaded' });

    // Check that none of the profile cards use rounded-2xl
    const rounded2xlElements = page.locator('aside .rounded-2xl, div:has(> h2:has-text("Thông tin cá nhân")).rounded-2xl');
    await expect(rounded2xlElements).toHaveCount(0);

    // Verify "Chỉnh sửa" button reuses .btn-secondary
    const editBtn = page.getByRole('button', { name: 'Chỉnh sửa' });
    await expect(editBtn).toBeVisible({ timeout: 10000 });
    const editBtnClasses = (await editBtn.getAttribute('class')) || '';
    expect(editBtnClasses).toContain('btn-secondary');

    // Click edit mode to inspect inputs
    await editBtn.click();
    const nameInput = page.locator('#pi-fullname');
    await expect(nameInput).toBeVisible();

    // Verify inputs do NOT use rounded-xl and use input-field
    const inputClasses = (await nameInput.getAttribute('class')) || '';
    expect(inputClasses).not.toContain('rounded-xl');
    expect(inputClasses).toContain('input-field');

    // Cancel edit
    const cancelBtn = page.getByRole('button', { name: 'Hủy' });
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();
  });

  // Test D — Responsive Desktop
  test('Test D — Responsive Desktop (1280x720) without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await setupProfileAuthAndRoutes(page);
    await page.goto('/profile/dashboard', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('aside')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Thông tin cá nhân' })).toBeVisible();

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  // Test E — Responsive Tablet
  test('Test E — Responsive Tablet (768x1024) without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await setupProfileAuthAndRoutes(page);
    await page.goto('/profile/dashboard', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'Thông tin cá nhân' })).toBeVisible({ timeout: 10000 });

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  // Test F — Responsive Mobile
  test('Test F — Responsive Mobile (375x812) without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await setupProfileAuthAndRoutes(page);
    await page.goto('/profile/dashboard', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'Thông tin cá nhân' })).toBeVisible({ timeout: 10000 });

    // Verify mobile menu toggle button is visible and toggles sidebar
    const mobileMenuBtn = page.getByRole('button', { name: 'Mở menu hồ sơ' });
    await expect(mobileMenuBtn).toBeVisible();
    await mobileMenuBtn.click();
    await expect(page.locator('aside')).toBeVisible();

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  // Test G — Existing profile interaction
  test('Test G — Existing edit, cancel, and save profile interactions work as expected', async ({ page }) => {
    let updateRequested = false;
    let updatedPayload: Record<string, unknown> = {};

    await page.route('*/**:3000/users/me', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 'test-user-id',
              email: 'client@example.com',
              fullName: 'Nguyễn Văn An',
              phone: '0901234567',
              gender: 'male',
              dateOfBirth: '1995-05-15',
              avatarUrl: '',
            },
          }),
        });
      } else if (route.request().method() === 'PUT') {
        updateRequested = true;
        updatedPayload = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: updatedPayload,
            message: 'Cập nhật thông tin thành công',
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route('*/**:3000/users/me/wishlist*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { items: [] },
          pagination: { page: 1, pageSize: 40, totalItems: 0, totalPages: 0 },
        }),
      });
    });

    await page.addInitScript(() => {
      const user = {
        id: 'test-user-id',
        email: 'client@example.com',
        fullName: 'Nguyễn Văn An',
        role: 'USER',
        avatarUrl: '',
      };
      window.localStorage.setItem('user', JSON.stringify(user));
      window.localStorage.setItem('access_token', JSON.stringify('mock-access-token'));
    });

    await page.goto('/profile/dashboard', { waitUntil: 'domcontentloaded' });

    // Step 1: Click "Chỉnh sửa"
    const editBtn = page.getByRole('button', { name: 'Chỉnh sửa' });
    await expect(editBtn).toBeVisible({ timeout: 10000 });
    await editBtn.click();

    // Step 2: Test Cancel interaction restores previous values
    const nameInput = page.locator('#pi-fullname');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Tên Thay Đổi');
    await page.getByRole('button', { name: 'Hủy' }).click();

    // Value should revert back
    await expect(page.getByText('Nguyễn Văn An').first()).toBeVisible();

    // Step 3: Re-enter Edit mode and Save
    await editBtn.click();
    await page.locator('#pi-fullname').fill('Nguyễn Văn Bình');
    await page.getByRole('button', { name: /Lưu thay đổi|Lưu/i }).click();

    // Verify PUT request was triggered with updated payload
    await expect.poll(() => updateRequested).toBe(true);
    expect(updatedPayload.fullName).toBe('Nguyễn Văn Bình');

    // Verify edit mode exited
    await expect(editBtn).toBeVisible();
  });
});
