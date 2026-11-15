// Shared fixture: `app` opens the built site the way a leader would, with
// "today" fixed and the network blocked, and gives tests plain-language actions.
import { test as base, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';

export const SITE = pathToFileURL(new URL('../../../dist/index.html', import.meta.url).pathname).href;
export const DEFAULT_TODAY = '2026-11-10T12:00:00';

const isLocal = (url) => url.startsWith('file:') || url.startsWith('data:');

// Open the site. Every non-local request is recorded and blocked, so tests
// never depend on the network and can check what the page tries to load.
export const openApp = async (page, { today = DEFAULT_TODAY } = {}) => {
  const requests = [];
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (isLocal(url)) return route.continue();
    requests.push(url);
    return route.abort();
  });
  await page.clock.setFixedTime(new Date(today));
  await page.goto(SITE);
  await page.evaluate(() => document.fonts.ready);
  return {
    page,
    requests,
    chooseSunday: (value) => page.selectOption('#sunday', value),
    fill: (field, text) => page.fill(`#${field}`, text),
    value: (field) => page.inputValue(`#${field}`),
    sundayValues: () => page.$$eval('#sunday option', (os) => os.map((o) => o.value)),
    slipTexts: () => page.$$eval('#page section', (s) => s.map((x) => x.textContent)),
    pageText: () => page.textContent('#page'),
    overflowingSlips: () => page.$$eval('#page section', (s) => s.filter((x) => x.scrollHeight > x.clientHeight).length),
    fitWarning: () => page.textContent('#fit-warning'),
  };
};

export const test = base.extend({
  app: async ({ page }, use) => { await use(await openApp(page)); },
});

export { expect };
