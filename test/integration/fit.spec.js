import { test, expect, openSite } from './support/fixtures.js';
import { SCHEDULE } from '../../src/data/schedule.js';

const FIRST_SUNDAY = Object.keys(SCHEDULE).sort()[0];
const APPROVED = [374, 375, 374];
const VERSE_TOO_LONG = 'This verse is too long to fit. Please choose a shorter passage.';
const TALK_TOO_LONG = 'The talk topic and hint are too long to fit. Please shorten them.';
const total = (heights) => Math.round(heights.reduce((a, b) => a + b, 0));

for (const iso of Object.keys(SCHEDULE)) {
  test(`the ${iso} lesson fits at the approved slip heights`, async ({ page }) => {
    const app = await openSite(page, { today: `${FIRST_SUNDAY}T09:00:00` });
    await app.chooseSunday(iso);
    expect(await app.overflowingSlips()).toEqual([]);
    expect(await app.slipHeights()).toEqual(APPROVED);
    expect(await app.warning('scripture-warning')).toBe('');
  });
}

test('a long talk hint grows the talk slip and warns about nothing', async ({ app }) => {
  await app.fill('scriptureText', '');
  await app.fill('talkHint', 'They can share a story from the scriptures and what they believe. '.repeat(8));
  const heights = await app.slipHeights();
  expect(heights[2]).toBeGreaterThan(APPROVED[2]);
  expect(total(heights)).toBe(1123);
  expect(await app.overflowingSlips()).toEqual([]);
  expect(await app.warning('scripture-warning')).toBe('');
  expect(await app.warning('talk-warning')).toBe('');
});

test('a long verse grows the scripture slip before it shrinks', async ({ app }) => {
  await app.fill('scriptureText', 'And it came to pass that they did go forth. '.repeat(14));
  const heights = await app.slipHeights();
  expect(heights[1]).toBeGreaterThan(APPROVED[1]);
  expect(total(heights)).toBe(1123);
  expect(await app.overflowingSlips()).toEqual([]);
  expect(await app.page.locator('#page section p').first().evaluate((p) => getComputedStyle(p).fontSize)).toBe('16px');
});

test('a verse that cannot fit warns in the form, not on the slip', async ({ app }) => {
  await app.fill('scriptureText', 'And it came to pass. '.repeat(80));
  expect(await app.warning('scripture-warning')).toBe(VERSE_TOO_LONG);
  expect(await app.warning('talk-warning')).toBe('');
  expect(await app.pageText()).not.toContain('too long');
});

test('talk text that cannot fit warns by the talk fields', async ({ app }) => {
  await app.fill('talkHint', 'A very long hint. '.repeat(120));
  expect(await app.warning('talk-warning')).toBe(TALK_TOO_LONG);
  expect(await app.warning('scripture-warning')).toBe('');
});
