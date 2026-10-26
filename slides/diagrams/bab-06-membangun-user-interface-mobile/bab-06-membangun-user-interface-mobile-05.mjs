// Chapter 6 — Building a Mobile User Interface · diagram 05
// A new addition (there was no such chart in the old Mermaid set): the Principle 4
// slide states the thumb-reach order in a single sentence, and that order is its
// content. The `layers` pattern uses three stacked bands as a map of screen zones;
// the order really is vertical, so the stack is not a metaphor.
//
// Honest limit: `layers` bands are equal height, while reach zones are not
// proportional. The bands are therefore labelled as zones ("Screen title", "Main
// content", "Main action") rather than by size, and each note states its reach.
//
// `tone: 'neutral'` is written explicitly on the first two bands: `layers` defaults the
// top band to `acc`, so without it two bands glow blue and the picture highlights the
// zone that is actually hardest to reach.
export default {
  id: '05',
  slide: 'Prinsip 4 — Jangkauan Ibu Jari Menentukan Posisi',
  pattern: 'layers',
  alt:
    'Three phone screen zones by thumb reach: the screen title at the top is hard to ' +
    'reach, the main content and the main action at the bottom are easy to reach.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'Screen title', note: 'top corners are hard', tone: 'neutral' },
      { label: 'Main content', note: 'easy to reach', tone: 'neutral' },
      { label: 'Main action', note: 'easy to reach', tone: 'acc' },
    ],
  },
}
