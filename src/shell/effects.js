// Side effects only. Each function does one thing to the outside world and
// holds no logic of its own. The pure core decides what to do.

export const todayIso = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const writeOptions = (select, options, selected) => {
  select.replaceChildren(...options.map(({ value, label }) => new Option(label, value, false, value === selected)));
};

export const writeFields = (formEl, form, names) => {
  names.forEach((name) => { formEl.elements[name].value = form[name]; });
};

export const readFields = (formEl, names) =>
  Object.fromEntries(names.map((name) => [name, formEl.elements[name].value]));

export const writeHtml = (el, html) => { el.innerHTML = html; };

export const writeText = (el, text) => { el.textContent = text; };

// True if any slip's content is taller than the slip.
export const slipsOverflow = (pageEl) =>
  [...pageEl.querySelectorAll('section')].some((s) => s.scrollHeight > s.clientHeight);

// Scale the A4 page to the frame's width (never larger than full size).
export const fitPreview = (frameEl, pageEl) => {
  const scale = Math.min(1, frameEl.clientWidth / 794);
  pageEl.style.transform = `scale(${scale})`;
  frameEl.style.height = `${1123 * scale}px`;
};

export const fontsReady = () => document.fonts.ready;

export const print = () => window.print();
