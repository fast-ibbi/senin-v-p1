// Chapter 3 — Modern JavaScript for React Native · diagram 09
// New picture: this slide had none. The slide is already built as two parallel blocks — the
// `.mjs` file you run, and the `package.json` line that is "the alternative if the file keeps
// the `.js` extension". Two answers to the same question is a `beforeAfter`: matched rows, two
// panels. It is not a chain (`flow` would put the two ways one after the other, and they are
// alternatives), and it is not a stack (`layers` would imply one contains the other).
//
// One row per panel plus a `footer`, not two rows. The slide carries two code blocks besides
// the picture (the run commands and the `package.json` literal) and the bullets must both stay,
// so a two-row panel (247px on the slide) cannot fit. Row answers "what do you write", footer
// answers "when is this the one to use". The tie is the third row, and it is hidden: the
// slide's own note says "use the .mjs extension because it is the quickest", which is why the
// left panel — this chapter's recommendation — carries the accent instead of the pattern's
// default red. Neither way is wrong.
//
// Trimmed to the picture, and therefore no longer on the slide: the `praktik-js/package.json`
// intro line and its three-line fence. The panel now says `"type": "module"` and where it goes;
// the literal itself is preserved verbatim in the presenter notes. The run commands stay: the
// heading is about running the module, and `node --check` is bullet 2's subject.
//
// Provenance misses, accepted and reported: "the extension in the file name" and "one line in
// package.json" are compositions of the slide's own two parts ("the `.js` extension",
// "`praktik-js/package.json`", `"type": "module"`), not new vocabulary — the slide never says
// the sentence in one piece, because it says it as two code blocks.
export default {
  id: '09',
  slide: 'Menjalankan Modul di Node.js Butuh Dua Langkah',
  pattern: 'beforeAfter',
  alt:
    'Two ways to make Node read the file as a module, not one after the other. Left: the .mjs ' +
    'extension in the file name — the quickest way. Right: the property "type": "module" in ' +
    'package.json — the alternative if the file keeps the .js extension. Without one of them, ' +
    'an import is rejected with a SyntaxError.',
  imgWidth: 1120,
  data: {
    canvas: [1160, 196],
    left: {
      title: '.mjs',
      tone: 'acc',
      items: ['the extension in the file name'],
      footer: 'the quickest',
    },
    right: {
      title: '"type": "module"',
      tone: 'neutral',
      items: ['one line in package.json'],
      footer: 'the alternative if the file keeps the .js extension',
    },
  },
}
