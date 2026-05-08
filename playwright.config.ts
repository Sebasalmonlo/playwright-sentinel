import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    ['./src/core/reporter.ts']
  ],
  use: {
    ...devices['Desktop Chrome'],
  },
});