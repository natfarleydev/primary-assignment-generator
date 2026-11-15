import { test, expect, openSite } from './support/fixtures.js';
import { SCHEDULE } from '../../src/data/schedule.js';

const FIRST_SUNDAY = Object.keys(SCHEDULE).sort()[0];

for (const iso of Object.keys(SCHEDULE)) {
  test(`the ${iso} verse fits at 14px or more`, async ({ page }) => {
    const app = await openSite(page, { today: `${FIRST_SUNDAY}T09:00:00` });
    await app.chooseSunday(iso);
    expect(await app.overflowingSlips()).toEqual([]);
    expect(await app.warning('fit-warning')).toBe('');
  });
}

test('a verse that cannot fit shows the warning in the form, not on the slip', async ({ app }) => {
  await app.fill('scriptureText', 'And it came to pass. '.repeat(40));
  expect(await app.warning('fit-warning')).toBe('This verse is too long to fit. Please choose a shorter passage.');
  expect(await app.pageText()).not.toContain('too long');
});
