import { test, expect } from './support/fixtures.js';

test('typing a phone number puts it on all 3 slips', async ({ app }) => {
  await app.fill('phone', '07700 900123');
  const slips = await app.slipTexts();
  expect(slips).toHaveLength(3);
  for (const text of slips) expect(text).toContain('07700 900123');
});

test('each child name prints on its own slip', async ({ app }) => {
  await app.fill('prayerName', 'Ada');
  await app.fill('talkName', 'Cara');
  const [prayer, scripture, talk] = await app.slipTexts();
  expect(prayer).toContain('Ada');
  expect(scripture).not.toMatch(/Ada|Cara/);
  expect(talk).toContain('Cara');
});
