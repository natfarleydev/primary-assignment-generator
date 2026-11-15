# Build spec: Primary opening exercise slips website

> **For Claude Code.** Read this whole file first. Then look at every image in `screenshots/` and open each file in `reference/`. Build the site in this folder's parent repo, or in a new folder if there is no repo. Ask the user only if a rule here contradicts itself.

## 1. What this is

Primary leaders in The Church of Jesus Christ of Latter-day Saints print small slips of paper. A slip goes home with a child, and it asks the parent to help the child take part in **Primary opening exercises** on a set Sunday.

There are 3 slips on each A4 page:

1. **Say the opening prayer**
2. **Read a scripture aloud**, with the reference and the verse text
3. **Give a short talk**, with a topic idea

You are building a **static, client-side website**. The leader picks a Sunday (or types the details by hand), checks the preview and prints the page or saves it as a PDF.

The design is already approved. **Copy it exactly.** Do not restyle it. The screenshots and reference HTML are the source of truth.

## 2. Hard constraints

- **Static only.** No server, no database, no login, no API calls, no analytics, no runtime AI. It must work when opened from `file://`. It must also work on GitHub Pages.
- **No network at runtime.** Self-host the font from `fonts/`. Do not use Google Fonts or any CDN.
- **All lesson data is hard-coded** in a data file in the repo (see section 5). The page never looks up scriptures.
- **Plain HTML, CSS and JavaScript** is preferred. A small build step (for example Vite) is fine if it makes things simpler, but the built output must be static files.
- **British English** in all user-facing text (for example "practise", not "practice").
- **Printing:** A4 portrait, 0 margins, backgrounds on. 1 page = 3 slips. The output must match `reference/approved-output.pdf`.

## 3. Reference files in this folder

| File | What it is |
|---|---|
| `screenshots/01-dated-15-november.png` | Approved page with a date chosen (Sunday 15 November 2026) |
| `screenshots/02-dated-22-november.png` | Approved page with a date chosen (Sunday 22 November 2026). It has the longest verse so far, so use it to test text fit. |
| `screenshots/03-blank-write-in.png` | Approved page with no date: the fields are write-in lines |
| `reference/*.html` | The exact markup and inline styles for those 3 pages. The page box is 794×1123 CSS px (A4 at 96 dpi). Lift the styles from here. |
| `reference/approved-output.pdf` | The approved printed result |
| `fonts/*.woff2` | Atkinson Hyperlegible 400 and 700 (SIL Open Font Licence). Use these files. |

## 4. The slip: exact layout

Each page is 794×1123 px and holds 3 `<section>` slips stacked top to bottom, with heights **374 / 375 / 374 px**.

- Horizontal padding: 48px. Vertical padding: top slip 40px top and 26px bottom; middle slip 28px / 26px; bottom slip 28px top and 40px bottom.
- Slips 2 and 3 have `border-top: 1.5px dashed #6E6E6E`, with a 22px scissors icon (inline SVG) sitting on the line, 40px from the left edge, on a white backing.
- Font: `'Atkinson Hyperlegible', Verdana, sans-serif`. Text colour `#111111`. Muted text `#4A4A4A`. No other colours. It must read well printed in black and white.
- Each slip is a column with `gap: 8px`.

From top to bottom, each slip has:

1. **Invitation row** (30px high, flex, aligned to the bottom). "An invitation for" (22px, bold), then a write-in line (`flex: 1`, 1.5px solid bottom border), then "From the Primary presidency" (14px, muted) on the right.
2. **Date**, bold, line-height 1.05, letter-spacing −0.01em, never wraps. **52px** on slips 2 and 3, **68px** on the prayer slip. Format: `Sunday 15 November` (weekday, day number, full month, no year).
   - With no date, show "Sunday" followed by a 320px write-in line, at the same size.
3. **Lead-in:** "In Primary opening exercises, your child is invited to:" (20px, regular).
4. **Task**, bold, line-height 1.1, letter-spacing −0.01em, 4px top margin. **44px** on slips 2 and 3, **56px** on the prayer slip. The text is exactly:
   - "Say the opening prayer"
   - "Read a scripture aloud"
   - "Give a short talk"
5. **Details**: scripture and talk slips only. The prayer slip has none.
   - **Scripture, filled in:** one row with "Please help them practise reading:" (16px, bold), the reference (20px, bold), and the lesson label right-aligned (13px, muted), for example "Come, Follow Me: Daniel 1–7". Under it, the verse text (16px, line-height 1.4).
   - **Scripture, blank:** "Please help them practise reading:" followed by a write-in line, then one more full-width write-in line.
   - **Talk, filled in:** "**Topic idea:** {topic}" (18px), then the hint line (16px), for example "They can share a story from Daniel 1–7, something from their own life, and what they believe."
   - **Talk, blank:** "**Topic idea:**" followed by a write-in line. Then the generic hint: "They can share a story from the scriptures, something from their own life, and what they believe."
6. **Reply row**, pushed to the bottom (`margin-top: auto`, 26px high). "Can’t do it, or have a question? Text or call:" (16px, bold), then a write-in line. If the user typed a phone number, print the number in place of the line (18px, bold).

Use the curly apostrophe (’) in "Can’t".

**Design rules. Do not break these, because each one was a deliberate change after review:**

- **The date comes first and is the loudest text.** Parents may see the slip for a second, from about 1 metre away. A parent says no because they are away that Sunday, not because of the task.
- Each slip must read clearly as an **invitation**: "An invitation for … / date / … your child is invited to: / task".
- **No borders, boxes, tinted panels, icons (apart from the scissors), emoji or decorative colour.** No casual or handwritten fonts.
- **No prayer advice** on the prayer slip.
- Do not add any information beyond what is listed here.

### Text fit

The longest verse (Joel 2:28–29, about 290 characters) fits at 16px. If a slip's content is taller than the slip:

1. Reduce the verse text from 16px in 1px steps, down to 14px at the smallest.
2. If it still does not fit, keep 14px and show a warning in the form (not on the slip): "This verse is too long to fit. Please choose a shorter passage."

Check this with `scrollHeight > clientHeight` on each slip after fonts load (`document.fonts.ready`).

## 5. Data: hard-coded lesson schedule

Put the data in `data/schedule.js` (or `.json`), keyed by the **Sunday's date** in ISO form. A Come, Follow Me week runs Monday to Sunday. The key is the Sunday that ends the week.

```js
// data/schedule.js
export const SCHEDULE = {
  "2026-11-15": {
    weekLabel: "November 9–15",
    lessonTitle: "There Is No Other God That Can Deliver",
    lessonLabel: "Come, Follow Me: Daniel 1–7",
    scriptureRef: "Daniel 1:17",
    scriptureText: "As for these four children, God gave them knowledge and skill in all learning and wisdom: and Daniel had understanding in all visions and dreams.",
    talkTopic: "God will bless me as I choose to follow Jesus Christ",
    talkHint: "They can share a story from Daniel 1–7, something from their own life, and what they believe.",
    source: "https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/46?lang=eng"
  },
  "2026-11-22": {
    weekLabel: "November 16–22",
    lessonTitle: "I Will Love Them Freely",
    lessonLabel: "Come, Follow Me: Hosea; Joel",
    scriptureRef: "Joel 2:28–29",
    scriptureText: "And it shall come to pass afterward, that I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy, your old men shall dream dreams, your young men shall see visions: and also upon the servants and upon the handmaids in those days will I pour out my spirit.",
    talkTopic: "The Holy Ghost can guide me",
    talkHint: "They can share a story from the scriptures, a time the Holy Ghost helped them, and what they believe.",
    source: "https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/47?lang=eng"
  }
  // …more weeks: see 5.2
};
```

The 2 entries above are **verified and approved**. Use them as they are.

### 5.1 How each field was chosen (apply the same rules to new weeks)

- **lessonLabel**: "Come, Follow Me: " plus the week's reading block, shortened if it is long (for example "Hosea 1–6; 10–14; Joel" becomes "Hosea; Joel").
- **scriptureRef / scriptureText**: from the lesson page's **"Ideas for Teaching Children"** section, pick 1 or 2 verses that it references. Prefer a passage a child can read aloud: under about 300 characters, ending at the end of a sentence (or at a colon or semicolon that reads as an ending). For Bible verses, use the **King James Version** text exactly, except that you may lower-case the first letter of a joined second verse.
- **talkTopic**: the title of that week's **"Primary activity page"**, word for word (it is named on the lesson page).
- **talkHint**: "They can share a story from {reading or 'the scriptures'}, {something from their own life | a short tie-in to the topic}, and what they believe."
- **source**: the lesson page URL.

### 5.2 Weeks still to fill in (2026)

The reading blocks below are from the official 2026 schedule. **Research the remaining fields** from each lesson page using 5.1. The URL pattern is `https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/{N}?lang=eng`, where week 46 = Nov 9–15 and week 47 = Nov 16–22. Count on from there, but **check every page's title** before you trust the number.

| Sunday | Week | Reading |
|---|---|---|
| 2026-11-29 | Nov 23–29 | Amos; Obadiah; Jonah |
| 2026-12-06 | Nov 30–Dec 6 | Micah; Nahum; Habakkuk; Zephaniah |
| 2026-12-13 | Dec 7–13 | Haggai 1–2; Zechariah 1–4; 7–14 |
| 2026-12-20 | Dec 14–20 | Malachi |
| 2026-12-27 | Dec 21–27 | Christmas |

**2027 uses the New Testament.** Add 2027 weeks only if you can confirm the manual URL and the schedule from the official site. Do not guess the URLs.

**If you cannot fetch a page, or a field is unclear, set that field to `null`.** The UI then treats it as blank (a write-in line). **Never invent** a scripture, a verse text or a topic. In your final message, list every week and field you left `null`.

## 6. The app

### 6.1 Layout

- On a wide screen: a form panel on the left and a live, scaled-down preview of the A4 page on the right. On a phone: the form on top and the preview below.
- The form and the app's chrome are **screen only** (`@media print { … display: none }`). Only the slip page prints.

### 6.2 Form fields (in this order)

1. **Sunday**: a dropdown (`<select>`) of Sundays.
   - First option: "No date: write it in by hand".
   - Then every Sunday in `SCHEDULE`, labelled like "Sunday 15 November 2026: Daniel 1–7".
   - Then a "Pick another Sunday…" option that shows a native `<input type="date">`. If the chosen day is not a Sunday, snap to the next Sunday and say so in one line. A date with no data fills in the date only. The other fields stay as the user left them.
   - Default to the next Sunday on or after today that is in `SCHEDULE`. If there is none, default to "No date".
2. **Scripture reference**: text input.
3. **Scripture text**: textarea.
4. **Lesson label**: text input (small, optional).
5. **Talk topic**: text input.
6. **Talk hint**: text input.
7. **Phone number for replies**: text input (`type="tel"`). Optional. It is shared by all 3 slips.
8. **Child names**: 3 optional inputs, for prayer, scripture and talk. A name prints on the "An invitation for" line. With no name, the line stays blank.

### 6.3 Behaviour

- **Choosing a Sunday that has data** fills fields 2–6 from `SCHEDULE`. Do not clear the phone number or the names.
- **Typing in a field overrides it.** Typed text always wins over the data until the user picks a different Sunday. Before you overwrite edits, ask with a small inline note and an Undo button, not a dialog.
- **The user must type the scripture text themselves** if they enter a reference by hand. Do not try to look it up. Show this help text under the reference field: "Pick a Sunday to fill this in for you. If you type a reference, please also type the verse."
- **A field left empty** renders as a write-in line, as in `screenshots/03-blank-write-in.png`. Each field does this on its own, so a page can mix filled and blank parts.
- The preview updates on every keystroke.
- Save the form state in `localStorage` (wrapped in try/catch), and restore it on load.

### 6.4 Printing

- "Print or save as PDF" button calls `window.print()`.
- Print CSS: `@page { size: A4 portrait; margin: 0 }`. Print the page at full size (794×1123 px = 210×297 mm), with no scaling and with backgrounds on.
- Under the button: "In the print box, set Scale to 100% (Actual size) and Margins to None."
- Optional: "Add another week" makes a second page, so one print can hold several Sundays. Each page has its own Sunday and fields.

## 7. Accessibility and quality

- Every input has a visible `<label>`. The form works with the keyboard only.
- The form UI meets WCAG 2.1 AA contrast.
- No layout shift in the preview while the font loads: use `font-display: block` for the slip font.

## 8. Acceptance checks (do all of these before you finish)

1. Choosing **Sunday 15 November 2026** gives a page that matches `screenshots/01-dated-15-november.png` (the name and phone lines stay blank).
2. Choosing **Sunday 22 November 2026** matches `screenshots/02-dated-22-november.png`, and nothing overflows.
3. Choosing **"No date"** with all fields empty matches `screenshots/03-blank-write-in.png`.
4. Typing a phone number puts the number on all 3 slips.
5. Printing to PDF in Chrome at 100% scale and no margins gives a single A4 page with 3 slips, matching `reference/approved-output.pdf`.
6. The site works when opened from `file://` with the network turned off.
7. Every verse in `SCHEDULE` fits at 14px or more. Run a script that renders each entry in headless Chrome (Playwright) and fails if any slip overflows.

Use Playwright for checks 1–3 and 7: take screenshots at 794×1123, device scale factor 1.5, and compare them by eye with the images in `screenshots/`. Small anti-aliasing differences are fine. Layout differences are not.

## 9. Out of scope

- No accounts, sharing, email or SMS sending.
- No AI or scripture lookup at runtime.
- No other languages (English only for now).
- No colour themes.
