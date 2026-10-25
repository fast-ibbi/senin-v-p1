// Chapter 8 — Forms, Input, and Validation · diagram 06
// New picture; this slide had none. Its three bullets are one causal chain: a keystroke
// fires an event, the event carries the new text out of the component, and some other
// component stores it. That is `flow` — the arrow verbs are the slide's own words, and
// the order is the lesson (nothing stays inside TextInput).
//
// The chain stops where the slide stops. It says the value "must be stored by another
// component, usually React state"; it does not say the value comes back in. That return
// trip is the next slide's subject (`value` holds the contents of state), so drawing it
// here would print the following slide's picture one slide early. The one-way arrow out
// of the field is the honest half.
//
// The third stage takes the accent because it is where the value actually lives — the
// claim the slide title makes ("It Does Not Store Its Own Value") is only meaningful if
// the picture shows the store on the other end.
//
// `canvas: [1160, 160]` is the one geometry lever a spec owns: the natural flow canvas
// reserves 44px of note room under every chip, and these notes are one line each, so 160px
// carries the chips (24–100) and the note line (122–141) and crops only empty space. The
// build's ink check refuses an SVG whose content falls outside, so this cannot clip
// quietly. The 24px it saves is what keeps the blockquote under this slide off the
// pagination row.
export default {
  id: '06',
  slide: 'TextInput: It Does Not Store Its Own Value',
  pattern: 'flow',
  alt:
    'The value leaves the field on every keystroke: TextInput holds no value of its own, ' +
    'onChangeText fires with the new text, and another component — usually React state — ' +
    'is what stores it.',
  imgWidth: 1120,
  data: {
    canvas: [1160, 160],
    steps: [
      { label: 'TextInput', note: 'does not store its own value' },
      { label: 'onChangeText', note: 'with the new text' },
      { label: 'React state', note: 'stored by another component', tone: 'acc' },
    ],
    edges: ['every keystroke', 'must be stored'],
  },
}
