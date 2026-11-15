import { test, expect } from './support/fixtures.js';

// The fixture blocks every network request, so this is the page offline.
test('works from file:// with the network off, and the slip font loads', async ({ app }) => {
  expect(await app.slipTexts()).toHaveLength(3);
  expect(await app.page.evaluate(() => document.fonts.check("700 52px 'Atkinson Hyperlegible'"))).toBe(true);
});
