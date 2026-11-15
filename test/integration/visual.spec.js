// Layout check: our page must render exactly like the approved reference
// HTML (docs/spec/reference/). Both are drawn by the same browser on the same
// machine, so font rasterising cannot cause a false failure on CI.
// The approved PNGs are checked by eye with `npm run screenshots`.
import { test, expect, openApp } from './support/fixtures.js';
import { CASES, shootCase, shootReference, percentDifferent } from './support/compare.js';

test.use({ deviceScaleFactor: 1.5 });

for (const c of CASES) {
  test(`${c.name} renders exactly like the approved reference`, async ({ page, browser }) => {
    const reference = await shootReference(await browser.newPage({ deviceScaleFactor: 1.5 }), c);
    await openApp(page);
    const ours = await shootCase(page, c);
    const diff = await percentDifferent(browser, ours, reference);
    expect(diff, `${diff.toFixed(3)}% of pixels differ`).toBeLessThan(0.01);
  });
}
