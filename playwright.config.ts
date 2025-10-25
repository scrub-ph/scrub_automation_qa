import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'https://scrub-sync-mickymac19.replit.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    permissions: ['geolocation'],
    geolocation: { latitude: 14.5995, longitude: 120.9842 }
  },
  projects: [
    {
      name: 'chrome',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      }
    },
  ],
  outputDir: 'test-results',
  // Global teardown to ensure browsers are closed
  globalTeardown: require.resolve('./tests/global-teardown.ts')
});
