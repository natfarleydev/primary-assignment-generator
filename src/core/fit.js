// Text-fit rule (SPEC 4, "Text fit"). `overflowsAt(px)` is the one side
// effect: the shell renders at that size and measures. The rule stays pure.

const SIZES = [16, 15, 14];

export const fitVerse = (overflowsAt) => {
  const verseSize = SIZES.find((px) => !overflowsAt(px));
  return verseSize ? { verseSize, tooLong: false } : { verseSize: 14, tooLong: true };
};
