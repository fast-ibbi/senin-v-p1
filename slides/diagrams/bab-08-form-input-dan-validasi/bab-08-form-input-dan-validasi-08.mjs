// Chapter 8 — Forms, Input, and Validation · diagram 08
// New picture; this slide had none. Its definition names two wires and an invariant:
// "`value` holds the contents of state, and every keystroke only changes it through
// `onChangeText`" — the text displayed and the state are always identical, with no second
// copy. That is a round trip, and `sequence` is the pattern that draws a round trip.
//
// It does not fit here, and that is a measurement, not a taste: `sequence` needs at least
// 188px of canvas (24px pad + 46px actor headers + 26px + two 34px message rows), which is
// 202px on the slide at `w:1120`, and this slide has 178px of slack under its second
// bullet. A `flow` is the shortest pattern in the set, so it is the one that fits; the
// loop is said in words instead — the third chip's note ("every keystroke goes here") is
// the return leg, and the alt text states the loop outright. Nothing in the chain is
// invented: the slide prints `value`, state, `onChangeText`, and `setForm` in its own code.
//
// `canvas: [1160, 160]` is the one geometry lever a spec owns. The natural flow canvas
// reserves 44px of note room below each chip; these notes are one line, so 160px carries
// the chips (24–100) and the note line (122–141) and crops only empty space. The build's
// ink check refuses the SVG if anything falls outside, so this cannot quietly clip.
//
// Note that this slide and its predecessor draw the two halves of one loop: diagram 06 is
// the value leaving the field, this one is the value arriving from state and going back.
// Same participants, opposite direction — the pair is the lesson, which is also why the
// second and third chips are the ones carrying the accent and the code names.
export default {
  id: '08',
  slide: 'Controlled Component: Single Source of Truth',
  pattern: 'flow',
  alt:
    'The controlled round trip drawn as a chain: React state is the single source and ' +
    'supplies the value, TextInput displays that value and nothing else, and every ' +
    'keystroke goes back to state through setForm — so the displayed text and the state ' +
    'are always identical, with no second copy. The last step returns to the first.',
  imgWidth: 1120,
  data: {
    canvas: [1160, 160],
    steps: [
      { label: 'React state', note: 'single source of truth' },
      { label: 'TextInput', note: 'value holds the contents of state' },
      { label: 'setForm', note: 'every keystroke', tone: 'acc' },
    ],
    edges: ['value', 'onChangeText'],
  },
}
