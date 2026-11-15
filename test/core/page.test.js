import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderPage } from '../../src/core/page.js';
import { update, emptyForm } from '../../src/core/form.js';
import { SCHEDULE } from '../../src/data/schedule.js';

// The approved page markup: the A4 <div> inside each reference file.
const referencePage = (name) => {
  const html = readFileSync(new URL(`../../docs/spec/reference/${name}.html`, import.meta.url), 'utf8');
  return html.slice(html.indexOf('<div style="width: 794px'), html.lastIndexOf('</body>'));
};
const normalise = (html) => html.replace(/>\s+</g, '><').trim();

const formFor = (sunday) => update(emptyForm(), { type: 'sundayChosen', sunday }, SCHEDULE);

test('Sunday 15 November matches the approved markup', () => {
  assert.equal(normalise(renderPage(formFor('2026-11-15'))), normalise(referencePage('dated-15-november')));
});

test('Sunday 22 November matches the approved markup', () => {
  assert.equal(normalise(renderPage(formFor('2026-11-22'))), normalise(referencePage('dated-22-november')));
});

test('"No date" with every field empty matches the approved blank page', () => {
  assert.equal(normalise(renderPage(emptyForm())), normalise(referencePage('blank-write-in')));
});

const count = (haystack, needle) => haystack.split(needle).length - 1;

test('a phone number prints on all 3 slips in place of the write-in line', () => {
  const html = renderPage({ ...emptyForm(), phone: '07700 900123' });
  assert.equal(count(html, '07700 900123'), 3);
  assert.equal(count(html, 'height: 26px; border-bottom'), 0);
});

test('each child name prints on its own slip, and a missing name stays a line', () => {
  const html = renderPage({ ...emptyForm(), prayerName: 'Ada', talkName: 'Cara' });
  const [prayer, scripture, talk] = html.split('<section').slice(1);
  assert.match(prayer, />Ada</);
  assert.doesNotMatch(scripture, />Ada<|>Cara</);
  assert.match(scripture, /height: 30px; border-bottom: 1\.5px solid #111111"><\/span>/);
  assert.match(talk, />Cara</);
});

test('typed text is escaped, so it cannot inject markup', () => {
  const html = renderPage({ ...emptyForm(), talkTopic: '<b>Faith</b> & "hope"' });
  assert.match(html, /&lt;b&gt;Faith&lt;\/b&gt; &amp; &quot;hope&quot;/);
});

test('the verse prints at the size asked for', () => {
  const html = renderPage(formFor('2026-11-22'), { verseSize: 14 });
  assert.match(html, /font-size: 14px; line-height: 1\.4; text-wrap: pretty">And it shall/);
});

test('parts can mix: a typed reference with no verse gives a write-in line for the verse', () => {
  const html = renderPage({ ...emptyForm(), scriptureRef: 'Jonah 2:9' });
  const scripture = html.split('<section')[2];
  assert.match(scripture, />Jonah 2:9</);
  assert.match(scripture, /<div style="display: flex; height: 30px">/);
});

import { previewScale } from '../../src/core/page.js';

test('the preview shrinks the A4 page to fit the space, but never enlarges it', () => {
  assert.equal(previewScale(397), 0.5);
  assert.equal(previewScale(2000), 1);
});
