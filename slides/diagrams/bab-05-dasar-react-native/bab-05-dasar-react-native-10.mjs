// Chapter 5 — React Native Basics · diagram 10
// Two models of touch component, three parallel rows: what controls the style, what can
// be changed, and what is available. Matching rows make the choice read as a trade-off
// instead of two lists of traits.
export default {
  id: '10',
  slide: 'Diagram: Touch: Button and Pressable',
  pattern: 'beforeAfter',
  alt:
    'Button uses the platform default style and only accepts title, onPress, color, and ' +
    'disabled, so its content cannot be styled; Pressable accepts free children, a style ' +
    'that is a function receiving pressed, plus android_ripple and hitSlop.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'BUTTON',
      tone: 'red',
      items: [
        'platform default style',
        'only title, onPress, color, disabled',
        'its content cannot be styled',
      ],
    },
    right: {
      title: 'PRESSABLE',
      tone: 'acc',
      items: [
        'free children: built from View and Text',
        'style is a function with the pressed status',
        'android_ripple, hitSlop, onLongPress',
      ],
    },
  },
}
