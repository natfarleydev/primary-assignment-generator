import { test, expect } from './support/fixtures.js';

const REPO = 'https://github.com/natfarleydev/primary-assignment-generator';
const BADGE = `${REPO}/actions/workflows/ci.yml/badge.svg?branch=main`;

test('the form shows the build status badge, linked to the test runs', async ({ app }) => {
  const badge = app.page.getByRole('link', { name: /build status/i });
  await expect(badge).toHaveAttribute('href', `${REPO}/actions/workflows/ci.yml`);
  await expect(badge.locator('img')).toHaveAttribute('src', BADGE);
});

test('the badge is the only thing the page loads from the network', async ({ app }) => {
  expect(app.requests).toEqual([BADGE]);
});

test('the badge does not print', async ({ app }) => {
  await app.page.emulateMedia({ media: 'print' });
  await expect(app.page.getByRole('link', { name: /build status/i })).toBeHidden();
});
