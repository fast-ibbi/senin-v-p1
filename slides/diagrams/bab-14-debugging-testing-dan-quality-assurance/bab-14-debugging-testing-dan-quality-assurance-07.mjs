// Chapter 14 — Debugging, Testing, and QA · diagram 07
// New picture (this deck had no chart here). "Error 3 — undefined is not an object" has one
// cause and three defences, and the three defences sit at three different depths of one
// data path: the response shape that arrives, the state that holds it, the property read
// that renders it. That is a stack — each level rests on the one below — so the pattern is
// `layers`, and the array is written in dependency order rather than the slide's bullet
// order (initial value, optional operator, response). The reordering is the picture's whole
// contribution: it answers "where do I put the guard?" in one glance, which the bullet list
// does not.
//
// No bullet is deleted: the two bullets the picture states in full — the state's initial
// value with its loading indicator, and the API response form with its chapter — moved
// verbatim into this slide's presenter notes under "Trimmed to the picture (the diagram says
// this)". The two that stay carry what the picture does not say: the cause (reading a
// property of a value that does not exist yet) and the reason the optional operator works
// (access stays safe while the object is absent). With all four bullets the picture still
// fitted at 1120, but it pushed the blockquote down to 19px above the footer text — reading as
// content touching the slide edge. The trim buys the picture its space; squeezing the width
// instead would have taken the 15px notes under the 13px floor.
//
// `tone: 'acc'` on the middle band, not the top (which `layers` would accent by default):
// the presenter notes tie this error to Example 1, where the state starts as null and the
// screen shows "memuat…" — the pattern that prevents the crash. The other two bands are
// explicitly neutral so only the state glows.
//
// Labels are the slide's own verb phrases, shortened only by dropping the object that the
// right-hand note supplies; the notes carry the slide's own details (`mahasiswa?.nama`,
// `[] or null`, `{ data: [...] }`, Chapter 10).
export default {
  id: '07',
  slide: 'Error Ketiga: Properti Dibaca Sebelum Datanya Tiba',
  pattern: 'layers',
  alt:
    'Three levels of defence against "undefined is not an object", from the read down to the ' +
    'source: the optional operator makes access safe while the object is absent, the state ' +
    'starts as an empty array or null with a loading indicator, and the API response ' +
    'structure { data: [...] } from Chapter 10 is checked.',
  imgWidth: 1120,
  data: {
    layers: [
      {
        label: 'Use the optional operator',
        note: 'mahasiswa?.nama',
        tone: 'neutral',
      },
      {
        label: 'Give the state an initial value',
        note: '[] or null, then show a loading indicator',
        tone: 'acc',
      },
      {
        label: 'Check the API response structure',
        note: '{ data: [...] } · Chapter 10',
        tone: 'neutral',
      },
    ],
  },
}
