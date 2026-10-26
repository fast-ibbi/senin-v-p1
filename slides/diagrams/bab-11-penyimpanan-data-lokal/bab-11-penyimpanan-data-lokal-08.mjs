// Chapter 11 — Local Data Storage · diagram 08
// New picture. The slide's first two bullets are one cause and one effect: "JSON.parse
// throws a SyntaxError if the text is not valid JSON" and "Without handling, the app
// crashes the moment it is opened — the user cannot get in". Cause → mechanism → outcome,
// in that order, so the pattern is flow.
//
// The chain stops at the crash on purpose: this slide is the argument for the guard, and
// the guard itself (try/catch, `return []`, `Array.isArray`) is the picture on the previous
// slide. The alt text says so, so a screen-reader user is not left with a dead end.
//
// The last chip is red rather than the pattern's default accent: the slide's whole point is
// that this outcome is the unacceptable one, and the principle underneath the bullets —
// "local storage is a source that cannot always be trusted" — is the remedy for it.
//
// The second arrow reads "not handled" instead of the slide's "Without handling": the lane
// between two chips is 106px wide at 14px, and the slide's phrase measures 105px by the
// kit's estimator, so it passed the check and then overran the chips by ~10px in the
// browser. Two words fit on one line and clear both borders.
//
// No bullet moved. The picture restates bullets 1 and 2, but "Sources of damage" and
// "deleted when the app is uninstalled or cleared" are facts the chain does not carry, so
// nothing here is duplicated enough to justify trimming.
//
// Provenance: "reads the stored text" is a plain-language gloss of the parse and "not
// handled" is the short form of "Without handling"; everything else — "throws", "the text
// is not valid JSON", "the user cannot get in" — is the slide's own wording.
export default {
  id: '08',
  slide: 'Data Rusak Tidak Boleh Membuat Aplikasi Crash',
  pattern: 'flow',
  alt:
    'The failure chain this slide warns about: JSON.parse reads the stored text, throws a ' +
    'SyntaxError when the text is not valid JSON, and if it is not handled the app crashes the ' +
    'moment it is opened, so the user cannot get in. The previous slide shows the guard that ' +
    'stops this chain.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'JSON.parse', note: 'reads the stored text' },
      { label: 'SyntaxError', note: 'the text is not valid JSON' },
      { label: 'The app crashes', note: 'the user cannot get in', tone: 'red' },
    ],
    edges: ['throws', 'not handled'],
  },
}
