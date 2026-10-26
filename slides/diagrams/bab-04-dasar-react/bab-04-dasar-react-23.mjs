// Chapter 4 — React Fundamentals · diagram 23
// Density pass: the BAAK case study was five bullets of prose. Its shape is a derivation,
// not a list — one data source, narrowed by the program filter, rendered as cards that
// never touch each other, and summarised by an aggregate computed from exactly those
// cards. That is the slide's own claim ("One source of truth: data is separated from the
// view"), so the picture is the separation: data on the left, view in the middle, derived
// number on the right, with nothing pointing back.
//
// Pattern: `flow`. Three stages and two hand-over points, no branch, no return — the case
// the kit sends to `flow` rather than `stateMachine`. `beforeAfter` (spreadsheet vs
// application) would have needed a left panel of manual steps this slide never lists; the
// only words it gives for the manual world are "spreadsheet files" and "copy errors", which
// is a setup sentence, not a parallel row set. `tree` was rejected because the only tree
// here is DATA_MAHASISWA → DaftarMahasiswa → KartuMahasiswa, which diagram 02 already draws
// on the Component Composition slide; a second, near-identical ladder in the same chapter
// would teach the shape twice and the claim zero times.
//
// Honest limits: `flow` is one-way, so the picture cannot show "and it all still works when
// the source moves to a server in Chapter 10" — that bullet stays on the slide, untouched,
// because the picture does not say it. The boxes are also not proportional: the GPA box is
// the same size as the cards box although it holds one number, and the fan-out from one
// source to many cards is not drawn at all — the middle stage is one box, not a row of
// them.
//
// Labels come from the slide's text: "One source of truth", "Each card stands alone", "GPA
// average ... computed automatically", and "program filter". One is the slide's phrase
// reshaped to fit a box: "Student cards" (singular "card" plus "student data"). The stage
// name `DATA_MAHASISWA` is the chapter's own constant (it is in the practicum code and the
// presenter notes name it: "when DATA_MAHASISWA is replaced by the result of fetch").
//
// Tone: the accent sits on the GPA average because that is the number the office used to
// type by hand; the data source and the cards stay neutral.
export default {
  id: '23',
  slide: 'Studi Kasus: Data Akademik di BAAK',
  pattern: 'flow',
  alt:
    'One data source — DATA_MAHASISWA — is filtered by program into a set of independent ' +
    'student cards, and the GPA average is computed from those cards instead of typed by hand.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'DATA_MAHASISWA', note: 'one source of truth', tone: 'neutral' },
      { label: 'Student cards', note: 'each card stands alone', tone: 'neutral' },
      { label: 'GPA average', note: 'computed automatically', tone: 'acc' },
    ],
    // The two operations the slide names: the program filter that decides which cards
    // exist, and the average taken over the cards actually on screen. "program filter" is
    // the slide's own phrase for the first operation; "filter by program" was the first
    // attempt and had to go — at 14px it filled the whole 118px gap between two boxes and
    // read as if it touched both borders.
    edges: ['program filter', 'average'],
  },
}
