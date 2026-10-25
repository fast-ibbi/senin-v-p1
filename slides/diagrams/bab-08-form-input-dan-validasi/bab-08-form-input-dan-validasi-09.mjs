// Chapter 8 — Forms, Input, and Validation · diagram 09
// New picture; this slide had none. The slide's third bullet is already written as an
// arrow — "a value comes in → an error message (string) or the empty string '' comes
// out" — and a one-way pipe with a value at one end and one string at the other is what
// `flow` draws. The two other candidates were worse: `beforeAfter` would force the input
// and the answer into "two mental models" they are not, and `tree` would make a
// containment picture out of a transformation.
//
// The purity claim (same input, same output; no side effects) is a property of the arrow,
// not a stage, so it rides as the middle chip's note instead of pretending to be a step.
// `utils/validators.js` and "easy to reuse and to test" are deliberately not drawn: bullet
// 2 and bullet 4 stay on the slide verbatim, and a picture that repeated them would be a
// third copy of the same sentence. The file name is named in the alt text so the reader
// who only gets the alt still knows where the functions live.
//
// The last chip takes the accent because the returned string is the deliverable — the
// screen displays it and nothing else. The blockquote ("adding a new rule means adding one
// function") is a consequence of the shape, so the picture leaves it to the prose.
//
// `canvas: [1160, 160]` trims the 44px of unused note room the flow reserves under each
// chip (all three notes are one line). Same reasoning as diagram 06: it buys the blockquote
// on this slide 24px of clearance from the pagination row, and the build's ink check refuses
// the SVG if anything falls outside the shorter canvas.
export default {
  id: '09',
  slide: 'Validation: Definition and the Pure Function Contract',
  pattern: 'flow',
  alt:
    'The contract in one direction: a value comes in, a pure function in ' +
    'utils/validators.js runs with no side effects and the same output for the same input, ' +
    'and what comes out is one string — an error message, or the empty string when the ' +
    'value is acceptable.',
  imgWidth: 1120,
  data: {
    canvas: [1160, 160],
    steps: [
      { label: 'A value', note: 'the data the user enters' },
      { label: 'Pure function', note: 'same input, same output' },
      { label: 'An error message', note: "or the empty string ''", tone: 'acc' },
    ],
    edges: ['comes in', 'comes out'],
  },
}
