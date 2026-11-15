// Form: what the leader has chosen and typed. A plain object, changed only
// by `update`, which returns a new form and never changes the one it is given.

export const LESSON_FIELDS = ['scriptureRef', 'scriptureText', 'lessonLabel', 'talkTopic', 'talkHint'];
const PERSONAL_FIELDS = ['phone', 'prayerName', 'scriptureName', 'talkName'];

// Every text field, in form order. Each has an input with the same id.
export const FIELDS = [...LESSON_FIELDS, ...PERSONAL_FIELDS];

export const emptyForm = () => ({
  sunday: null,
  ...Object.fromEntries(FIELDS.map((field) => [field, ''])),
});

const lessonFieldsFrom = (lesson) =>
  Object.fromEntries(LESSON_FIELDS.map((field) => [field, lesson[field] ?? '']));

// Actions:
//   { type: 'sundayChosen', sunday: iso | null }  fills lesson fields if the
//     Sunday has data; keeps the phone number and names.
//   { type: 'fieldTyped', field, text }           typed text always wins.
export const update = (form, action, schedule) => {
  switch (action.type) {
    case 'sundayChosen': {
      const lesson = action.sunday && schedule[action.sunday];
      return { ...form, sunday: action.sunday, ...(lesson ? lessonFieldsFrom(lesson) : {}) };
    }
    case 'fieldTyped':
      return FIELDS.includes(action.field) ? { ...form, [action.field]: action.text } : form;
    default:
      return form;
  }
};
