// Chapter 2 — Development Environment Setup · diagram 14 (new: no legacy Mermaid chart at 14)
//
// The slide's bullets answer "what happens after I type npx expo start": a terminal appears with a
// QR code and a LAN address, the shortcut keys pick a target, and the app shows up (the blockquote
// names the last step: "Save a change in App.js, then watch the screen change by itself within 1-2
// seconds — that is Fast Refresh"). That is a chain over time, so `flow`; the accented stage is the
// display, because the display is what the student is waiting for.
//
// Why not a key table: the keys are a mapping, and a `beforeAfter` of key against target would need
// five rows — 336px on the slide — which this slide cannot hold under a code fence, three bullets
// and a blockquote. The chain also answers the question the slide is titled with; a key map answers
// "which key" instead.
//
// Trimming: bullet 1 moved verbatim into the presenter notes; its three parts are the second stage
// (the QR code, the LAN address) and the third (the keys). Bullets 2 and 3 stay: the picture shows
// "a · i · w" but not "r manual reload", and it cannot show that Ctrl+C stops the server — those two
// facts would otherwise leave the slide.
export default {
  id: '14',
  slide: 'Menjalankan Development Server dan Membaca Layarnya',
  pattern: 'flow',
  alt:
    'npx expo start, run from inside the project folder, opens the Expo terminal with a QR code and ' +
    'a LAN address such as exp://192.168.x.x:8081; pressing a, i or w picks Android, the iOS ' +
    'Simulator or the web, and the display follows Fast Refresh on save.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'npx expo start', note: 'from the project folder' },
      { label: 'The Expo terminal', note: 'exp://192.168.x.x:8081' },
      { label: 'a · i · w', note: 'Android · iOS · web' },
      { label: 'The display', note: 'Fast Refresh on save', tone: 'acc' },
    ],
    edges: ['opens', 'press', 'refreshes'],
  },
}
