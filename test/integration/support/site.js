// Site harness: open the built site the way a leader would, with "today"
// fixed and the network blocked. Used by the Playwright fixture and by
// scripts/screenshots.js, so both see the site the same way.
import { pathToFileURL } from 'node:url';

export const SITE = pathToFileURL(new URL('../../../dist/index.html', import.meta.url).pathname).href;
export const DEFAULT_TODAY = '2026-11-10T12:00:00';

const isLocal = (url) => url.startsWith('file:') || url.startsWith('data:');

// Each slip index whose content uses more than 4px of the slip's bottom
// padding, or pokes into its right padding. 4px: the approved 22 November
// page uses 3.2px. Measured from element boxes, independently of the app.
const BOTTOM_GRACE = 4;
const overflowingSlips = (page) => page.$$eval('#page section', (slips, grace) => slips
  .map((slip, i) => {
    const box = slip.getBoundingClientRect();
    const style = getComputedStyle(slip);
    const bottom = box.bottom - parseFloat(style.paddingBottom);
    const right = box.right - parseFloat(style.paddingRight);
    const outside = [...slip.querySelectorAll('*')].some((el) => {
      const r = el.getBoundingClientRect();
      return r.height > 0 && (r.bottom > bottom + grace || r.right > right + 0.5);
    });
    return outside ? i : -1;
  })
  .filter((i) => i >= 0), BOTTOM_GRACE);

export const openSite = async (page, { today = DEFAULT_TODAY } = {}) => {
  const requests = [];
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (isLocal(url)) return route.continue();
    requests.push(url);
    return route.abort();
  });
  await page.clock.setFixedTime(new Date(today));
  await page.goto(SITE);
  await page.evaluate(() => document.fonts.ready);
  return {
    page,
    requests,
    chooseSunday: (value) => page.selectOption('#sunday', value),
    fill: (field, text) => page.fill(`#${field}`, text),
    value: (field) => page.inputValue(`#${field}`),
    sundayValues: () => page.$$eval('#sunday option', (os) => os.map((o) => o.value)),
    slipTexts: () => page.$$eval('#page section', (s) => s.map((x) => x.textContent)),
    slipHeights: () => page.$$eval('#page section', (s) => s.map((x) => x.getBoundingClientRect().height)),
    pageText: () => page.textContent('#page'),
    overflowingSlips: () => overflowingSlips(page),
    warning: (id) => page.textContent(`#${id}`),
  };
};
