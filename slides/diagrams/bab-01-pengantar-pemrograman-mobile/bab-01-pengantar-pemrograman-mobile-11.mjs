// Chapter 1 — Introduction to Mobile Programming · diagram 11
// Slide 20, "What React Native Is Not". No legacy chart.
//
// The slide is three statements: two misconceptions ("not a translator into Kotlin or
// Swift", "not a wrapper of web pages in a WebView") and the sentence that resolves them —
// "What is native is the interface it displays, not the JavaScript code". That sentence is
// a two-cell claim, so the picture is a one-row `beforeAfter`: which side of React Native
// is native. The two misconceptions stay on the slide as prose, which is where the heading
// points; the picture answers the question they leave open.
//
// Deliberately not used: `flow` or `layers` (code → interface → native) — diagram 04 draws
// that path as a tree and diagram 05 draws the runtime as a stack, both two slides earlier.
// A third picture of the same path on this slide would be decoration.
//
// One label is not a substring of the slide's text: "NOT NATIVE". The slide says the same
// thing in the opposite order ("the interface it displays, not the JavaScript code"), and a
// panel header has to name its side before the row is read. It is reported by the build
// rather than hidden, per the house rule.
//
// Trimmed: the third bullet ("What is native is the interface it displays, not the
// JavaScript code") moved verbatim into the notes — the picture's two cells are that
// sentence, split. The two "not" bullets stay on the slide; the picture does not restate
// them, so nothing is duplicated there.
export default {
  id: '11',
  slide: 'React Native Bukan Penerjemah Kode',
  pattern: 'beforeAfter',
  alt:
    'What is native in a React Native app: the interface it displays, not the JavaScript ' +
    'code that drives it.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'NOT NATIVE',
      tone: 'neutral',
      items: ['The JavaScript code'],
    },
    right: {
      title: 'NATIVE',
      tone: 'acc',
      items: ['The interface it displays'],
    },
  },
}
