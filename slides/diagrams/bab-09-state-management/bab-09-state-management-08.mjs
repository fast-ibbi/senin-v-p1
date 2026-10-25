// Chapter 9 — State Management · diagram 08
// Slide 13, "When to Use Context — and When Not To". No legacy chart.
//
// This slide is also a `grid2`, and the first pass left it alone for that reason. The
// columns are the comparison, but they are not parallel rows: the left column lists three
// *signals*, the right column one signal and one *cost*. `beforeAfter` is the pattern for
// two mental models in matched rows, so the picture takes the pair that really is matched —
// how far apart the readers are — and leaves the rest of the prose where it is.
//
// Row 1 left (`many components far apart`, with the slide's own examples theme / language /
// cart) answers row 1 right (`one or two neighbours`). Row 2 left (`data changes across
// screens`) has no counterpart in the material, and is drawn as a second signal rather than
// invented into a false parallel: patterns.md allows uneven counts, and pretending the
// avoid-column has a matching "data does not change" line would be a claim the slide never
// makes.
//
// Three bullets moved into the presenter notes — the two `Data is used by ...` reach bullets
// and `Data changes across screens`, which the picture now states. What stays is the prose
// the picture cannot carry: the pain signal ("prop drilling already feels painful") and the
// cost ("components become hard to reuse because their value is hidden"). The blockquote
// under the slide keeps the re-render warning, so it is deliberately NOT a third row: the
// same sentence twice on one slide is worse than once.
//
// The right panel's footer is the interview answer the slide never states: if you avoid
// context, you keep explicit props — "explicit props remain the easiest thing to read for
// two or three levels" is this slide's own presenter note. It fills the shorter panel and
// stops "avoid Context" from reading as "there is no answer".
//
// Tone: `acc` on the left because that is the mechanism the chapter is introducing; `red` on
// the right because this side is the trap, not a neutral alternative. This is the one
// diagram in the deck where red is literally right.
export default {
  id: '08',
  slide: 'When to Use Context — and When Not To',
  pattern: 'beforeAfter',
  alt:
    'When to use Context against when not to, on two paired rows. Use it when many ' +
    'components far apart read the same value — theme, language, cart — and when the data ' +
    'changes across screens. Avoid it when only one or two neighbouring components need the ' +
    'data; explicit props stay the easiest thing to read at that distance.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'USE CONTEXT',
      tone: 'acc',
      items: ['many components far apart — theme, language, cart', 'data changes across screens'],
    },
    right: {
      title: 'AVOID CONTEXT',
      tone: 'red',
      items: ['only one or two neighbours'],
      footer: 'explicit props stay easiest to read',
    },
  },
}
