// Sunday choice: which Sundays the leader can pick, which one is picked
// first, and how a Sunday is written on the slip. Pure: dates are ISO
// strings ("2026-11-15") read as UTC, so results never depend on time zone.

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_MS = 86400000;
const LABEL_PREFIX = 'Come, Follow Me: ';
const NO_DATE = { value: null, label: 'No date: write it in by hand' };

const toUtc = (iso) => new Date(`${iso}T00:00:00Z`);
const toIso = (date) => date.toISOString().slice(0, 10);
const addDays = (iso, days) => toIso(new Date(toUtc(iso).getTime() + days * DAY_MS));
const pad = (n) => String(n).padStart(2, '0');

// { year, month (1–12), day } → "YYYY-MM-DD".
export const isoDate = ({ year, month, day }) => `${year}-${pad(month)}-${pad(day)}`;

export const formatSlipDate = (iso) => {
  const d = toUtc(iso);
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
};

const sundayOnOrAfter = (iso) => addDays(iso, (7 - toUtc(iso).getUTCDay()) % 7);

const optionLabel = (iso, lesson) => {
  const date = `${formatSlipDate(iso)} ${iso.slice(0, 4)}`;
  return lesson?.lessonLabel ? `${date}: ${lesson.lessonLabel.replace(LABEL_PREFIX, '')}` : date;
};

// The dropdown: "No date" (value null), then `count` Sundays from today on.
// `selected` is the first listed Sunday that has lesson data, else null, so
// the default is always one of the options.
export const sundayChoice = (todayIso, schedule, count) => {
  const first = sundayOnOrAfter(todayIso);
  const sundays = Array.from({ length: count }, (_, i) => addDays(first, i * 7));
  return {
    options: [NO_DATE, ...sundays.map((iso) => ({ value: iso, label: optionLabel(iso, schedule[iso]) }))],
    selected: sundays.find((iso) => schedule[iso]) ?? null,
  };
};
