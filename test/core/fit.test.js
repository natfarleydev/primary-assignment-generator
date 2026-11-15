import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitVerse } from '../../src/core/fit.js';

test('a verse that fits stays at 16px', () => {
  assert.deepEqual(fitVerse(() => false), { verseSize: 16, tooLong: false });
});

test('a verse that overflows at 16px shrinks 1px at a time until it fits', () => {
  assert.deepEqual(fitVerse((px) => px > 15), { verseSize: 15, tooLong: false });
  assert.deepEqual(fitVerse((px) => px > 14), { verseSize: 14, tooLong: false });
});

test('a verse that overflows even at 14px stays at 14px and is flagged too long', () => {
  assert.deepEqual(fitVerse(() => true), { verseSize: 14, tooLong: true });
});
