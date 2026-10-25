// Chapter 15 — Build and Deployment · diagram 01
// A new picture (no legacy chart at this id). The EAS slide states five facts in no
// particular order; the relationship that carries the mental model is the hand-off:
// you send the project code, Expo's server does the compiling, the server hands back a
// download link. `sequence` reads as "who does what, in what order" — which is exactly
// the point of a cloud build, and the reason a laptop without the Android SDK can still
// produce an APK.
//
// Only three messages, all taken from the slide's own bullets: "you just send the
// project code", "Expo's server does the compiling", "the output is a download link and
// a QR code". The QR code is left out of the label (the label must fit the arrow) and
// lives in the alt text.
//
// Honest limit: the pattern tints the FIRST actor with the accent, so the local machine
// glows rather than the server that does the work. Geometry is the kit's, not the spec's.
export default {
  id: '01',
  slide: 'EAS Build: Heavy Lifting in the Cloud',
  pattern: 'sequence',
  alt:
    'The EAS round trip: the local machine sends the project code to Expo\'s server, the ' +
    'server does the compiling inside the cloud, and it hands back a download link and a QR ' +
    'code. Nothing is compiled on the laptop.',
  imgWidth: 1120,
  data: {
    actors: ['Local machine', "Expo's server"],
    messages: [
      { from: 'Local machine', to: "Expo's server", label: 'project code' },
      { from: "Expo's server", to: "Expo's server", label: 'compiling' },
      { from: "Expo's server", to: 'Local machine', label: 'download link', tone: 'acc' },
    ],
  },
}
