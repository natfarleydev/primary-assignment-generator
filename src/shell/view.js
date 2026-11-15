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
  const measureHost = $('measure');
  const WARNING_IDS = { scripture: 'scripture-warning', talk: 'talk-warning' };

  return {
    // The dropdown shows "No date" (null in the core) as the value "none".
    showSundays: (options, selected) => sunday.replaceChildren(...options.map(({ value, label }) =>
      new Option(label, value ?? 'none', false, value === selected))),
    showFields: (values) => fields.forEach((field) => { form.elements[field].value = values[field]; }),
    showPage: (html) => { page.innerHTML = html; },
    showWarnings: (warnings) => Object.entries(WARNING_IDS).forEach(([slip, id]) => {
      $(id).textContent = warnings[slip];
    }),
    // For each slip: top of the slip to the end of its content, plus its
    // bottom padding. `html` renders the slips 0px tall, so every row is at
    // its smallest and the last row marks the end of the content.
    measure: (html) => {
      measureHost.innerHTML = html;
      return [...measureHost.querySelectorAll('section')].map((s) => {
        const top = s.getBoundingClientRect().top;
        const end = s.lastElementChild.getBoundingClientRect().bottom;
        return Math.ceil(end - top + parseFloat(getComputedStyle(s).paddingBottom));
      });
    },
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
