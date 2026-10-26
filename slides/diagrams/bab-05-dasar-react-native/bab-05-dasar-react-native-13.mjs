// Chapter 5 — React Native Basics · diagram 13
// The rule is single: inside a style array, an object written later overrides the earlier
// one. The `layers` pattern uses the stack as a metaphor for precedence — the top layer
// is the one that wins. Only two layers, because this slide really does give just one
// pair of examples; adding a third layer would mean inventing one.
export default {
  id: '13',
  slide: 'Lapisan Paling Atas Selalu yang Dipakai',
  pattern: 'layers',
  alt:
    'A style array merges objects in order: styles.kartu as the base style, then ' +
    'styles.kartuBesar written later so it overrides the same properties. false and null ' +
    'values inside the array are ignored.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'styles.kartuBesar', note: 'later: overrides', tone: 'acc' },
      { label: 'styles.kartu', note: 'base style' },
    ],
  },
}
