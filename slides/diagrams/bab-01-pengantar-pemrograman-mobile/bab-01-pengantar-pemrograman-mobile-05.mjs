// Chapter 1 — Introduction to Mobile Programming · diagram 05
// Replaces the old Mermaid chart (bab-01-…-05.mmd), which drew two world-boxes joined by
// two-way arrows plus a Metro bundler feeding the JavaScript side. Bidirectional arrows in
// one picture read as "two paths at once"; the runtime is a stack — JavaScript on top, the
// bridge under it, the native layer at the bottom — so `layers` is the shape, and the stack
// order is the content.
//
// Two deliberate choices:
//   · Metro is not drawn. `layers` cannot show a feeder beside the stack, and pretending it
//     is a stratum above JavaScript would say Metro sits between the code and the runtime.
//     The bundler is named on the slide that precedes this one, and in the notes here.
//   · The accent is on the bridge, not on the top band (the pattern's default). The bridge
//     is the mechanism this slide exists to explain, and the notes send the class from it
//     straight to the performance trade-offs in Section 1.7.
//
// 'Hermes' from the legacy chart is not used: that name does not appear anywhere in the
// chapter's prose, and a version detail is not worth inventing.
export default {
  id: '05',
  slide: 'How React Native Works',
  pattern: 'layers',
  alt:
    'Inside a running app: the JavaScript layer holds the app logic and issues commands, the ' +
    'bridge carries messages both ways between the two worlds, and the native layer draws ' +
    'real components and reports the user\u2019s tap back.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'JavaScript', note: 'app logic, issues commands', tone: 'neutral' },
      { label: 'Bridge', note: 'messages pass both ways', tone: 'acc' },
      { label: 'Native', note: 'draws real components, reports taps', tone: 'neutral' },
    ],
  },
}
