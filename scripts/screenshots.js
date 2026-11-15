// Write review screenshots of the slip page (794×1123 at 1.5×) to
// test/e2e/output/ and print the pixel difference from the approved PNGs.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
import { CASES, shootCase, percentDifferent } from '../test/e2e/compare.js';

const { chromium } = createRequire(import.meta.url)('playwright');
const root = new URL('../', import.meta.url);
const OUT = new URL('test/e2e/output/', root);
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
for (const c of CASES) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 }, deviceScaleFactor: 1.5 });
  await page.clock.setFixedTime(new Date('2026-11-10T12:00:00'));
  await page.goto(pathToFileURL(new URL('dist/index.html', root).pathname).href);
  await page.evaluate(() => document.fonts.ready);
  const shot = await shootCase(page, c, new URL(`${c.name}.png`, OUT).pathname);
  const diff = await percentDifferent(browser, shot, new URL(`docs/spec/screenshots/${c.name}.png`, root));
  console.log(`${c.name}: ${diff.toFixed(3)}% of pixels differ`);
  await page.close();
}
await browser.close();
