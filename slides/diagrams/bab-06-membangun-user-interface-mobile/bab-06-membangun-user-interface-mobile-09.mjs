// Chapter 6 — Building a Mobile User Interface · diagram 09
// New picture. Feedback is an exchange in time: the slide's first bullet is the rule
// ("every user action must get a visible response") and its later bullets are the
// returns — a pressed button dims, and vibration and animation come later. A round trip
// in order is `sequence`; a `flow` would draw the same three moves as a one-way pipeline
// and lose the fact that the response travels back to the person who touched.
//
// The actors are the slide's own words: "user action" and "touchscreen" — the screen is
// what answers. There is no app name in this slide's prose, so none is invented.
//
// The third message is drawn because the slide puts it in order: the touch response is
// mandatory, and vibration and animation come later. The "(later)" in its label is the
// ordering, not a new fact.
export default {
  id: '09',
  slide: 'Principle 3 — Feedback',
  pattern: 'sequence',
  alt:
    'The feedback round trip: the user presses, the screen answers with a visual effect — ' +
    'a pressed button dims — and vibration and animation only come later.',
  imgWidth: 1120,
  data: {
    actors: ['User', 'Screen'],
    messages: [
      { from: 'User', to: 'Screen', label: 'touch, press' },
      { from: 'Screen', to: 'User', label: 'dims, visual effect', tone: 'acc' },
      { from: 'Screen', to: 'User', label: 'vibration and animation' },
    ],
  },
}
