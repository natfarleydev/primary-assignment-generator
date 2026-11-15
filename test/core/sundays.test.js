import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatSlipDate, defaultSunday, sundayOptions } from '../../src/core/sundays.js';

test('slip date shows weekday, day and full month, with no year', () => {
  assert.equal(formatSlipDate('2026-11-15'), 'Sunday 15 November');
});

test('slip date has no leading zero on the day', () => {
  assert.equal(formatSlipDate('2026-12-06'), 'Sunday 6 December');
});

const SCHEDULE_KEYS = { '2026-11-15': {}, '2026-11-22': {} };

test('default is today when today is a Sunday in the schedule', () => {
  assert.equal(defaultSunday('2026-11-15', SCHEDULE_KEYS), '2026-11-15');
});

test('default is the next scheduled Sunday after a weekday', () => {
  assert.equal(defaultSunday('2026-11-16', SCHEDULE_KEYS), '2026-11-22');
});

test('default is null ("No date") when no scheduled Sunday is left', () => {
  assert.equal(defaultSunday('2026-11-23', SCHEDULE_KEYS), null);
});

const SCHEDULE = {
  '2026-11-15': { lessonLabel: 'Come, Follow Me: Daniel 1–7' },
  '2026-11-22': { lessonLabel: 'Come, Follow Me: Hosea; Joel' },
};

test('dropdown starts with "No date", then the coming Sundays only', () => {
  assert.deepEqual(sundayOptions('2026-11-18', SCHEDULE, 3), [
    { value: 'none', label: 'No date: write it in by hand' },
    { value: '2026-11-22', label: 'Sunday 22 November 2026: Hosea; Joel' },
    { value: '2026-11-29', label: 'Sunday 29 November 2026' },
    { value: '2026-12-06', label: 'Sunday 6 December 2026' },
  ]);
});

test('on a Sunday, the dropdown includes that Sunday', () => {
  const values = sundayOptions('2026-11-15', SCHEDULE, 2).map((o) => o.value);
  assert.deepEqual(values, ['none', '2026-11-15', '2026-11-22']);
});
