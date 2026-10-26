// Chapter 2 — Development Environment Setup · diagram 01 (new: no legacy Mermaid chart at 01)
//
// The Node.js slide states the stack in two of its own bullets — "It wraps the V8 JavaScript
// engine, the same engine as Chrome" and "Expo CLI and Metro Bundler run on top of Node.js" —
// and the presenter notes repeat the second ("every Expo tool runs on top of Node.js"). That is
// strata, each sitting on the one below, which is `layers`. The slide's two-column list cannot
// show the order, and the order is what answers the chapter's first misconception.
//
// The picture sits on its own slide, "Diagram: Node.js: …", placed AFTER the prose slide. The
// prose slide is a two-column grid with six bullets; at w:720 a 15px note would render at 9.3px
// on the projector. No bullet was moved, deleted or reworded.
//
// Tones: `layers` accents the top band by default, but the subject of this slide is Node.js, not
// the tools above it, so the accent sits on the middle band and the two outer bands are
// explicitly neutral.
export default {
  id: '01',
  slide: 'Node.js Menjalankan JavaScript, Bukan Bahasa Baru',
  pattern: 'layers',
  alt:
    'Three strata: the V8 JavaScript engine at the bottom — the same engine as Chrome — with ' +
    'Node.js, a JavaScript runtime outside the browser, on top of it, and Expo CLI and Metro ' +
    'Bundler running on top of Node.js.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'Expo CLI · Metro Bundler', note: 'run on top of Node.js', tone: 'neutral' },
      { label: 'Node.js', note: 'a JavaScript runtime outside the browser', tone: 'acc' },
      { label: 'V8 JavaScript engine', note: 'the same engine as Chrome', tone: 'neutral' },
    ],
  },
}
