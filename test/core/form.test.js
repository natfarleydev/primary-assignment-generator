import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { emptyForm, update, FIELDS } from '../../src/core/form.js';

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

const choose = (form, sunday) => update(form, { type: 'sundayChosen', sunday }, SCHEDULE);
const type = (form, field, text) => update(form, { type: 'fieldTyped', field, text }, SCHEDULE);

test('choosing a Sunday with data fills the lesson fields from the schedule', () => {
  const form = choose(emptyForm(), '2026-11-15');
  assert.equal(form.sunday, '2026-11-15');
  assert.equal(form.scriptureRef, 'Daniel 1:17');
  assert.equal(form.scriptureText, 'As for these four children…');
  assert.equal(form.lessonLabel, 'Come, Follow Me: Daniel 1–7');
  assert.equal(form.talkTopic, 'God will bless me as I choose to follow Jesus Christ');
  assert.equal(form.talkHint, 'They can share a story from Daniel 1–7, something from their own life, and what they believe.');
});

test('choosing a Sunday keeps the phone number and the names', () => {
  const form = choose(typed, '2026-11-15');
  assert.equal(form.phone, '07700 900123');
  assert.deepEqual([form.prayerName, form.scriptureName, form.talkName], ['Ada', 'Ben', 'Cara']);
});

test('a null field in the schedule becomes an empty (write-in) field', () => {
  const form = choose(typed, '2026-11-29');
  assert.equal(form.scriptureRef, '');
  assert.equal(form.talkTopic, '');
  assert.equal(form.lessonLabel, 'Come, Follow Me: Amos; Obadiah; Jonah');
});

test('a Sunday with no data sets the date only', () => {
  const form = choose(typed, '2026-12-06');
  assert.equal(form.sunday, '2026-12-06');
  assert.equal(form.scriptureRef, 'Typed ref');
  assert.equal(form.talkHint, 'Typed hint');
});

test('"No date" clears the date and leaves the fields', () => {
  const form = choose({ ...typed, sunday: '2026-11-15' }, null);
  assert.equal(form.sunday, null);
  assert.equal(form.scriptureRef, 'Typed ref');
});

test('typing in a field changes only that field', () => {
  const form = type(choose(emptyForm(), '2026-11-15'), 'talkTopic', 'Jesus loves me');
  assert.equal(form.talkTopic, 'Jesus loves me');
  assert.equal(form.scriptureRef, 'Daniel 1:17');
  assert.equal(form.sunday, '2026-11-15');
});

test('typing cannot change the Sunday or add unknown fields', () => {
  const before = choose(emptyForm(), '2026-11-15');
  assert.deepEqual(type(before, 'sunday', '2026-12-06'), before);
  assert.deepEqual(type(before, 'colour', 'red'), before);
});

test('update never changes the form it was given', () => {
  const before = { ...typed };
  choose(typed, '2026-11-15');
  type(typed, 'phone', '0');
  assert.deepEqual(typed, before);
});

test('the page has an input for every form field', () => {
  const html = readFileSync(new URL('../../src/index.html', import.meta.url), 'utf8');
  for (const field of FIELDS) assert.match(html, new RegExp(`id="${field}" name="${field}"`), field);
});
