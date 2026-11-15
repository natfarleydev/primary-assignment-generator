// Wiring: connects the view and the store to the pure core.

import { SCHEDULE } from './data/schedule.js';
import { FIELDS, emptyForm, update } from './core/form.js';
import { isoDate, sundayChoice } from './core/sundays.js';
import { renderPage, previewScale } from './core/page.js';
import { fitVerse } from './core/fit.js';
import { createView, today } from './shell/view.js';
import { createStore } from './shell/store.js';

const SUNDAYS_LISTED = 26;
const TOO_LONG = 'This verse is too long to fit. Please choose a shorter passage.';

const view = createView(document, FIELDS);

const showSlips = (form) => {
  const { verseSize, tooLong } = fitVerse((px) => {
    view.showPage(renderPage(form, { verseSize: px }));
    return view.slipsOverflow();
  });
  view.showPage(renderPage(form, { verseSize }));
  view.showWarning('fit-warning', tooLong ? TOO_LONG : '');
};

const step = (form, action) => update(form, action, SCHEDULE);
const choice = sundayChoice(isoDate(today()), SCHEDULE, SUNDAYS_LISTED);
const store = createStore(step(emptyForm(), { type: 'sundayChosen', sunday: choice.selected }), step,
  (form, action) => {
    if (action.type === 'sundayChosen') view.showFields(form);
    showSlips(form);
  });

view.showSundays(choice.options, choice.selected);
view.showFields(store.state());
showSlips(store.state());
view.scalePreview(previewScale);

view.onSundayChosen((sunday) => store.dispatch({ type: 'sundayChosen', sunday }));
view.onFieldTyped((field, text) => store.dispatch({ type: 'fieldTyped', field, text }));
view.onPrint(() => window.print());
view.onResize(() => view.scalePreview(previewScale));
view.fontsReady().then(() => showSlips(store.state()));
