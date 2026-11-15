// Shared helpers: render a case of the slip page and diff it with an approved PNG.
import { readFileSync } from 'node:fs';

export const CASES = [
  { name: '01-dated-15-november', reference: 'dated-15-november', sunday: '2026-11-15' },
  { name: '02-dated-22-november', reference: 'dated-22-november', sunday: '2026-11-22' },
  { name: '03-blank-write-in', reference: 'blank-write-in', sunday: 'none', clear: true },
];

// Screenshot of the approved reference HTML for one case, in this browser.
export const shootReference = async (page, c) => {
  await page.goto(new URL(`../../../docs/spec/reference/${c.reference}.html`, import.meta.url).href);
  await page.evaluate(() => document.fonts.ready);
  return page.locator('body > div').screenshot();
};

const LESSON_INPUTS = ['scriptureRef', 'scriptureText', 'lessonLabel', 'talkTopic', 'talkHint'];

// Screenshot of the slip page at full size for one case.
export const shootCase = async (page, c, path) => {
  await page.addStyleTag({ content: '.page{transform:none!important;box-shadow:none!important}.preview-frame{height:auto!important}' });
  await page.selectOption('#sunday', c.sunday);
  if (c.clear) for (const id of LESSON_INPUTS) await page.fill(`#${id}`, '');
  return page.locator('#page').screenshot(path ? { path } : {});
};

// Percentage of pixels that differ clearly (anti-aliasing is ignored).
// `approved` is a PNG buffer or a path to one.
export const percentDifferent = async (browser, shot, approved) => {
  const page = await browser.newPage();
  const toUrl = (buf) => `data:image/png;base64,${buf.toString('base64')}`;
  const result = await page.evaluate(async ([a, b]) => {
    const load = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = src; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    if (ia.width !== ib.width || ia.height !== ib.height) return 100;
    const px = (img) => { const c = new OffscreenCanvas(img.width, img.height); const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, img.width, img.height).data; };
    const da = px(ia); const db = px(ib); let diff = 0;
    for (let i = 0; i < da.length; i += 4) if (Math.abs(da[i] - db[i]) > 64) diff += 1;
    return (100 * diff) / (da.length / 4);
  }, [toUrl(shot), toUrl(Buffer.isBuffer(approved) ? approved : readFileSync(approved))]);
  await page.close();
  return result;
};
