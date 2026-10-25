// Chapter 1 — Introduction to Mobile Programming · diagram 03
// Replaces the old Mermaid timeline (bab-01-…-03.mmd). A timeline is a chain, and the
// slide's presenter notes state the relation out loud: each generation is born as an
// answer to the limitations of the previous one. `flow` shows that order; two panels
// would hide it.
//
// Five eras, four edges. Only one answer is ever named in the material — the notes ask
// "what limitation did the app store answer?" (distribution previously controlled by
// mobile operators) — so no per-edge limitation is invented here: all four arrows carry
// the same verb, the one the legacy timeline's own title used.
//
// Metro-era phrasing is not added: the notes say the dates are not the point, the pattern
// is. The last stage keeps the pattern's default accent, marking where the chapter lands.
export default {
  id: '03',
  slide: 'The Evolution of Mobile Technology',
  pattern: 'flow',
  alt:
    'Mobile technology eras in order, each answering the limitation of the previous one: ' +
    'feature phones (late 1990s, WAP, physical buttons), then the 2007 iPhone with a ' +
    'capacitive touchscreen, then the 2008 app stores with Android 1.0, then mobile web in ' +
    'the 2010s with responsive design and HTML5, then cross-platform with React Native ' +
    'open-sourced in 2015.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Feature phones', note: 'late 1990s · WAP, physical buttons' },
      { label: 'iPhone', note: '2007 · capacitive touchscreen' },
      { label: 'App stores', note: '2008 · App Store and Android 1.0' },
      { label: 'Mobile web', note: '2010s · responsive design, HTML5' },
      { label: 'Cross-platform', note: 'React Native open source 2015', tone: 'acc' },
    ],
    edges: ['answered', 'answered', 'answered', 'answered'],
  },
}
