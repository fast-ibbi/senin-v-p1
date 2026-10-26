// Chapter 15 — Build and Deployment · diagram 04
// Replaces the old Mermaid chart (bab-15-…-04.mmd): four boxes from the .env file to
// "every user can read it". The chain is a one-way pipeline, so `flow` — this is the
// slide's whole security argument ("the most important security slide in this chapter"
// per its notes) and the last stage is the one that must be remembered, hence the accent.
//
// The build-time step is the legacy chart's second box. Slide 21 shows only the
// consequence; the inlining rule itself is stated on slide 20 ("Only variables prefixed
// with EXPO_PUBLIC_ are inlined into the app code"), which is why "Build time" and the
// "inlined" edge are the two labels the provenance report cannot find here.
//
// The first edge is "inlined" rather than a second "embedded": the note under the second
// chip already carries the slide's own "values are embedded", and a picture that says the
// same word on the arrow and under the box reads as a mistake.
export default {
  id: '04',
  slide: 'Nilai EXPO_PUBLIC_ Ikut Terbaca Semua Pengguna',
  pattern: 'flow',
  alt:
    'The value in the .env file is embedded at build time, ends up inside the JavaScript ' +
    'bundle shared with all users, and any user of the app can read it.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: '.env', note: 'EXPO_PUBLIC_ value' },
      { label: 'Build time', note: 'values are embedded' },
      { label: 'JavaScript bundle', note: 'shared with all users' },
      { label: 'Every user', note: 'anyone can read them', tone: 'acc' },
    ],
    edges: ['inlined', 'bundled', 'read'],
  },
}
