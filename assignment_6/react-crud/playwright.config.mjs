import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.APP_URL || 'http://127.0.0.1:4176',
    viewport: { width: 1440, height: 1000 },
    launchOptions: process.platform === 'win32' ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' } : {}
  },
  webServer: process.env.APP_URL ? undefined : {
    command: 'node preview.mjs',
    url: 'http://127.0.0.1:4176',
    reuseExistingServer: false
  }
});
