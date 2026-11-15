import { test, expect } from './support/fixtures.js';

test('printing gives a single A4 page', async ({ app }) => {
  await app.chooseSunday('2026-11-22');
  const pdf = (await app.page.pdf({ preferCSSPageSize: true, printBackground: true })).toString('latin1');
  expect(pdf.match(/\/Type\s*\/Page[^s]/g)).toHaveLength(1);
  const [, w, h] = pdf.match(/\/MediaBox\s*\[\s*0 0 ([\d.]+) ([\d.]+)\s*\]/);
  expect([Math.round(w), Math.round(h)]).toEqual([595, 842]); // A4 in points
});
