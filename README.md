# Primary opening exercise slips

[![CI](https://github.com/natfarleydev/primary-assignment-generator/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/natfarleydev/primary-assignment-generator/actions/workflows/ci.yml)

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
- `npm run test:integration`: build, then drive the built page in headless
  Chrome with Playwright (user flows, screenshots against
  `docs/spec/screenshots/`, verse fit, offline, PDF).
- `npm run check`: both. A pre-commit hook runs this; so does CI.
- `npm run screenshots`: write review screenshots to `test-results/screenshots/`.

Lesson data lives in `src/data/schedule.js`. See `CLAUDE.md` for the coding
rules and `docs/spec/SPEC.md` for the full brief.

The font is Atkinson Hyperlegible (SIL Open Font Licence).
