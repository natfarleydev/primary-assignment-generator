// Playwright fixture: `app` is the site harness (./site.js) on a fresh page.
import { test as base, expect } from '@playwright/test';
import { openSite } from './site.js';

export const test = base.extend({
  app: async ({ page }, use) => { await use(await openSite(page)); },
});

export { expect, openSite };
