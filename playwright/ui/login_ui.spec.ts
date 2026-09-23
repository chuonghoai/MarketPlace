import { test, expect } from '@playwright/test';

test.describe('Login UI', () => {
  test('should display login form correctly', async ({ page }) => {
    await page.goto('/login');

    // Check if the form elements are present
    await expect(page.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Nhập địa chỉ email...')).toBeVisible();
    await expect(page.getByPlaceholder('Nhập mật khẩu...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
  });

  test('should show validation error for empty submission', async ({ page }) => {
    await page.goto('/login');

    // Click login without filling anything
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // Expect validation messages
    await expect(page.getByText('Email là bắt buộc')).toBeVisible();
    await expect(page.getByText('Mật khẩu là bắt buộc')).toBeVisible();
  });
});
