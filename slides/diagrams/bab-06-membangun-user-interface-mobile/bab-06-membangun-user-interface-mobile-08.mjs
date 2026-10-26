// Chapter 6 — Building a Mobile User Interface · diagram 08
// New picture. The Visual Hierarchy slide's one positive rule is an order — "Title most
// prominent, then the main content, then the faintest notes" — and an order held in
// vertical prominence is exactly what `layers` draws; the stack is not a metaphor here.
// The slide's other four lines are the argument around that rule (the eye scans, the
// four tools, two failure modes) and none of them is a stratum, so they are not drawn.
//
// Tones carry the point: the top band takes the accent because the title is the most
// prominent, and the two bands below are written `neutral` explicitly — `layers` accents
// the top band by default, so leaving them alone would put the accent in the right place
// by luck rather than on purpose.
//
// The bands are equal height, while real prominence is not proportional; the notes carry
// the ordinal ("most prominent", "next", "faintest") so the picture never claims a size
// relationship it cannot draw.
export default {
  id: '08',
  slide: 'Prinsip 2 — Mata Memindai, Bukan Membaca',
  pattern: 'layers',
  alt:
    'Visual hierarchy read top to bottom: the title is the most prominent, the main ' +
    'content comes next, and the notes are faintest.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'Title', note: 'most prominent', tone: 'acc' },
      { label: 'Main content', note: 'then', tone: 'neutral' },
      { label: 'Notes', note: 'faintest', tone: 'neutral' },
    ],
  },
}
