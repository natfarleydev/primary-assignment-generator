import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chooseSunday, emptyForm } from '../../src/core/form.js';

const SCHEDULE = {
  '2026-11-15': {
    lessonLabel: 'Come, Follow Me: Daniel 1–7',
    scriptureRef: 'Daniel 1:17',
    scriptureText: 'As for these four children…',
    talkTopic: 'God will bless me as I choose to follow Jesus Christ',
    talkHint: 'They can share a story from Daniel 1–7, something from their own life, and what they believe.',
  },
  '2026-11-29': {
    lessonLabel: 'Come, Follow Me: Amos; Obadiah; Jonah',
    scriptureRef: null, scriptureText: null, talkTopic: null, talkHint: null,
  },
};

const typed = {
  ...emptyForm(),
  scriptureRef: 'Typed ref', scriptureText: 'Typed verse', lessonLabel: 'Typed label',
  talkTopic: 'Typed topic', talkHint: 'Typed hint',
  phone: '07700 900123', prayerName: 'Ada', scriptureName: 'Ben', talkName: 'Cara',
};

test('choosing a Sunday with data fills the lesson fields from the schedule', () => {
  const form = chooseSunday(emptyForm(), '2026-11-15', SCHEDULE);
  assert.equal(form.sunday, '2026-11-15');
  assert.equal(form.scriptureRef, 'Daniel 1:17');
  assert.equal(form.scriptureText, 'As for these four children…');
  assert.equal(form.lessonLabel, 'Come, Follow Me: Daniel 1–7');
  assert.equal(form.talkTopic, 'God will bless me as I choose to follow Jesus Christ');
  assert.equal(form.talkHint, 'They can share a story from Daniel 1–7, something from their own life, and what they believe.');
});

test('choosing a Sunday keeps the phone number and the names', () => {
  const form = chooseSunday(typed, '2026-11-15', SCHEDULE);
  assert.equal(form.phone, '07700 900123');
  assert.deepEqual([form.prayerName, form.scriptureName, form.talkName], ['Ada', 'Ben', 'Cara']);
});

test('a null field in the schedule becomes an empty (write-in) field', () => {
  const form = chooseSunday(typed, '2026-11-29', SCHEDULE);
  assert.equal(form.scriptureRef, '');
  assert.equal(form.talkTopic, '');
  assert.equal(form.lessonLabel, 'Come, Follow Me: Amos; Obadiah; Jonah');
});

test('a Sunday with no data sets the date only', () => {
  const form = chooseSunday(typed, '2026-12-06', SCHEDULE);
  assert.equal(form.sunday, '2026-12-06');
  assert.equal(form.scriptureRef, 'Typed ref');
  assert.equal(form.talkHint, 'Typed hint');
});

test('"No date" clears the date and leaves the fields', () => {
  const form = chooseSunday({ ...typed, sunday: '2026-11-15' }, 'none', SCHEDULE);
  assert.equal(form.sunday, null);
  assert.equal(form.scriptureRef, 'Typed ref');
});

test('choosing a Sunday does not change the form it was given', () => {
  const before = { ...typed };
  chooseSunday(typed, '2026-11-15', SCHEDULE);
  assert.deepEqual(typed, before);
});
