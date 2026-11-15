// View adapter: everything that touches the page. No decisions here; the
// pure core decides what to show, this module shows it and reports input.

// Today's date on this device, in local time.
export const today = () => {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
};

export const createView = (doc, fields) => {
  const $ = (id) => doc.getElementById(id);
  const form = $('form');
  const sunday = form.elements.sunday;
  const page = $('page');
  const frame = $('preview-frame');

  return {
    // The dropdown shows "No date" (null in the core) as the value "none".
    showSundays: (options, selected) => sunday.replaceChildren(...options.map(({ value, label }) =>
      new Option(label, value ?? 'none', false, value === selected))),
    showFields: (values) => fields.forEach((field) => { form.elements[field].value = values[field]; }),
    showPage: (html) => { page.innerHTML = html; },
    showWarning: (id, text) => { $(id).textContent = text; },
    // True if any slip on the shown page is taller than its box.
    slipsOverflow: () => [...page.querySelectorAll('section')].some((s) => s.scrollHeight > s.clientHeight),
    scalePreview: (scaleFor) => {
      const scale = scaleFor(frame.clientWidth);
      page.style.transform = `scale(${scale})`;
      frame.style.height = `${page.offsetHeight * scale}px`;
    },
    onResize: (handler) => new ResizeObserver(handler).observe(frame),
    onSundayChosen: (handler) => sunday.addEventListener('change', () =>
      handler(sunday.value === 'none' ? null : sunday.value)),
    onFieldTyped: (handler) => form.addEventListener('input', (e) => {
      if (fields.includes(e.target.name)) handler(e.target.name, e.target.value);
    }),
    onPrint: (handler) => $('print').addEventListener('click', handler),
    fontsReady: () => doc.fonts.ready,
  };
};
