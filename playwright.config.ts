import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const isHeadless = isCI || process.env.HEADLESS === 'true';

export default defineConfig({
  testDir: './playwright',
  outputDir: './playwright/test-results',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 2 : 1,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright/playwright-report', open: 'never' }],
    ['list'],
    ...(isCI ? ([['github']] as const) : [])
  ],
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npm run backend:dev',
      url: 'http://127.0.0.1:3000/categories',
      reuseExistingServer: !isCI,
      timeout: 120 * 1000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: 'npm run web:dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !isCI,
      timeout: 120 * 1000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
  ],
  projects: [
    {
      name: 'unit',
      testDir: './playwright/ui',
      testMatch: /.*unit\.spec\.ts$/,
    },
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
      testIgnore: /.*unit\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        headless: isHeadless,
        baseURL: 'http://localhost:5173',
      },
    },
    {
      name: 'e2e',
      testDir: './playwright/e2e',
      use: {
        ...devices['Desktop Chrome'],
        headless: isHeadless,
        baseURL: 'http://localhost:5173',
      },
    },
    {
      name: 'web-tests',
      testDir: './web/tests',
      use: {
        ...devices['Desktop Chrome'],
        headless: isHeadless,
        baseURL: 'http://localhost:5173',
      },
    }
  ],
});
