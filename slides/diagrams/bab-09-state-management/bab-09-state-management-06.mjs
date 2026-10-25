// Chapter 9 — State Management · diagram 06
// Slide 4, "Local State and Global State: Two Scopes". No legacy chart.
//
// The slide already carries a `grid2` comparison, and the first pass left it alone for
// that reason. This pass overrules that: the grid2 is two columns of *sentences*, and the
// slide's whole point is a pair you are meant to see side by side. `beforeAfter` is the
// pattern for two mental models in parallel rows; a `layers` reading (global above local)
// would claim a stack the slide never draws.
//
// One row, one instance per scope, both taken from the slide's own "Example:" bullets —
// those two bullets therefore moved into the presenter notes. That is the whole picture on
// purpose: the two columns below it carry the rules, and the picture's only job is to make
// the split visible before the student reads a word.
//
// A two-row version was built first, adding visibility as a second axis ("known to it and
// its children" against "one copy, many readers" from slide 7's notes). It read better as a
// pair of matched axes but stood 222 units tall, which pushed the right column's last line
// onto the page number at the bottom of the slide. The fix was not to shrink the type or the
// width — it was to ask the picture for less. The third bullet ("Known only to that
// component and its children") therefore stays on the slide.
//
// The chapter's desk/notice-board analogy stays in the presenter notes: an instance on the
// left paired with a metaphor on the right is not a parallel row, it reads as a third
// category of state.
//
// Tone: the left panel is `neutral`, not the pattern's default red. Local state is not the
// wrong answer; it is the right answer for one component, and six slides later the decision
// hierarchy starts there. `acc` marks global state, the new idea on this slide.
export default {
  id: '06',
  slide: 'Local State and Global State: Two Scopes',
  pattern: 'beforeAfter',
  alt:
    'Local state against global state, one instance each: text being typed in one search ' +
    'field is state only that component uses; the cart in the badge, the list, and the ' +
    'payment screen is one value read by many components across screens.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'LOCAL STATE',
      tone: 'neutral',
      items: ['text typed in the search field'],
    },
    right: {
      title: 'GLOBAL STATE',
      tone: 'acc',
      items: ['cart: badge, list, payment'],
    },
  },
}
