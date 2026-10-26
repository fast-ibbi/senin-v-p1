// Chapter 4 — React Fundamentals · diagram 02
// Replaces the old Mermaid chart (bab-04-dasar-react-02.mmd) and the hand-drawn SVG the
// chapter-build script used to emit at this path. Both drew the same four-name chain:
// App → DaftarMahasiswa → KartuMahasiswa, with detailTampil hanging off the card.
//
// Pattern: `layers`, not `tree`, and the reason is a fact about this picture rather than
// taste. From the root the chain is four levels deep (App.js → DaftarMahasiswa →
// KartuMahasiswa → its state), and `tree` caps depth at 3 and drops node notes — so a
// tree would have to delete "the state lives here", which is the sentence this slide's
// presenter notes teach ("state stands where it is declared"). `tree` would also collapse
// the chain onto one y, because every node here has exactly one child, so the nesting
// would read as three siblings in a row. `layers` is the kit's documented "containment
// stack": outermost component on top, innermost at the bottom — which is also the
// direction the data travels.
//
// Honest limits of `layers`: the bands are equal height, so they read as levels of
// nesting, not as proportions of screen space. There are no arrows either; the top-down
// order carries the direction ("data flows down").
//
// Only the card's state is named here. App's own state (the program filter) belongs to the
// practicum slide, and saying "App owns the state" on a picture whose next band already
// holds local state would read as a contradiction — the chapter's line is that state
// stands where it is declared, which is exactly what the two notes say between them.
export default {
  id: '02',
  slide: 'Komposisi Component: Data Turun, State Tinggal',
  pattern: 'layers',
  alt:
    'Component composition read top-down: App.js is the root component that owns the data, ' +
    'DaftarMahasiswa renders one card per student, and each KartuMahasiswa keeps its own ' +
    'detailTampil state.',
  imgWidth: 1120,
  data: {
    layers: [
      // tone written explicitly on the first two: `layers` defaults the top band to the
      // accent, and the band that matters here is the small reusable card at the bottom.
      { label: 'App.js', note: 'root component · owns the data', tone: 'neutral' },
      { label: 'DaftarMahasiswa', note: 'one card per student', tone: 'neutral' },
      { label: 'KartuMahasiswa', note: 'local state: detailTampil', tone: 'acc' },
    ],
  },
}
