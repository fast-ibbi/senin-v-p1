// Chapter 3 — Modern JavaScript for React Native · diagram 05
// New picture: this slide had none. Its four bullets mix two different relationships —
// which keyword to reach for (bullets 2 and 3) and where a declaration lives (bullets 1
// and 4). Only the first is a pair of mental models, so the picture is exactly that pair:
// `const` is the keyword for a value filled once, `let` for one that really changes.
// The two panels are the slide's own bullets 2 and 3, verbatim, so those two bullets move
// into the presenter notes; bullets 1 (both are block scoped) and 4 (`var` is left behind,
// function scoped) stay on the slide because the picture does not show either fact.
//
// Left panel takes the accent on purpose: it is not "right vs wrong" (both keywords are
// correct), it is the habit this course wants — the slide's own notes ask "Why does React
// almost always use const?". The right panel therefore stays neutral instead of the
// pattern's default red, which would read as "let is a mistake".
//
// Row correspondence: row 1 answers "what is it for", row 2 answers "how do I read that in
// practice" (discipline versus a loop counter). It is not a criterion-by-criterion score
// card — that would be a table, and the deck already uses tables for those.
export default {
  id: '05',
  slide: 'React Hampir Selalu Memakai const, Ini Sebabnya',
  pattern: 'beforeAfter',
  alt:
    'Two mental models, matched row by row: const is for a value filled once and is ' +
    'discipline, not merely a writing style; let is for a value that really changes, for ' +
    'example a loop counter. Both are block scoped, and var is left behind as function scoped.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'CONST',
      tone: 'acc',
      items: ['a value filled once', 'it is discipline, not merely a writing style'],
    },
    right: {
      title: 'LET',
      tone: 'neutral',
      items: ['a value that really changes', 'for example a loop counter'],
    },
  },
}
