// Chapter 15 — Build and Deployment · diagram 02
// Replaces the old Mermaid chart (bab-15-…-02.mmd): five boxes joined left to right with
// no labels on the arrows. The slide's own numbered list supplies the first four stages
// and its presenter notes supply the fifth ("the result checked through the same link"),
// so the chain is the slide's, not an invention.
//
// The edge words are the actions of the mandatory order (the notes: "the order is
// mandatory"), kept as bare verbs because each arrow is only 74px wide.
export default {
  id: '02',
  slide: 'Urutan Perintah Build Tidak Boleh Ditukar',
  pattern: 'flow',
  alt:
    'The EAS build order: install eas-cli, sign in with eas login, run build:configure to ' +
    'create eas.json, run eas build with the preview profile, and receive an APK or AAB ' +
    'together with a download link.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'eas-cli', note: 'or call it with npx' },
      { label: 'eas login', note: 'confirm the session' },
      { label: 'build:configure', note: 'creates eas.json' },
      { label: 'eas build', note: 'profile preview' },
      { label: 'APK or AAB', note: 'checked through the same link', tone: 'acc' },
    ],
    edges: ['install', 'login', 'configure', 'build'],
  },
}
