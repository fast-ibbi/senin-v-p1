// Chapter 11 — Local Data Storage · diagram 09
// New picture. The slide defines a cache and then lists what it buys; the two bullets the
// picture carries name both sides of the same two questions, so the pattern is
// beforeAfter — the with/without pair, which is the pattern's "wrong vs right" shape.
//
// Row 1 is speed: bullet 2 says "the local copy shows immediately without waiting for a
// server response", so the left panel says what waiting looks like. Row 2 is availability:
// bullet 1 says "the app keeps showing data when the network is not available", so the left
// panel says what is on screen when the copy is missing. Both right-hand rows are the
// slide's own wording; the right panel is the accent because it is the model being taught.
//
// The left panel is the default red and the right the default accent — no tone override:
// the without-a-cache column is the degraded case, not an alternative design.
//
// One bullet moved VERBATIM to the presenter notes: "Availability: the app keeps showing
// data when the network is not available". The picture says exactly that fact in its right
// column, and moving it is what lets the picture sit on this slide at w:1120 instead of
// pushing the blockquote into the footer. Two bullets stay — speed and quota savings — and
// so does the trade-off, which the picture does not show at all.
//
// Provenance: "Shows immediately without waiting" and "Keeps showing data when the network
// is not available" are substrings of the slide. "Nothing to show when the network is not
// available" is the negation of bullet 1 stated for the left panel — it is the one label
// the build cannot find, and it is deliberate.
export default {
  id: '09',
  slide: 'Cache: A Copy So the App Stays Useful',
  pattern: 'beforeAfter',
  alt:
    'The same screen with and without a cache: without one the app waits for a server ' +
    'response and has nothing to show when the network is not available; with one it shows ' +
    'immediately without waiting and keeps showing data when the network is not available.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'WITHOUT A CACHE',
      items: ['Waits for a server response', 'Nothing to show when the network is not available'],
    },
    right: {
      title: 'WITH A CACHE',
      items: ['Shows immediately without waiting', 'Keeps showing data when the network is not available'],
    },
  },
}
