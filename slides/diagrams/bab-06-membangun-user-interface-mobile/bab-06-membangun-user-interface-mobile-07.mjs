// Chapter 6 — Building a Mobile User Interface · diagram 07
// New picture. The Consistency slide states a causal chain without naming it as one:
// design tokens are one place that stores colors and sizes, similar elements look and
// behave similarly, and that lowers cognitive cost until other screens can be guessed.
// Three of the slide's five bullets are the links of that chain, so `flow` is the shape
// and the order of the stages is the teaching.
//
// The chain stops at "fewer mistakes" because the slide stops there: its IS bullet says
// staff with varied digital literacy make fewer data-entry mistakes. The trade-off
// bullet ("rigid consistency can block solutions specific to a context") is deliberately
// NOT drawn — it is a limit of the chain, not a step in it, and it stays on the slide.
//
// Edge verbs are authored: the slide never prints "applied everywhere" or "lowers".
export default {
  id: '07',
  slide: 'Prinsip 1 — Elemen Serupa Tampil Serupa',
  pattern: 'flow',
  alt:
    'The chain behind consistency: design tokens in one place store colors and sizes, so ' +
    'similar elements carry the same colors, spacing, and wording, which lowers cognitive ' +
    'cost — other screens can be guessed — and means fewer data-entry mistakes for staff of ' +
    'varied digital literacy.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Design tokens', note: 'one place that stores colors and sizes' },
      { label: 'Similar elements', note: 'same colors, spacing, label wording' },
      { label: 'Cognitive cost', note: 'other screens can be guessed' },
      { label: 'Fewer data-entry mistakes', note: 'staff with varied digital literacy', tone: 'acc' },
    ],
    edges: ['applied everywhere', 'lowers', 'fewer mistakes'],
  },
}
