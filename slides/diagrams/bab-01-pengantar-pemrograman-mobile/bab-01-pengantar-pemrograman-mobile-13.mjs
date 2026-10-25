// Chapter 1 — Introduction to Mobile Programming · diagram 13
// Slide 22, "Expo: The Price You Pay". No legacy chart.
//
// "The Price You Pay" is a trade-off slide, and the trade has two halves that the slide
// keeps apart: three costs in the bullets, then one verdict in the blockquote — "For the
// majority of information-system apps, these three limitations are not blockers. For
// specialized projects, this is the trade-off consideration." Cost on the left, verdict on
// the right, is `beforeAfter`; Chapter 2's "Expo Go: Fast, with Limits" (spec 09 there)
// already draws a get-versus-price slide in exactly this shape.
//
// The three rows on the left and the two on the right are NOT paired one to one, and the
// automatic badges must not be read as pairs: the price of the whole left column is the
// whole right column. Chapter 2's spec 09 states the same caveat for the same reason.
// `tree` was considered (one price, three symptoms) and rejected — patterns.md is explicit
// that a tree of peers is a bulleted list with elbows.
//
// Tones: `amber` on the price (a cost, not an error), `acc` on the verdict, which is where
// the slide wants the class to land. Neither is a recommendation to use or avoid Expo.
//
// Trimmed: the first bullet ("Expo app size tends to be larger") moved verbatim into the
// presenter notes — row 1 of the left panel is that bullet. The other two bullets stay on
// the slide: each names a mechanism (a prebuild / a development build; waiting for the
// SDK) that a two-line row cannot hold without dropping the word the student has to act
// on, and rule four keeps two bullets on a slide that had bullets anyway.
export default {
  id: '13',
  slide: 'Expo: The Price You Pay',
  pattern: 'beforeAfter',
  alt:
    'Expo\u2019s costs beside the verdict. The price: app size tends to be larger, native ' +
    'modules Expo does not support yet need a prebuild or a development build, and ' +
    'cutting-edge device features arrive only after Expo adapts to the latest SDK. The ' +
    'trade-off: for the majority of information-system apps these are not blockers, and for ' +
    'specialized projects they are the consideration.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'THE PRICE',
      tone: 'amber',
      items: [
        'App size tends to be larger',
        'Native modules not yet supported by Expo require a prebuild or a development build',
        'Cutting-edge device features only become available after Expo adapts to the latest SDK',
      ],
    },
    right: {
      title: 'THE TRADE-OFF',
      tone: 'acc',
      items: [
        'The majority of information-system apps: these three limitations are not blockers',
        'Specialized projects: this is the trade-off consideration',
      ],
    },
  },
}
