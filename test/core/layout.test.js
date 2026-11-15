import { test } from 'node:test';
import assert from 'node:assert/strict';
import { layoutPage } from '../../src/core/page.js';
import { emptyForm } from '../../src/core/form.js';

// Fake measurer: the natural height of each slip, keyed by the verse size
// the page was rendered at.
const verseSizeIn = (html) => Number((html.match(/font-size: (\d+)px; line-height: 1\.4; text-wrap/) || [])[1]);
// The values below are the heights each slip needs; the fake adds the 4px
// of bottom padding a slip may use, as the real measurer includes it.
const measureAs = (byVerseSize) => (html) => byVerseSize[verseSizeIn(html)].map((h) => h + 4);
const heightsIn = (html) => [...html.matchAll(/<section style="height: (\d+)px/g)].map((m) => Number(m[1]));
const verseSizeOf = (html) => verseSizeIn(html);

const FORM = { ...emptyForm(), scriptureText: 'A verse.' };
const NO_WARNINGS = { scripture: '', talk: '' };

test('when everything fits, slips keep the approved heights and the verse stays 16px', () => {
  const page = layoutPage(FORM, measureAs({ 16: [200, 300, 300] }));
  assert.deepEqual(heightsIn(page.html), [374, 375, 374]);
  assert.equal(verseSizeOf(page.html), 16);
  assert.deepEqual(page.warnings, NO_WARNINGS);
});

test('a slip that needs more room grows into the spare space of the others', () => {
  // Scripture needs 75px more. Spare: prayer 174, talk 74, so prayer gives more.
  const page = layoutPage(FORM, measureAs({ 16: [200, 450, 300] }));
  assert.deepEqual(heightsIn(page.html), [321, 450, 352]);
  assert.equal(verseSizeOf(page.html), 16);
  assert.deepEqual(page.warnings, NO_WARNINGS);
});

test('the talk slip can grow too', () => {
  const page = layoutPage(FORM, measureAs({ 16: [200, 300, 500] }));
  assert.deepEqual(heightsIn(page.html), [286, 337, 500]);
  assert.deepEqual(page.warnings, NO_WARNINGS);
});

test('the verse shrinks only when growing is not enough', () => {
  const page = layoutPage(FORM, measureAs({ 16: [300, 900, 300], 15: [300, 800, 300], 14: [300, 500, 300] }));
  assert.equal(verseSizeOf(page.html), 14);
  assert.deepEqual(heightsIn(page.html), [311, 500, 312]);
  assert.deepEqual(page.warnings, NO_WARNINGS);
});

test('a verse that cannot fit at 14px warns by the scripture fields', () => {
  const page = layoutPage(FORM, measureAs({ 16: [300, 900, 300], 15: [300, 900, 300], 14: [300, 900, 300] }));
  assert.equal(verseSizeOf(page.html), 14);
  assert.deepEqual(heightsIn(page.html), [374, 375, 374]);
  assert.deepEqual(page.warnings, {
    scripture: 'This verse is too long to fit. Please choose a shorter passage.',
    talk: '',
  });
});

test('talk text that cannot fit warns by the talk fields, not the verse', () => {
  const page = layoutPage(FORM, measureAs({ 16: [300, 300, 900], 15: [300, 300, 900], 14: [300, 300, 900] }));
  assert.deepEqual(page.warnings, {
    scripture: '',
    talk: 'The talk topic and hint are too long to fit. Please shorten them.',
  });
});
