// Wiring: connects the view and the store to the pure core.

import { SCHEDULE } from './data/schedule.js';
import { FIELDS, emptyForm, update } from './core/form.js';
import { isoDate, sundayChoice } from './core/sundays.js';
import { layoutPage, previewScale } from './core/page.js';
import { createView, today } from './shell/view.js';
import { createStore } from './shell/store.js';

const SUNDAYS_LISTED = 26;

const view = createView(document, FIELDS);

const showSlips = (form) => {
  const { html, warnings } = layoutPage(form, view.measure);
  view.showPage(html);
  view.showWarnings(warnings);
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
