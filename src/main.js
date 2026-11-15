// Wiring: connects the shell's effects to the pure core.

import { SCHEDULE } from './data/schedule.js';
import { emptyForm, chooseSunday } from './core/form.js';
import { isoDate, sundayChoice } from './core/sundays.js';
import { renderPage } from './core/page.js';
import { fitVerse } from './core/fit.js';
import * as fx from './shell/effects.js';

const TEXT_FIELDS = ['scriptureRef', 'scriptureText', 'lessonLabel', 'talkTopic', 'talkHint',
  'phone', 'prayerName', 'scriptureName', 'talkName'];
const SUNDAYS_LISTED = 26;
const TOO_LONG = 'This verse is too long to fit. Please choose a shorter passage.';

const $ = (id) => document.getElementById(id);
const formEl = $('form');
const pageEl = $('page');
const frameEl = $('preview-frame');

const renderFitted = (form) => {
  const { verseSize, tooLong } = fitVerse((px) => {
    fx.writeHtml(pageEl, renderPage(form, { verseSize: px }));
    return fx.slipsOverflow(pageEl);
  });
  fx.writeHtml(pageEl, renderPage(form, { verseSize }));
  fx.writeText($('fit-warning'), tooLong ? TOO_LONG : '');
};

const currentForm = () => ({
  ...emptyForm(),
  sunday: formEl.elements.sunday.value === 'none' ? null : formEl.elements.sunday.value,
  ...fx.readFields(formEl, TEXT_FIELDS),
});

const start = () => {
  const choice = sundayChoice(isoDate(fx.today()), SCHEDULE, SUNDAYS_LISTED);
  const initial = chooseSunday(emptyForm(), choice.selected ?? 'none', SCHEDULE);
  fx.writeOptions(formEl.elements.sunday, choice.options, choice.selected);
  fx.writeFields(formEl, initial, TEXT_FIELDS);
  renderFitted(initial);

  formEl.elements.sunday.addEventListener('change', (e) => {
    const form = chooseSunday(currentForm(), e.target.value, SCHEDULE);
    fx.writeFields(formEl, form, TEXT_FIELDS);
    renderFitted(form);
  });
  formEl.addEventListener('input', (e) => {
    if (e.target.name !== 'sunday') renderFitted(currentForm());
  });
  formEl.addEventListener('submit', (e) => e.preventDefault());
  $('print').addEventListener('click', fx.print);

  fx.fitPreview(frameEl, pageEl);
  new ResizeObserver(() => fx.fitPreview(frameEl, pageEl)).observe(frameEl);
  fx.fontsReady().then(() => renderFitted(currentForm()));
};

start();
