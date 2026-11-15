// Browser checks on the built site (SPEC 8). Run: npm run test:e2e
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { SCHEDULE } from '../../src/data/schedule.js';

const { chromium } = createRequire(import.meta.url)('playwright');
const SITE = pathToFileURL(new URL('../../dist/index.html', import.meta.url).pathname).href;

let browser;
before(async () => { browser = await chromium.launch(); });
after(async () => { await browser.close(); });

// Open the site offline, with "today" fixed.
const openSite = async (today = '2026-11-10T12:00:00') => {
  const context = await browser.newContext({ viewport: { width: 1400, height: 1200 } });
  const requests = [];
  await context.route('**/*', (route) => {
    const url = route.request().url();
    if (url.startsWith('file:') || url.startsWith('data:')) return route.continue();
    requests.push(url);
    return route.abort();
  });
  const page = await context.newPage();
  await page.clock.setFixedTime(new Date(today));
  await page.goto(SITE);
  await page.evaluate(() => document.fonts.ready);
  return { page, requests, close: () => context.close() };
};

const overflowingSlips = (page) => page.$$eval('#page section', (slips) =>
  slips.filter((s) => s.scrollHeight > s.clientHeight).length);

test('works from file:// with no network requests, and the slip font loads', async () => {
  const { page, requests, close } = await openSite();
  assert.deepEqual(requests, []);
  assert.equal(await page.evaluate(() => document.fonts.check("700 52px 'Atkinson Hyperlegible'")), true);
  await close();
});

test('defaults to the next Sunday that has lesson data', async () => {
  const { page, close } = await openSite('2026-11-16T09:00:00');
  assert.equal(await page.inputValue('#sunday'), '2026-11-22');
  assert.equal(await page.inputValue('#scriptureRef'), 'Joel 2:28–29');
  await close();
});

test('the Sunday list offers only Sundays', async () => {
  const { page, close } = await openSite();
  const values = await page.$$eval('#sunday option', (os) => os.map((o) => o.value));
  assert.equal(values[0], 'none');
  values.slice(1).forEach((iso) => assert.equal(new Date(`${iso}T00:00:00Z`).getUTCDay(), 0, iso));
  await close();
});

test('every verse in SCHEDULE fits at 14px or more', async () => {
  const first = Object.keys(SCHEDULE).sort()[0];
  const { page, close } = await openSite(`${first}T09:00:00`);
  for (const iso of Object.keys(SCHEDULE)) {
    await page.selectOption('#sunday', iso);
    assert.equal(await overflowingSlips(page), 0, `${iso} overflows`);
    assert.equal(await page.textContent('#fit-warning'), '', `${iso} shows the too-long warning`);
  }
  await close();
});

test('a verse that cannot fit shows the warning in the form, not on the slip', async () => {
  const { page, close } = await openSite();
  await page.fill('#scriptureText', 'And it came to pass. '.repeat(40));
  assert.equal(await page.textContent('#fit-warning'), 'This verse is too long to fit. Please choose a shorter passage.');
  assert.doesNotMatch(await page.textContent('#page'), /too long/);
  await close();
});

test('typing a phone number puts it on all 3 slips', async () => {
  const { page, close } = await openSite();
  await page.fill('#phone', '07700 900123');
  const slips = await page.$$eval('#page section', (s) => s.map((x) => x.textContent));
  assert.equal(slips.length, 3);
  slips.forEach((text) => assert.match(text, /07700 900123/));
  await close();
});

test('typed text wins until a different Sunday is chosen', async () => {
  const { page, close } = await openSite();
  await page.selectOption('#sunday', '2026-11-15');
  await page.fill('#talkTopic', 'Jesus loves me');
  assert.match(await page.textContent('#page'), /Jesus loves me/);
  await page.selectOption('#sunday', '2026-11-22');
  assert.equal(await page.inputValue('#talkTopic'), 'The Holy Ghost can guide me');
  await close();
});

test('printing gives a single A4 page', async () => {
  const { page, close } = await openSite();
  await page.selectOption('#sunday', '2026-11-22');
  const pdf = (await page.pdf({ preferCSSPageSize: true, printBackground: true })).toString('latin1');
  assert.equal((pdf.match(/\/Type\s*\/Page[^s]/g) || []).length, 1);
  const box = pdf.match(/\/MediaBox\s*\[\s*0 0 ([\d.]+) ([\d.]+)\s*\]/);
  assert.deepEqual([Math.round(box[1]), Math.round(box[2])], [595, 842]); // A4 in points
  await close();
});

import { CASES, shootCase, percentDifferent } from './compare.js';

for (const c of CASES) {
  test(`${c.name} matches the approved screenshot`, async () => {
    const context = await browser.newContext({ viewport: { width: 1400, height: 1200 }, deviceScaleFactor: 1.5 });
    const page = await context.newPage();
    await page.clock.setFixedTime(new Date('2026-11-10T12:00:00'));
    await page.goto(SITE);
    await page.evaluate(() => document.fonts.ready);
    const shot = await shootCase(page, c);
    const diff = await percentDifferent(browser, shot, new URL(`../../docs/spec/screenshots/${c.name}.png`, import.meta.url));
    assert.ok(diff < 0.01, `${diff.toFixed(3)}% of pixels differ`);
    await context.close();
  });
}
