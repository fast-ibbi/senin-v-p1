// Chapter 6 — Building a Mobile User Interface · diagram 06
// New picture (there was no Mermaid chart at this position). The slide asks why an app
// feels easy or hard and then answers it across two columns: principles are drawn from
// watching people, and this chapter assembles Chapter 5's materials with reasons. That
// is a derivation — observation, then principle, then interface — so the pattern is
// `flow`, three stages and two verbs. `beforeAfter` was the alternative (the slide
// already prints two columns), but redrawing those columns would restate the grid
// without adding the one thing the prose leaves implicit: the order.
//
// Labels are the slide's own words: "observing how people read and hold a phone",
// "Principles, not taste", "assemble them into a reasoned interface". The two edge
// verbs are the only authored words; the deck has no verb joining the steps.
export default {
  id: '06',
  slide: 'Kenapa Dua Aplikasi Mirip Terasa Jauh Berbeda?',
  pattern: 'flow',
  alt:
    'How principles arise: observing how people read and hold a phone yields principles ' +
    'rather than taste, and those principles are assembled into a reasoned interface.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Observing', note: 'how people read and hold a phone' },
      { label: 'Principles', note: 'not taste, not trial and error' },
      { label: 'Reasoned interface', note: 'the materials assembled', tone: 'acc' },
    ],
    edges: ['yields', 'assembled into'],
  },
}
