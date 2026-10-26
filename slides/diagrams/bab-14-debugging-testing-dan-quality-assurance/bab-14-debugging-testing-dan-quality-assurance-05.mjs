// Chapter 14 — Debugging, Testing, and QA · diagram 05
// New picture — this deck had no chart here. The slide states the relation in prose: two
// layers of state debugging that answer different questions and "complement each other,
// they do not replace each other" (presenter notes). Two models on one axis, with the two
// questions as matched rows, so `beforeAfter`.
//
// Left panel is `neutral`, not the default red: neither layer is wrong. Red would say "use
// DevTools instead of logs", which is the opposite of the slide's point.
//
// Two rows, not three. The slide's third DevTools bullet — "Can change state without
// writing code" — has no counterpart on the logs side, and an unpaired extra row is what
// turns a two-model picture back into a list. It stays on the slide, where it is the
// reason DevTools can shorten the edit-run loop.
//
// The right column quotes the slide's bullets verbatim. The left column's first row does
// not: the slide writes `console.log('state berubah:', nilai)` inside `useEffect`, and
// quoting that string would put Indonesian from a code sample inside an English picture.
// The row therefore names the call and the hook instead — the one provenance miss here
// that is not caused by the split.
//
// Row 1 is the mechanism in each layer, row 2 is the question each layer answers; that
// pair of questions is the whole content of the slide's main message. The picture lives on
// its own `## Diagram: …` slide directly after the prose: on the prose slide Marp pushed
// the last bullet into the page number, which is a collision, not a fit. That split is also
// why every label here is reported as "not on the slide" — provenance reads the bound
// (picture-only) slide; each label was checked by hand against the prose slide above it.
export default {
  id: '05',
  slide: 'Dua Lapisan untuk Melihat State, Dua Pertanyaan Berbeda',
  pattern: 'beforeAfter',
  alt:
    'Two layers of state debugging: logs written inside useEffect answer when and in what ' +
    'order; React DevTools, which inspects the component tree and every state value, ' +
    'answers what the state contains right now.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'LAYER 1 — LOGS',
      tone: 'neutral',
      items: [
        'Log the state inside useEffect',
        'Answers the question "when and in what order"',
      ],
    },
    right: {
      title: 'LAYER 2 — REACT DEVTOOLS',
      tone: 'acc',
      items: [
        'Inspect the component tree and the state value of every component',
        'Answers the question "what does it contain right now"',
      ],
    },
  },
}
