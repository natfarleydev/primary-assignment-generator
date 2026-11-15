// Pure renderer: form → HTML string for one A4 page of 3 slips.
// Markup and inline styles are copied from docs/spec/reference/*.html.

import { formatSlipDate } from './sundays.js';

const INK = '#111111';
const MUTED = '#4A4A4A';
const GENERIC_HINT = 'They can share a story from the scriptures, something from their own life, and what they believe.';

const escapeHtml = (text) => String(text)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const isBlank = (text) => !text || !String(text).trim();

const line = (height) =>
  `<span style="display: block; flex: 1; min-width: 0; height: ${height}px; border-bottom: 1.5px solid ${INK}"></span>`;

const SCISSORS = `<div style="position: absolute; top: -12px; left: 40px; background: #ffffff; padding: 0 6px; color: #555555; display: flex"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M20 4 8.12 15.88"></path><path d="M14.47 14.48 20 20"></path><path d="M8.12 8.12 12 12"></path></svg></div>`;

const invitationRow = (name) => `<div style="display: flex; align-items: flex-end; gap: 12px; height: 30px">
<span style="font-size: 22px; font-weight: 700; white-space: nowrap">An invitation for</span>
${isBlank(name) ? line(30) : `<span style="display: block; flex: 1; min-width: 0; height: 30px; border-bottom: 1.5px solid ${INK}; font-size: 22px; line-height: 30px; white-space: nowrap; overflow: hidden">${escapeHtml(name)}</span>`}
<span style="font-size: 14px; color: ${MUTED}; white-space: nowrap; margin-left: 12px">From the Primary presidency</span>
</div>`;

const dateLine = (sunday, size) => (sunday
  ? `<span style="font-size: ${size}px; font-weight: 700; line-height: 1.05; letter-spacing: -0.01em; white-space: nowrap">${formatSlipDate(sunday)}</span>`
  : `<span style="display: flex; align-items: flex-end; gap: 12px; font-size: ${size}px; font-weight: 700; line-height: 1.05; white-space: nowrap">Sunday <span style="display: block; width: 320px; flex: none; height: ${size}px; border-bottom: 1.5px solid ${INK}"></span></span>`);

const LEAD_IN = '<span style="font-size: 20px; line-height: 1.2">In Primary opening exercises, your child is invited to:</span>';

const task = (text, size) =>
  `<span style="font-size: ${size}px; font-weight: 700; line-height: 1.1; letter-spacing: -0.01em; margin-top: 4px">${text}</span>`;

const replyRow = (phone) => `<div style="margin-top: auto; display: flex; align-items: flex-end; gap: 10px; height: 26px">
<span style="font-size: 16px; font-weight: 700; white-space: nowrap">Can’t do it, or have a question? Text or call:</span>
${isBlank(phone) ? line(26) : `<span style="font-size: 18px; font-weight: 700; white-space: nowrap">${escapeHtml(phone)}</span>`}
</div>`;

const lessonLabelSpan = (label) => (isBlank(label) ? ''
  : `\n<span style="margin-left: auto; font-size: 13px; color: ${MUTED}; white-space: nowrap">${escapeHtml(label)}</span>`);

const scriptureDetails = ({ scriptureRef, scriptureText, lessonLabel }, verseSize) => {
  const blankRef = isBlank(scriptureRef);
  const blankText = isBlank(scriptureText);
  const refRow = blankRef
    ? `<div style="display: flex; align-items: flex-end; gap: 10px; height: 28px">
<span style="font-size: 16px; font-weight: 700; white-space: nowrap">Please help them practise reading:</span>
${line(28)}${lessonLabelSpan(lessonLabel)}
</div>`
    : `<div style="display: flex; align-items: baseline; gap: 10px">
<span style="font-size: 16px; font-weight: 700">Please help them practise reading:</span>
<span style="font-size: 20px; font-weight: 700">${escapeHtml(scriptureRef)}</span>${lessonLabelSpan(lessonLabel)}
</div>`;
  const textRow = blankText
    ? `<div style="display: flex; height: 30px">${line(30)}</div>`
    : `<p style="margin: 0; font-size: ${verseSize}px; line-height: 1.4; text-wrap: pretty">${escapeHtml(scriptureText)}</p>`;
  const gap = blankRef && blankText ? 6 : 4;
  return `<div style="display: flex; flex-direction: column; gap: ${gap}px">
${refRow}
${textRow}
</div>`;
};

const talkDetails = ({ talkTopic, talkHint }) => {
  const hint = isBlank(talkHint) ? GENERIC_HINT : talkHint;
  const hintRow = `<p style="margin: 0; font-size: 16px; line-height: 1.4">${escapeHtml(hint)}</p>`;
  return isBlank(talkTopic)
    ? `<div style="display: flex; flex-direction: column; gap: 6px">
<div style="display: flex; align-items: flex-end; gap: 10px; height: 28px">
<span style="font-size: 18px; font-weight: 700; white-space: nowrap">Topic idea:</span>
${line(28)}
</div>
${hintRow}
</div>`
    : `<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0; font-size: 18px; line-height: 1.35"><span style="font-weight: 700">Topic idea:</span> ${escapeHtml(talkTopic)}</p>
${hintRow}
</div>`;
};

const slip = ({ padding, border, name, sunday, dateSize, taskText, taskSize, details, phone }) =>
  `<section style="height: ${padding.height}px; box-sizing: border-box; padding: ${padding.css}; display: flex; flex-direction: column; gap: 8px; position: relative${border ? '; border-top: 1.5px dashed #6E6E6E' : ''}">
${border ? SCISSORS : ''}
${invitationRow(name)}
${dateLine(sunday, dateSize)}
${LEAD_IN}
${task(taskText, taskSize)}
${details}
${replyRow(phone)}
</section>`;

// options.verseSize: font size in px for the verse text (16 by default).
export const renderPage = (form, { verseSize = 16 } = {}) => {
  const shared = { sunday: form.sunday, phone: form.phone };
  return `<div style="width: 794px; height: 1123px; box-sizing: border-box; background: #ffffff; font-family: 'Atkinson Hyperlegible', Verdana, sans-serif; color: ${INK}; display: flex; flex-direction: column">
${slip({ ...shared, padding: { height: 374, css: '40px 48px 26px' }, border: false, name: form.prayerName,
    dateSize: 68, taskText: 'Say the opening prayer', taskSize: 56, details: '' })}
${slip({ ...shared, padding: { height: 375, css: '28px 48px 26px' }, border: true, name: form.scriptureName,
    dateSize: 52, taskText: 'Read a scripture aloud', taskSize: 44, details: scriptureDetails(form, verseSize) })}
${slip({ ...shared, padding: { height: 374, css: '28px 48px 40px' }, border: true, name: form.talkName,
    dateSize: 52, taskText: 'Give a short talk', taskSize: 44, details: talkDetails(form) })}
</div>`;
};
