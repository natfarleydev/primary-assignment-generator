# Glossary

Domain words used in code, tests and reviews. Use these names.

- **Slip**: one of the 3 invitations on a page: prayer, scripture, talk.
- **Slip page**: one A4 page of 3 slips. The module `src/core/page.js`
  renders it and lays it out so every slip fits (`layoutPage`).
- **Form**: what the leader has chosen and typed. A plain object, changed
  only by `update(form, action)` in `src/core/form.js`.
- **Sunday choice**: the Sundays the leader can pick and the one picked first
  (`sundayChoice` in `src/core/sundays.js`). Only Sundays can be chosen.
- **Write-in line**: the line printed in place of an empty field, for the
  leader to fill in by hand.
- **Padding grace**: how much of a slip's bottom padding its content may use
  and still count as fitting (4 px).
- **Site harness**: the test helper that opens the built site the way a
  leader would (`test/integration/support/site.js`).
