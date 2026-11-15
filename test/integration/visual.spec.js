import { test, expect, openApp } from './support/fixtures.js';
import { CASES, shootCase, percentDifferent } from './support/compare.js';

test.use({ deviceScaleFactor: 1.5 });

for (const c of CASES) {
  test(`${c.name} matches the approved screenshot`, async ({ page, browser }) => {
    await openApp(page);
    const shot = await shootCase(page, c);
    const diff = await percentDifferent(browser, shot, new URL(`../../docs/spec/screenshots/${c.name}.png`, import.meta.url));
    expect(diff, `${diff.toFixed(3)}% of pixels differ`).toBeLessThan(0.01);
  });
}
