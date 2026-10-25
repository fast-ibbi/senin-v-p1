// Chapter 3 — Modern JavaScript for React Native · diagram 04
// Replaces the old Mermaid chart (bab-03-…-04.mmd), which drew the request as a branching
// pipeline. That branch cannot be a `flow` (flow is one-way, no split), and drawing it as
// a second `stateMachine` would have duplicated diagram 03's topology on a neighbouring
// slide. What the slide actually teaches is a choice about the `catch` block — its
// blockquote says the catch "is where the app chooses to react, not where it hides the
// error" — so the picture is two mental models of the same block.
//
// Both panel titles are the blockquote's own words, and both rows are verbatim fragments
// of this slide's notes ("an empty catch block makes the error vanish without a trace —
// always display or log its failure message" plus the "succeeding … failing" reading of
// one request), so this spec has no provenance misses.
//
// Row 1 answers "what the catch block does"; row 2 answers "what the user is left with".
// Red/green is the wrong-versus-right pairing, not an accent highlight.
export default {
  id: '04',
  slide: '`try`/`catch`: the App Must Not Stay Silent',
  pattern: 'beforeAfter',
  alt:
    'Two mental models of a catch block, matched row by row: what the block does, then ' +
    'what the user is left with. An empty catch block makes the error vanish without a ' +
    'trace; a catch block that chooses to react displays or logs its failure message, so ' +
    'the user sees a clear message.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'HIDES THE ERROR',
      tone: 'red',
      items: ['an empty catch block', 'makes the error vanish without a trace'],
    },
    right: {
      title: 'CHOOSES TO REACT',
      tone: 'green',
      items: ['display or log its failure message', 'the user sees a clear message'],
    },
  },
}
