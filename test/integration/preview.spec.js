import { test, expect } from './support/fixtures.js';

const pageRight = (page) => page.evaluate(() => document.getElementById('page').getBoundingClientRect().right);
const scrollWidth = (page) => page.evaluate(() => document.documentElement.scrollWidth);

for (const [name, width] of [['phone', 390], ['narrow desktop', 1100]]) {
  test(`on a ${name} the preview scales to fit, with no sideways scrolling`, async ({ app }) => {
    await app.page.setViewportSize({ width, height: 900 });
    // The preview rescales when the browser reports the resize.
    await expect.poll(() => pageRight(app.page)).toBeLessThanOrEqual(width);
    expect(await scrollWidth(app.page)).toBeLessThanOrEqual(width);
  });
}
