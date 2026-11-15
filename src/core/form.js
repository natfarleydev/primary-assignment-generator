// The form is a plain object. These functions return a new form; they never
// change the one they are given.

export const LESSON_FIELDS = ['scriptureRef', 'scriptureText', 'lessonLabel', 'talkTopic', 'talkHint'];

export const emptyForm = () => ({
  sunday: null,
  scriptureRef: '',
  scriptureText: '',
  lessonLabel: '',
  talkTopic: '',
  talkHint: '',
  phone: '',
  prayerName: '',
  scriptureName: '',
  talkName: '',
});

const lessonFieldsFrom = (lesson) =>
  Object.fromEntries(LESSON_FIELDS.map((key) => [key, lesson[key] ?? '']));

// `value` is a dropdown value: "none" or an ISO Sunday.
export const chooseSunday = (form, value, schedule) => {
  const sunday = value === 'none' ? null : value;
  const lesson = sunday && schedule[sunday];
  return lesson
    ? { ...form, sunday, ...lessonFieldsFrom(lesson) }
    : { ...form, sunday };
};
