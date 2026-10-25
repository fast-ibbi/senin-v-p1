// Chapter 10 — REST API and Backend Integration · diagram 11
// Slide: "Empty State and Pull-to-Refresh". The slide is four bullets and a blockquote
// about two things at once: the empty state and the refresh gesture. The relationship
// that is actually the content is the one the presenter notes tell the teacher to draw
// out loud: "Draw a firm distinction between two states students often mix up: an empty
// list because the data really does not exist yet, and an empty list because the request
// failed. Both need a different message." Two models, two matched rows — so the pattern
// is `beforeAfter`.
//
// Row 1 pairs the diagnosis: "the list is really empty" against "the screen is empty but the
// app is not broken" (bullet 4's words). Row 2 pairs the remedy: a call to action on one
// side, "a way out, not a dead end" on the other. The panel titles are the two causes and
// pair with each other: "The request succeeds" is bullet 1's words, and "The request
// failed" is the presenter notes' phrasing, which the build reports.
//
// Nothing about pull-to-refresh is in this picture on purpose: `RefreshControl`, the
// pull-down gesture and the onRefresh reload are mechanics, not a contrast, and they are
// the one part of the slide that stays as prose.
//
// Two bullets moved verbatim into this slide's presenter notes under "Trimmed to the
// picture (the diagram says this)": the empty-state definition and the "not broken, give
// a way out" rule — exactly the two the picture redraws. The two kept bullets are the
// ones the picture cannot carry: the exact copy to show the user ("No student data yet.
// Add one with the Add button.") and the whole pull-to-refresh mechanism.
export default {
  id: '11',
  slide: 'Empty State and Pull-to-Refresh',
  pattern: 'beforeAfter',
  alt:
    'Two empty lists with two different causes. When the request succeeds and the list is ' +
    'really empty the screen must offer a call to action, such as the Add button. When the ' +
    'request failed the screen is empty but the app is not broken, so it must give a way ' +
    'out, not a dead end.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'The request succeeds',
      tone: 'neutral',
      items: ['the list is really empty', 'give a call to action: Add one with the Add button'],
    },
    right: {
      title: 'The request failed',
      tone: 'red',
      items: ['the screen is empty but the app is not broken', 'give a way out, not a dead end'],
    },
  },
}
