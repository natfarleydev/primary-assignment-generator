// Integration tests: drive the built site (dist/index.html) in a real browser.
import { defineConfig } from '@playwright/test';

const CI = Boolean(process.env.CI);

export default defineConfig({
  testDir: 'test/integration',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: CI,
  retries: 0, // Tests must be deterministic. A flaky test is a bug to fix.
  reporter: CI ? [['github'], ['html', { open: 'never' }], ['list']] : [['dot']],
  use: {
    browserName: 'chromium',
    viewport: { width: 1400, height: 1200 },
    trace: 'off',
  },
});
