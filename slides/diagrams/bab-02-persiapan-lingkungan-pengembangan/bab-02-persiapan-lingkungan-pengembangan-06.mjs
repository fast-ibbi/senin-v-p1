// Chapter 2 — Development Environment Setup · diagram 06 (new: no legacy Mermaid chart at 06)
//
// The VS Code slide's right-hand column describes what happens when a file is saved: "ESLint
// checks code quality; Prettier tidies the format when a file is saved" and "Error Lens shows
// error messages next to the problem line". That is a chain over time — one save, then a
// formatter, then a checker, then the message — which is `flow`. The two-column grid teaches the
// three extensions as peers and hides that they run in that order; the presenter notes already
// ask "why does Prettier matter in team work?" and answer with the save.
//
// Trimming: the two extension bullets moved verbatim into the presenter notes; their content is
// the picture. The three editor bullets stayed untouched — the picture says nothing about
// IntelliSense, cross-file search or the integrated terminal. The bold lead-in "Extensions that
// help" was the header of the emptied column; the picture names the three extensions directly.
//
// Edge verbs: "triggers" and "shows" are the slide's own verbs; "then" is the connector the slide
// leaves implicit, and it is the only inferred word in the picture.
export default {
  id: '06',
  slide: 'VS Code: Menulis, Menjalankan, dan Membaca Error',
  pattern: 'flow',
  alt:
    'Reading one save left to right: the file is written, Prettier tidies the format, ESLint checks ' +
    'code quality, and Error Lens shows the message next to the problem line.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Save', note: 'the file is written' },
      { label: 'Prettier', note: 'the format is tidied' },
      { label: 'ESLint', note: 'the code is checked' },
      { label: 'Error Lens', note: 'the message by the line', tone: 'acc' },
    ],
    edges: ['triggers', 'then', 'shows'],
  },
}
