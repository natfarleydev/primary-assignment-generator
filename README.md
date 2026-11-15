# Primary opening exercise slips

Print invitation slips for Primary opening exercises: 3 slips per A4 page
(opening prayer, scripture, short talk).

## Use it

1. Run `npm install`, then `npm run build`.
2. Open `dist/index.html` in a browser. It works offline, from `file://`.
3. Pick a Sunday. Change any field if you want to. Empty fields print as
   write-in lines.
4. Click **Print or save as PDF**. In the print box, set Scale to 100% and
   Margins to None.

## Develop

- `npm test`: unit tests for the pure core (`src/core/`).
- `npm run test:e2e`: build, then check the built page in headless Chrome
  (screenshots against `docs/spec/screenshots/`, verse fit, offline, PDF).
- `npm run screenshots`: write review screenshots to `test/e2e/output/`.

Lesson data lives in `src/data/schedule.js`. See `CLAUDE.md` for the coding
rules and `docs/spec/SPEC.md` for the full brief.

The font is Atkinson Hyperlegible (SIL Open Font Licence).
