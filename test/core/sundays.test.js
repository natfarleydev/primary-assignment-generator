import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatSlipDate, isoDate, sundayChoice } from '../../src/core/sundays.js';

test('slip date shows weekday, day and full month, with no year', () => {
  assert.equal(formatSlipDate('2026-11-15'), 'Sunday 15 November');
});

test('slip date has no leading zero on the day', () => {
  assert.equal(formatSlipDate('2026-12-06'), 'Sunday 6 December');
});

test('a local date becomes an ISO date with leading zeros', () => {
  assert.equal(isoDate({ year: 2026, month: 3, day: 7 }), '2026-03-07');
});

const SCHEDULE = {
  '2026-11-15': { lessonLabel: 'Come, Follow Me: Daniel 1–7' },
  '2026-11-22': { lessonLabel: 'Come, Follow Me: Hosea; Joel' },
};

test('options are "No date", then the coming Sundays only', () => {
  assert.deepEqual(sundayChoice('2026-11-18', SCHEDULE, 3).options, [
    { value: null, label: 'No date: write it in by hand' },
    { value: '2026-11-22', label: 'Sunday 22 November 2026: Hosea; Joel' },
    { value: '2026-11-29', label: 'Sunday 29 November 2026' },
    { value: '2026-12-06', label: 'Sunday 6 December 2026' },
  ]);
});

test('on a Sunday, the options include that Sunday', () => {
  const values = sundayChoice('2026-11-15', SCHEDULE, 2).options.map((o) => o.value);
  assert.deepEqual(values, [null, '2026-11-15', '2026-11-22']);
});

test('selects today when today is a scheduled Sunday', () => {
  assert.equal(sundayChoice('2026-11-15', SCHEDULE, 4).selected, '2026-11-15');
});

test('selects the next scheduled Sunday after a weekday', () => {
  assert.equal(sundayChoice('2026-11-16', SCHEDULE, 4).selected, '2026-11-22');
});

test('selects "No date" when no scheduled Sunday is left', () => {
  assert.equal(sundayChoice('2026-11-23', SCHEDULE, 4).selected, null);
});

test('never selects a scheduled Sunday that is not in the list', () => {
  assert.equal(sundayChoice('2026-11-01', SCHEDULE, 2).selected, null);
});
