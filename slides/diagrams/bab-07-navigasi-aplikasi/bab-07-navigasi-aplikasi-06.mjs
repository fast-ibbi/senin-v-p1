// Chapter 7 — App Navigation · diagram 06
// The slide teaches one idea — navigation is the stack of active screens, the visit
// history, and the way a screen receives data — and lends it the browser, which students
// already own. Two systems, the same three concepts, matched row by row: that is exactly
// what `beforeAfter` draws. `flow` would have invented a chain the slide never claims, and
// `layers` a stack it never claims either; the slide itself puts the two models side by side
// in two columns.
//
// Left is `neutral`, not the default `red`: the browser is not the wrong way to navigate, it
// is the thing being mapped onto mobile. Right keeps the `acc` because that is the side the
// chapter teaches.
//
// The three left rows are the slide's first bullet taken apart (page address, forward/back
// buttons, data passed through the query string) and the three right rows are its second
// bullet (internal routes, history maintained by the navigator) plus the definition's own
// clause "the way a screen receives data from another screen". Those two bullets are the
// picture, so they move verbatim into the presenter notes; the column heading that used to
// introduce them, "Analogy: a web browser", goes with them — the left panel is titled with
// the slide's own words, WEB BROWSER. The two operating-system bullets stay on the slide:
// the Android back button and the iOS edge swipe are not in the picture.
export default {
  id: '06',
  slide: 'What Is Navigation?',
  pattern: 'beforeAfter',
  alt:
    'The browser analogy, read row by row: a page address is an internal route, the forward ' +
    'and back buttons are the history the navigator maintains, and data passed through the ' +
    'query string is data one screen receives from another screen.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'WEB BROWSER',
      tone: 'neutral',
      items: [
        'Page address',
        'Forward/back buttons',
        'Data passed through the query string',
      ],
    },
    right: {
      title: 'ON MOBILE',
      tone: 'acc',
      items: [
        'Internal routes',
        'History maintained by the navigator',
        'A screen receives data from another screen',
      ],
    },
  },
}
