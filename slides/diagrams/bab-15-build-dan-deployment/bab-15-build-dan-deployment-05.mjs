// Chapter 15 — Build and Deployment · diagram 05
// Replaces the old Mermaid chart (bab-15-…-05.mmd), a six-stage chain from registering
// the app to release. `flow` takes five stages, so registration is folded into the App
// Store Connect stage's note and the upload becomes the verb on the arrow into it — the
// six legacy boxes keep their order, which is exactly what the slide asks students to
// understand ("it is enough to understand the order").
//
// The edge words are short verbs, not repetitions of the chip beside them: upload into
// App Store Connect, test through TestFlight, review, release.
export default {
  id: '05',
  slide: 'App Store: Conceptual Flow',
  pattern: 'flow',
  alt:
    'The iOS release path: eas build produces the build with the certificate and the upload, ' +
    'it goes up to App Store Connect, testers get it through TestFlight, App Review checks ' +
    'it, and only then is it released.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'eas build', note: 'the certificate and the upload' },
      { label: 'App Store Connect', note: 'the app is registered' },
      { label: 'TestFlight', note: 'internal and external testers' },
      { label: 'Review', note: 'stricter review than Play' },
      { label: 'Release', tone: 'acc' },
    ],
    edges: ['upload', 'test', 'review', 'release'],
  },
}
