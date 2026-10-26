// Chapter 11 — Local Data Storage · diagram 06
// New picture. The slide's opening sentence is already a contrast: state lives in the
// device's memory (RAM) and is volatile, so "once the app is closed or its process is
// killed by the system, every value vanishes without a trace". The four bullets are the
// reasons local storage exists. Two models are being compared, so the pattern is
// beforeAfter, not a chain: nothing here happens in order.
//
// Rows are loss against gain, not question against answer. Left row 1 says where state
// lives, left row 2 says what happens to it; right row 1 answers the lifetime ("still
// there tomorrow" is the presenter note's notebook analogy: "it must be opened and closed,
// but its content is still there tomorrow"), and right row 2 is the slide's third bullet
// in its own words ("local is faster and saves quota"). The deck's spec 02 is unpaired in
// the same way and says so; this one does too.
//
// Left is the pattern's default red and right its default accent, which is exactly the
// reading wanted here: the volatile model is the one that loses data.
//
// Provenance: "STATE IN RAM" is the slide's own phrase split across a sentence ("state
// lives in the device's memory (RAM)"); "Still there tomorrow" comes from the presenter
// note. No bullet is trimmed — the picture does not restate any of the four reasons, so
// all four stay on the slide.
export default {
  id: '06',
  slide: 'State Hanya Bertahan Sampai Aplikasi Ditutup',
  pattern: 'beforeAfter',
  alt:
    'Two models side by side: React state lives in the device\'s memory (RAM) and vanishes ' +
    'without a trace, while local storage is still there tomorrow, and being local it is ' +
    'faster and saves quota.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'STATE IN RAM',
      items: ["Lives in the device's memory", 'Vanishes without a trace'],
    },
    right: {
      title: 'LOCAL STORAGE',
      items: ['Still there tomorrow', 'Faster, and saves quota'],
    },
  },
}
