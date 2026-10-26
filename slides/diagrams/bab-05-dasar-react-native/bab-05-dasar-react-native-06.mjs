// Chapter 5 — React Native Basics · diagram 06
// One Flexbox engine, two opposite default values. The slide states it as five ordered
// items (web, Yoga, the reason, the effect, the trap); this picture arranges them as two
// parallel models so the rows can be compared directly: which default, what it looks
// like, and what must be written for the opposite direction.
export default {
  id: '06',
  slide: 'Flexbox di React Native Dimulai dari column',
  pattern: 'beforeAfter',
  alt:
    'On the web Flexbox defaults to row so elements line up horizontally; in React Native ' +
    'the layout engine is Yoga and the default is column so children stack downward.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'ON THE WEB',
      tone: 'neutral',
      items: [
        'Flexbox default row',
        'Elements line up horizontally',
        'Vertical needs flexDirection column',
      ],
    },
    right: {
      title: 'IN REACT NATIVE',
      tone: 'acc',
      items: [
        'Layout engine Yoga: default column',
        'Stacking downward',
        'Horizontal needs flexDirection row',
      ],
    },
  },
}
