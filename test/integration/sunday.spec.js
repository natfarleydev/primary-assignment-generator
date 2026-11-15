import { test, expect, openSite } from './support/fixtures.js';

test('defaults to the next Sunday that has lesson data', async ({ page }) => {
  const app = await openSite(page, { today: '2026-11-16T09:00:00' });
  expect(await app.value('sunday')).toBe('2026-11-22');
  expect(await app.value('scriptureRef')).toBe('Joel 2:28–29');
});

test('the Sunday list offers only Sundays', async ({ app }) => {
  const [first, ...sundays] = await app.sundayValues();
  expect(first).toBe('none');
  for (const iso of sundays) expect(new Date(`${iso}T00:00:00Z`).getUTCDay(), iso).toBe(0);
});

test('typed text wins until a different Sunday is chosen', async ({ app }) => {
  await app.chooseSunday('2026-11-15');
  await app.fill('talkTopic', 'Jesus loves me');
  expect(await app.pageText()).toContain('Jesus loves me');
  await app.chooseSunday('2026-11-22');
  expect(await app.value('talkTopic')).toBe('The Holy Ghost can guide me');
});
