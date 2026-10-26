// Chapter 2 — Development Environment Setup · diagram 09 (new: no legacy Mermaid chart at 09)
//
// The Expo Go slide is already a two-column grid, but the two columns are a trade-off, not two
// lists: what the tool gives you on the left, what it charges for that on the right. That is
// `beforeAfter`, and the panel titles are the slide's own column headers. The two columns could not
// show that the points answer each other ("no build process" against "no native code of its own"),
// which is the price framing the presenter notes call "reading the manuscript instead of printing
// the book".
//
// Trimming: the three bullets that the panels reproduce moved verbatim into the presenter notes.
// The two kept bullets name details a panel cannot hold — the Wi-Fi requirement, and the Chapter 15
// cross-reference for the development build — so both stay on the slide; without them the picture
// would be the only statement, and the pointer to Chapter 15 would be lost.
export default {
  id: '09',
  slide: 'Expo Go Cepat, tetapi Tidak Semua Fitur Bisa Diuji',
  pattern: 'beforeAfter',
  alt:
    'The trade-off, side by side. What you get: the phone is the player, so you scan the QR code, and ' +
    'there is no build process, so the app appears within seconds. The price you pay: only the APIs ' +
    'in the Expo package work, and Expo Go carries no native code of its own, so custom features ' +
    'need a development build.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'What you get',
      tone: 'acc',
      items: [
        'The phone is the player: scan the QR code',
        'No build process: the app appears in seconds',
      ],
    },
    right: {
      title: 'The price you pay',
      tone: 'amber',
      items: [
        'Only the APIs in the Expo package',
        'Custom features need a development build',
      ],
    },
  },
}
