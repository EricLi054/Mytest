import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
  // globalSetup: './playwright.setup.ts',
  timeout: 5 * 60 * 1000,
  testDir: path.join(__dirname, '../e2e'),
  fullyParallel: true,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { outputFolder: '../playwright-report' }]],
  use: {
    trace: 'on-first-retry',
    viewport: null,
    actionTimeout: 10000
    // baseURL: process.env.PLAYWRIGHT_BASE_URL || ''
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        deviceScaleFactor: undefined,
        viewport: null,
        launchOptions: {
          args: ['--start-maximized']
        }
      }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ]
});
