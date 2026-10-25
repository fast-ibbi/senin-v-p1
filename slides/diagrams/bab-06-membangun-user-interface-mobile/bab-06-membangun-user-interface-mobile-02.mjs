// Chapter 6 — Building a Mobile User Interface · diagram 02
// Replaces the old Mermaid diagram (bab-06-…-02.mmd) that drew four disconnected
// node pairs. The shape is not a tree but four parallel pairs, so the pattern is
// `beforeAfter`, not `tree`: a single root would invent a hierarchy the slide does
// not have, and all four parents have exactly one child each — zero-height elbows
// would put every principle and its manifestation on the same y, reading as eight
// siblings.
//
// The left column uses `tone: 'neutral'` rather than the default red: red reads as
// "the wrong model", while all four of these principles are correct. The pattern's
// automatic numbering happens to line up with the slide numbering ("Principle 1 —
// Consistency" … "Principle 4 — Thumb-friendly").
export default {
  id: '02',
  slide: 'Four Principles Working Together',
  pattern: 'beforeAfter',
  alt:
    'Four principles paired with their technical form: consistency through design tokens, ' +
    'visual hierarchy through the typography scale and color palette, feedback through the ' +
    'Pressable style when pressed or disabled, and thumb-friendly through the main action ' +
    'at the bottom.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'FOUR PRINCIPLES',
      tone: 'neutral',
      items: ['Consistency', 'Visual hierarchy', 'Feedback', 'Thumb-friendly'],
    },
    right: {
      title: 'TECHNICAL FORM',
      tone: 'acc',
      items: [
        'Design token: same colors and sizes',
        'Typography scale and color palette',
        'Pressable style when pressed or disabled',
        'Main action at the bottom, header at the top',
      ],
    },
  },
}
