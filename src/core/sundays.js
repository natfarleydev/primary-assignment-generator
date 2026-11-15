// Pure date helpers. Dates are ISO strings ("2026-11-15") and are read as UTC,
// so the result never depends on the machine's time zone.

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_MS = 86400000;
const LABEL_PREFIX = 'Come, Follow Me: ';

const toUtc = (iso) => new Date(`${iso}T00:00:00Z`);
const toIso = (date) => date.toISOString().slice(0, 10);
const addDays = (iso, days) => toIso(new Date(toUtc(iso).getTime() + days * DAY_MS));

export const formatSlipDate = (iso) => {
  const d = toUtc(iso);
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
};

const sundayOnOrAfter = (iso) => addDays(iso, (7 - toUtc(iso).getUTCDay()) % 7);

export const defaultSunday = (todayIso, schedule) =>
  Object.keys(schedule).sort().find((iso) => iso >= todayIso) ?? null;

const optionLabel = (iso, lesson) => {
  const date = `${formatSlipDate(iso)} ${iso.slice(0, 4)}`;
  return lesson?.lessonLabel ? `${date}: ${lesson.lessonLabel.replace(LABEL_PREFIX, '')}` : date;
};

// "No date", then `count` Sundays from today on. Only Sundays can be chosen.
export const sundayOptions = (todayIso, schedule, count) => {
  const first = sundayOnOrAfter(todayIso);
  const sundays = Array.from({ length: count }, (_, i) => addDays(first, i * 7));
  return [
    { value: 'none', label: 'No date: write it in by hand' },
    ...sundays.map((iso) => ({ value: iso, label: optionLabel(iso, schedule[iso]) })),
  ];
};
