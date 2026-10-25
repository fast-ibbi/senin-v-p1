// Chapter 6 — Building a Mobile User Interface · diagram 03
// Replaces the old Mermaid diagram (bab-06-…-03.mmd): a five-stage chain from
// wireframe to server data. The Mermaid chart had no labels on its arrows; the verbs
// here come from this slide's presenter notes ("Chapter 7 adds navigation, Chapter 8
// adds forms, Chapter 10 replaces static data with data from a server").
export default {
  id: '03',
  slide: 'The UI-First Approach',
  pattern: 'flow',
  alt:
    'The UI-first order: a wireframe becomes a static screen, then Chapter 7 adds ' +
    'navigation, Chapter 8 adds forms, and Chapter 10 replaces static data with data ' +
    'from a server.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Wireframe', note: 'layout sketch' },
      { label: 'Static screen', note: 'static data' },
      { label: 'Chapter 7', note: 'Expo Router navigation' },
      { label: 'Chapter 8', note: 'forms and validation' },
      { label: 'Chapter 10', note: 'data from a server', tone: 'acc' },
    ],
    edges: ['built', 'added', 'added', 'replaced'],
  },
}
