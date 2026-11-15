# Primary opening exercise slips

A static, client-side website. A Primary leader picks a Sunday, checks a live
A4 preview, and prints 3 invitation slips (prayer, scripture, talk) per page.

The full brief is `docs/spec/SPEC.md`. The approved design is in
`docs/spec/screenshots/` and `docs/spec/reference/`. **Copy the design exactly.
Do not restyle it.**

## Commands

- `npm test`: unit tests (Node's built-in `node:test`, no browser).
- `npm run build`: bundle `src/` into `dist/` (static files, works from `file://`).
- `npm run test:integration`: build, then run the Playwright integration
  tests in `test/integration/` against `dist/index.html`.
- `npm run check`: unit + integration tests (about 4 seconds). The pre-commit
  hook and CI run this.
- `npm run screenshots`: write review screenshots to `test-results/screenshots/`.

## Hard rules

- Static and standalone. No server, no API calls, no analytics. The built
  site must work from `file://`, on GitHub Pages, and **offline**.
- Everything the page needs to work (code, styles, the slip font, lesson data)
  ships inside the site. Extras may load from the network (for example the CI
  status badge), but only if the page works fully when they fail to load, and
  they must never appear on the printed slip.
- Lesson data is hard-coded in `src/data/schedule.js`. Never invent a
  scripture, verse text or topic. If a field is not verified, set it to `null`.
- British English in all user-facing text ("practise", not "practice").
- Only `#111111`, `#4A4A4A`, `#6E6E6E`, `#555555` and white on the slip.

## Text fit (replaces SPEC section 4, "Text fit")

When everything fits, the slips are the approved 374 / 375 / 374 px. If a
slip's content is too tall:

1. The slip grows into the other slips' spare room (shared in proportion to
   each slip's spare room; the page stays 1123 px).
2. Only if that is not enough does the verse shrink, 16 → 15 → 14 px.
3. Only then does a warning appear in the form, next to the scripture or talk
   fields. Never on the slip.

A slip fits if its content uses at most 4 px of its bottom padding
(`PADDING_GRACE`; the approved 22 November page uses 3.2 px).

## UX: make errors impossible

Follow Nielsen Norman Group (NN/g) guidance, above all heuristic #5, **error
prevention**: design so the user cannot get into an error state, instead of
showing an error after the fact. Keep the UI as simple as the task: pick a
Sunday, fill in the details, print.

- **Constrain inputs.** Offer only valid choices. Example: the date is a
  `<select>` that lists only Sundays, so a non-Sunday cannot be picked. No
  free-text dates, no date pickers that allow other days.
- **Good defaults.** Pre-select the most likely value (the next Sunday that has
  lesson data) so most users change nothing.
- **Accept, do not reject.** Every field is optional. An empty field prints as
  a write-in line, so there is no "required field" error.
- **Recognition over recall.** Visible `<label>` on every input (never a
  placeholder as the only label). Show a short hint where a choice is not
  obvious.
- **Show the result live.** The preview updates on every keystroke, so the
  user sees what will print before they print.
- **No extra features.** No saved state, no undo, no accounts, no multi-page,
  until someone asks. Fewer controls means fewer ways to go wrong.
- If an error state cannot be designed away (for example a verse too long for
  the slip), say what to do in one plain sentence next to the field.

## Code style: functional programming

Write a functional core with a thin imperative shell.

1. **Pure functions wherever possible.** A pure function:
   - returns a value that depends only on its arguments;
   - does not read or change anything outside itself (no DOM, no
     `localStorage`, no `Date.now()`, no `Math.random()`, no globals);
   - does not mutate its arguments. Return new objects and arrays.
2. **Isolate side effects.** If code must touch the outside world (DOM,
   storage, clock, `window.print`, font loading, layout measurement), put each
   effect in **one small function** whose only job is that effect. Keep logic
   out of it. Pass the effect in as an argument (dependency injection) so the
   logic that uses it stays pure and testable.
3. **Data in, data out.** Model app state as plain, serialisable objects.
   Change state only through a pure `update(state, action) → state` function.
   Render from state with pure functions that return HTML strings or view
   models. The shell applies the result to the DOM.
4. **Prefer** `const`, expressions, `map`/`filter`/`reduce`, and small named
   functions. **Avoid** classes, `let` that is reassigned, shared mutable
   state, and hidden coupling between modules.
5. **Escape all user text** before it goes into HTML.

Layout:

- `src/core/`: pure functions only. No imports from `src/shell/`.
  - `form.js`: the Form, its field list (`FIELDS`) and `update(form, action)`.
  - `sundays.js`: the Sunday choice (options + default) and date formatting.
  - `page.js`: page geometry and the Slip page renderer (HTML string).
- `src/shell/`: side effects only.
  - `view.js`: the view adapter. Shows what the core decided; reports input.
    No decisions in it.
  - `store.js`: the one place that holds changing state.
- `src/main.js`: wires view and store to the core. Keep it short.

## Testing: use the `/tdd` skill

Build every feature and fix test-first with the `tdd` skill in
`.claude/skills/tdd/` (red → green, one vertical slice at a time).

- Test pure core functions directly, through their public exports.
- Test each side-effect function with an injected fake (for example a fake
  `Storage` object), never by mocking our own modules.
- Integration tests use the Playwright test runner (`playwright.config.js`).
  One `*.spec.js` file per feature in `test/integration/`. Use the `app`
  fixture in `test/integration/support/fixtures.js`: it opens the built site
  with "today" fixed and the network blocked, and has plain-language actions
  (`chooseSunday`, `fill`, `slipTexts`, …). Add an action there rather than
  repeating selectors in tests.
- Visual tests: at 794×1123, device scale factor 1.5, our page must render
  like the approved reference HTML (`docs/spec/reference/`) drawn by the same
  browser (under 0.01% of pixels may differ). This avoids false failures from
  font rasterising on other machines. Check the approved PNGs
  (`docs/spec/screenshots/`) with `npm run screenshots`. Never overwrite the
  approved files. The fit test renders every `SCHEDULE`
  entry and fails if any slip overflows.
- Expected values come from the spec or the reference HTML, not from
  re-running the code's own logic.

## Git: trunk-based development

- Commit straight to `main` and push. No long-lived branches, no pull
  requests unless someone asks for one.
- Keep each commit small and green. The pre-commit hook (`.githooks/`,
  turned on by `npm install`) runs `npm run check` and blocks a failing
  commit. Do not use `--no-verify`.
- CI (`.github/workflows/ci.yml`) runs `npm run check` on every push and pull
  request. On `main`, the deploy job publishes to GitHub Pages only if the
  tests pass. On failure, CI uploads the Playwright report as an artifact.

## Keep the tests fast

The full check must stay under about 10 seconds, so it can run on every
commit.

- Put logic in the pure core and test it with unit tests (milliseconds).
- Use Playwright only for what needs a real browser: layout, fit, print,
  offline. Share one browser per test file; open a fresh context per test.
- No sleeps or fixed waits in tests. Wait on a real condition.

## Skills

Matt Pocock's skills (MIT) are installed in `.claude/skills/`. See
`.claude/skills/LICENSE-mattpocock-skills`.
