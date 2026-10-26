// Chapter 5 — React Native Basics · diagram 20
// Three bullets plus a short code block, so this slide has room to spare and nothing has
// to be crowded out. The relationship is the one the second bullet states in prose: a
// rotation is not a one-off measurement, it pushes a new width into the component, and the
// render that follows is what re-derives the column count. Drawn as a `flow` because the
// four stages really are a chain; the hook's object shape and the `key={jumlahKolom}`
// rebuild are on the slide, not in the picture.
//
// Stage 4 is the accent because `numColumns` is the value the code block finally passes
// down, and `key={jumlahKolom}` is what makes the list rebuild when the count changes.
// Edge labels are the slide's own verbs: the rotation changes the width, the new width
// triggers a re-render, and that render sets the column count. An earlier draft put
// "the value changes" on both the first arrow and the Re-render note, which read as a
// circle; the threshold now sits on the stage that computes it.
export default {
  id: '20',
  slide: 'Lebar Layar Berubah, Jumlah Kolom Ikut Berubah',
  pattern: 'flow',
  alt:
    'Rotating the phone changes the width that useWindowDimensions returns, the new width '
    + 'triggers a re-render, and in that render the width becomes a column count through '
    + 'width >= 600 ? 3 : 2, which is passed down as numColumns with key={jumlahKolom}.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Rotation', note: 'the phone is rotated' },
      { label: 'width', note: 'useWindowDimensions' },
      { label: 'Re-render', note: 'width >= 600 ? 3 : 2' },
      { label: 'numColumns', note: 'key={jumlahKolom}', tone: 'acc' },
    ],
    edges: ['changes', 'triggers', 'sets'],
  },
}
