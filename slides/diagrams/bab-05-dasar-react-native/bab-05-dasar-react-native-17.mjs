// Chapter 5 — React Native Basics · diagram 17
// The facing `Diagram:` slide (11) draws the controlled loop as a `flow`: a keystroke
// reaches onChangeText, the state changes, the input box follows. That picture only
// covers the controlled side. The question third bullet of the prose — what the same
// TextInput does when `value` is left out — has no picture anywhere, and it is the
// misconception the presenter notes name ("thinking value is only an initial value").
//
// So this pair is the mechanism, not the sequence: the presence of `value={nama}` row by
// row, and the consequence of each choice. Two rows per side, each answering the other.
// `mono` is forced off on both sides so the pair keeps one voice: only one of the four
// rows is code, and a monospace left panel next to a sans-serif right panel would read as
// two different kinds of list.
export default {
  id: '17',
  slide: 'TextInput: Controlled Component',
  pattern: 'beforeAfter',
  alt:
    'A controlled TextInput has value={nama} bound, so the box always reflects the state; ' +
    'without value it is uncontrolled and out of sync with the state.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'CONTROLLED',
      tone: 'acc',
      mono: false,
      items: [
        'value={nama}',
        'The box always reflects the state',
      ],
    },
    right: {
      title: 'UNCONTROLLED',
      tone: 'red',
      mono: false,
      items: [
        'Without value',
        'Out of sync with the state',
      ],
    },
  },
}
