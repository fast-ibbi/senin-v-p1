// Chapter 2 — Development Environment Setup · diagram 04
// Replaces the old Mermaid chart (bab-02-…-04.mmd), a four-box chain from package.json to the
// screen. Nothing had to be reinterpreted: the slide's own blockquote states the chain and all
// three connectors — "package.json points to index.js, index.js registers App.js, and App.js
// draws the display" — so the edge labels are quoted from the slide, not invented.
//
// The two notes that are not on this slide are the mechanisms behind two of the arrows: the
// `main` key (legacy chart) and `registerRootComponent(App)` (slide 27's table), plus the three
// device paths the legacy chart listed for "the screen".
export default {
  id: '04',
  slide: 'package.json Memanggil index.js, index.js Memanggil App.js',
  pattern: 'flow',
  alt:
    'The execution order: package.json points to index.js through its main key, index.js ' +
    'registers App.js with registerRootComponent, and App.js draws the display on Expo Go, the ' +
    'emulator, or a phone.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'package.json', note: 'the main key' },
      { label: 'index.js', note: 'registerRootComponent(App)' },
      { label: 'App.js', note: 'the main component' },
      { label: 'The display', note: 'Expo Go · emulator · phone', tone: 'acc' },
    ],
    edges: ['points to', 'registers', 'draws'],
  },
}
