// Chapter 9 — State Management · diagram 07
// Slide 8, "The Limit of Lifting State Up: Prop Drilling". No legacy chart.
//
// The slide's definition is a chain — "passing props in a chain through intermediary
// components that do not use that data at all" — and its first bullet says the chain gets
// long. That is a one-way sequence of levels with a label on every hop, so the pattern is
// `flow`. A `tree` would draw containment and lose the whole point, because the thing that
// hurts is the *distance* the value travels, not which component contains which.
//
// Two identical `Intermediary` chips is the argument, not laziness: the notes ask students
// to imagine "passing a message through five people, and four of them do not care", and the
// same props appearing twice in code that never reads them is exactly what the slide means
// by "the whole row of intermediary components". Steps stop at four because five at the
// kit's 86px arrow gap squeezes the notes to two cramped lines; two intermediaries already
// make the row visible.
//
// The accent is left on the last stage (`flow`'s default): the only consumer is the one
// node in the picture that actually wants the data, so the eye lands on the wrong end of
// the chain on purpose.
//
// The bullet the picture duplicates — "It happens when data has to pass through many
// component levels" — moved verbatim into the presenter notes. The two consequences that
// the chain cannot show (one new field rewrites the whole row; the code gets noisy) stay on
// the slide.
//
// Provenance: `props` and `Intermediary` are the slide's own words ("intermediary
// components"). `State owner` and `Consumer` are not on this slide: the owner is slide 7's
// "the parent holds the state", and `consumer` is the deck's word on slide 28 (and in
// diagram 05). `does not use it` condenses "components that do not use that data at all",
// which is too long for a 44px note line.
export default {
  id: '07',
  slide: 'The Limit of Lifting State Up: Prop Drilling',
  pattern: 'flow',
  alt:
    'Prop drilling in one line: the state owner passes props down to an intermediary ' +
    'component that does not use the data, then to a second intermediary that does not use ' +
    'it either, and only then to the one component that actually reads it.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'State owner', note: 'holds the value' },
      { label: 'Intermediary', note: 'does not use it' },
      { label: 'Intermediary', note: 'does not use it' },
      { label: 'Consumer', note: 'the only user', tone: 'acc' },
    ],
    edges: ['props', 'props', 'props'],
  },
}
