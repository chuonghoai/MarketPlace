import { APIRequestContext, Page, expect } from '@playwright/test';

export const TEST_USERS = {
  client: {
    email: 'client@example.com',
    password: 'password123',
  },
  admin: {
    email: 'admin@example.com',
    password: 'password123',
  },
};

const tokenCache = new Map<string, string>();

export async function getAuthToken(
  request: APIRequestContext,
  credentials = TEST_USERS.client
): Promise<string> {
  const cacheKey = credentials.email;
  if (tokenCache.has(cacheKey)) {
    return tokenCache.get(cacheKey)!;
  }

  const response = await request.post('/auth/login', {
    data: credentials,
  });

  if (!response.ok()) {
    throw new Error(`Login failed for ${credentials.email} with status ${response.status()}`);
  }

  const body = await response.json();
  const token = body.data?.token || body.token || body.data?.accessToken || body.accessToken;
  if (!token) {
    throw new Error(`Token not found in login response for ${credentials.email}`);
  }

  tokenCache.set(cacheKey, token);
  return token;
}

export async function loginViaUI(
  page: Page,
  credentials = TEST_USERS.client
): Promise<void> {
  await page.goto('/login');
  await page.waitForLoadState('domcontentloaded');

  const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
  const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
  const submitButton = page.locator('button[type="submit"], button:has-text("Đăng nhập")').first();

  await emailInput.fill(credentials.email);
  await passwordInput.fill(credentials.password);
  await submitButton.click();

  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
}
