// Chapter 3 — Modern JavaScript for React Native · diagram 01
// New picture: this slide had no chart before. The four bullets state a closed set
// and its complement, and the cost of the misconception ("empty means false") is that
// students cannot see where the empty array and the empty object land. Two panels are
// exactly the slide's own two bullets: bullet 1 lists the falsy values, bullet 2 says
// every other value is truthy "including the empty array [] and the empty object {}".
//
// "false, 0" and "null, undefined" are grouped because beforeAfter allows five rows per
// panel and the slide lists six values; both pairs are adjacent in the slide's own list
// and both are whole values, not paraphrases. Every label below is a verbatim fragment
// of the slide (the build's provenance report confirms all of them).
//
// `mono: false` on both panels is deliberate. The right panel holds three items with `[]`
// or `{}`, which trips the kit's half-or-more autodetect and renders that panel monospace
// while the left one stays sans — one picture, two typefaces. These are names of value
// kinds, not statements of code, so both panels are set to sans explicitly.
//
// Honest limit: the two panels are a partition, not two viewpoints, so the numbered rows
// are not pairs. The meaningful correspondence is at the top (these values / every other
// value) and in the two "empty" rows; the alt text says so.
export default {
  id: '01',
  slide: 'Falsy and Truthy',
  pattern: 'beforeAfter',
  alt:
    'A partition, not paired rows: the falsy panel lists the whole falsy set (false, 0, ' +
    'the empty string, null, undefined, NaN); the truthy panel says every other value is ' +
    'truthy, including the empty array and the empty object, so if ([]) always takes the ' +
    'true branch.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'FALSY',
      tone: 'red',
      mono: false,
      items: ['false, 0', "''", 'null, undefined', 'NaN'],
    },
    right: {
      title: 'TRUTHY',
      tone: 'green',
      mono: false,
      items: [
        'every other value',
        'the empty array []',
        'the empty object {}',
        'if ([]) always takes the true branch',
      ],
    },
  },
}
