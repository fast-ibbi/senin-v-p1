// Chapter 1 — Introduction to Mobile Programming · diagram 09
// Slide 9, "Four Approaches (2): Hybrid & Cross-platform". No legacy chart.
//
// The slide is two columns again, but a second `beforeAfter` here would repeat diagram 08
// one slide later and would compare hybrid against cross-platform by their bullet lists —
// which the two Table 1.1 halves do properly two slides later. What this slide's own
// words describe is a nesting: "the interface is written in HTML, CSS and JavaScript",
// "wrapped in a native container through a WebView, with a bridge to some features". Three
// strata, in a fixed order, is `layers` — and the order is the content, because the
// interface being web pages inside a WebView is exactly why hybrid never feels native.
//
// The accent sits on the WebView rather than on the top band (the pattern's default): the
// WebView is the mechanism the slide is explaining, the same way diagram 05 accents the
// bridge instead of the JavaScript band. Native stays at the bottom for the same reason as
// in 05 — the picture's y axis means "closer to the device".
//
// Trimmed: the two nested bullets ("The interface is written in HTML, CSS, JavaScript" and
// "Wrapped in a native container through a WebView, with a bridge to some features") moved
// verbatim into the notes. The third hybrid bullet, "Never feels native — popular in
// 2012–2015, then abandoned", stays on the slide: a stack cannot show a verdict or a date,
// so moving it would lose a fact the picture does not carry.
export default {
  id: '09',
  slide: 'Empat Pendekatan (2): Hybrid & Cross-platform',
  pattern: 'layers',
  alt:
    'The hybrid app as three nested strata: the interface, written in HTML, CSS and ' +
    'JavaScript, runs inside a WebView, which is wrapped in a native container with a ' +
    'bridge to some device features.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'The interface', note: 'HTML, CSS, JavaScript', tone: 'neutral' },
      { label: 'WebView', tone: 'acc' },
      { label: 'Native container', note: 'bridge to some features', tone: 'neutral' },
    ],
  },
}
