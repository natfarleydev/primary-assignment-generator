// Screenshot a case of the slip page or of the approved reference HTML, and
// count how many pixels differ between two PNG screenshots.

export const CASES = [
  { name: '01-dated-15-november', reference: 'dated-15-november', sunday: '2026-11-15' },
  { name: '02-dated-22-november', reference: 'dated-22-november', sunday: '2026-11-22' },
  { name: '03-blank-write-in', reference: 'blank-write-in', sunday: 'none', clear: true },
];

const LESSON_INPUTS = ['scriptureRef', 'scriptureText', 'lessonLabel', 'talkTopic', 'talkHint'];

// Full-size screenshot of our slip page for one case. `app` is an open site.
export const shootCase = async (app, c, path) => {
  await app.page.addStyleTag({ content: '.page{transform:none!important;box-shadow:none!important}.preview-frame{height:auto!important}' });
  await app.chooseSunday(c.sunday);
  if (c.clear) for (const id of LESSON_INPUTS) await app.fill(id, '');
  return app.page.locator('#page').screenshot(path ? { path } : {});
};

// Screenshot of the approved reference HTML for one case, on its own page.
export const shootReference = async (browser, c, deviceScaleFactor) => {
  const page = await browser.newPage({ deviceScaleFactor });
  await page.goto(new URL(`../../../docs/spec/reference/${c.reference}.html`, import.meta.url).href);
  await page.evaluate(() => document.fonts.ready);
  const shot = await page.locator('body > div').screenshot();
  await page.close();
  return shot;
};

// Percentage of pixels that differ clearly (anti-aliasing is ignored).
export const percentDifferent = async (browser, a, b) => {
  const page = await browser.newPage();
  const toUrl = (buf) => `data:image/png;base64,${buf.toString('base64')}`;
  const result = await page.evaluate(async ([srcA, srcB]) => {
    const load = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = src; });
    const [ia, ib] = await Promise.all([load(srcA), load(srcB)]);
    if (ia.width !== ib.width || ia.height !== ib.height) return 100;
    const px = (img) => { const c = new OffscreenCanvas(img.width, img.height); const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, img.width, img.height).data; };
    const da = px(ia); const db = px(ib); let diff = 0;
    for (let i = 0; i < da.length; i += 4) if (Math.abs(da[i] - db[i]) > 64) diff += 1;
    return (100 * diff) / (da.length / 4);
  }, [toUrl(a), toUrl(b)]);
  await page.close();
  return result;
};
