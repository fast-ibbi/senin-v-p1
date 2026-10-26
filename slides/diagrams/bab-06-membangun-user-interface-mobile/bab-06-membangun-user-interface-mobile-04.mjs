// Chapter 6 — Building a Mobile User Interface · diagram 04
// Replaces the old Mermaid diagram (bab-06-…-04.mmd), which drew three boxes with two
// opposing arrows. Opposing arrows in one picture read as "two paths at once"; the
// `sequence` pattern reads as a round trip in order, which is what this slide teaches.
//
// Deliberately only two message labels, each used twice: "data down" and "events up" —
// the slide title's own words. No new mechanism is invented: there is no `setState` or
// `onTekan` in the picture, although both appear in the presenter notes.
export default {
  id: '04',
  slide: 'Data Turun lewat Props, Event Naik lewat Fungsi',
  pattern: 'sequence',
  alt:
    'The data round trip: App.js passes data down to Screen, Screen passes data down to ' +
    'Component; then events travel up from Component to Screen and back to App.js.',
  imgWidth: 1120,
  data: {
    actors: ['App.js', 'Screen', 'Component'],
    messages: [
      { from: 'App.js', to: 'Screen', label: 'data down' },
      { from: 'Screen', to: 'Component', label: 'data down' },
      { from: 'Component', to: 'Screen', label: 'events up', tone: 'acc' },
      { from: 'Screen', to: 'App.js', label: 'events up', tone: 'acc' },
    ],
  },
}
