import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  outputDir: './playwright/test-results',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright/playwright-report' }]],
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'api',
      testDir: './playwright/api',
      use: {
        baseURL: 'http://127.0.0.1:3000',
      },
    },
    {
      name: 'ui',
      testDir: './playwright/ui',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        baseURL: 'http://localhost:5173',
      },
    },
    {
      name: 'e2e',
      testDir: './playwright/e2e',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        baseURL: 'http://localhost:5173',
      },
    }
  ],
});
