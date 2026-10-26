// Chapter 9 — State Management · diagram 02
// Replaces the old Mermaid chart (bab-09-state-management-02.mmd): LayarPesan held
// `ukuran`, passed it to both children, and took the choice back from PilihUkuran.
// The shape is not containment but an exchange in time — props go out, a change
// comes back — so the pattern is `sequence`. A `tree` here would draw only the two
// downward arrows and drop the callback that the slide's own sentence is about
// ("every change is sent back through a callback function").
//
// Actor order is deliberate: the parent sits in the middle column so that all three
// messages join adjacent lifelines. The kit centres a message label on the gap
// between its two actors, so LayarPesan→RingkasanPesanan in a LayarPesan-first
// layout would print its text straight through PilihUkuran's dashed lifeline.
//
// Labels: `props` is the slide's word; `ukuran` and `onPilihUkuran` are the real prop
// names from Example 1 (two slides later), kept verbatim because they are identifiers,
// not prose. The upward arrow is not labelled "callback" although the blockquote uses
// that word: the code's name for the callback is what a student has to recognise.
export default {
  id: '02',
  slide: 'Lifting State Up: State Naik, Data Turun',
  pattern: 'sequence',
  alt:
    'Lifting state up as an exchange: LayarPesan holds the ukuran state and passes it to both ' +
    'children through props — PilihUkuran and RingkasanPesanan — and PilihUkuran sends the ' +
    'chosen size back up through the onPilihUkuran callback.',
  imgWidth: 1120,
  data: {
    actors: ['PilihUkuran', 'LayarPesan', 'RingkasanPesanan'],
    messages: [
      { from: 'LayarPesan', to: 'PilihUkuran', label: 'props: ukuran' },
      { from: 'LayarPesan', to: 'RingkasanPesanan', label: 'props: ukuran' },
      { from: 'PilihUkuran', to: 'LayarPesan', label: 'onPilihUkuran', tone: 'acc' },
    ],
  },
}
