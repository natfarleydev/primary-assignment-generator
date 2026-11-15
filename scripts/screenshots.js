// Write review screenshots of the slip page (794×1123 at 1.5×) to
// test-results/screenshots/ and print the pixel difference from the
// approved PNGs in docs/spec/screenshots/.
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { openSite } from '../test/integration/support/site.js';
import { CASES, shootCase, percentDifferent } from '../test/integration/support/compare.js';

const root = new URL('../', import.meta.url);
const OUT = new URL('test-results/screenshots/', root);
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
for (const c of CASES) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 }, deviceScaleFactor: 1.5 });
  const shot = await shootCase(await openSite(page), c, new URL(`${c.name}.png`, OUT).pathname);
  const approved = readFileSync(new URL(`docs/spec/screenshots/${c.name}.png`, root));
  console.log(`${c.name}: ${(await percentDifferent(browser, shot, approved)).toFixed(3)}% of pixels differ`);
  await page.close();
}
await browser.close();
