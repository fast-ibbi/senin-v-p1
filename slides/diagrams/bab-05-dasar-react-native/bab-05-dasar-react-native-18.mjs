// Chapter 5 — React Native Basics · diagram 18
// The facing `Diagram:` slide (12) already draws the *zones* of the screen as a `layers`
// stack (notch, safe area, content, home indicator). Repeating that here would be the same
// picture twice in a row, so this takes the other relationship the slide teaches and 12
// cannot show: which API you write and what each one does per platform. That is exactly
// the misconception the presenter notes name — "assuming the built-in SafeAreaView
// already handles both platforms".
//
// Two rows per side, so the panels answer each other: what you get on each platform, and
// (on the left) what happens on Android against (on the right) what else the package
// needs. The notch/status-bar bullet, the inset definition, and the Android 15
// edge-to-edge policy stay on the slide: the picture does not show them.
export default {
  id: '18',
  slide: 'Safe Area Bukan Tambahan, tetapi Syarat',
  pattern: 'beforeAfter',
  alt:
    'The built-in SafeAreaView only works on iOS and has no effect on Android; the modern '
    + 'choice is react-native-safe-area-context, whose useSafeAreaInsets hook reads the '
    + 'insets and whose SafeAreaProvider is placed at the root of the app.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'BUILT-IN SAFEAREVIEW',
      tone: 'red',
      items: [
        'Works on iOS only',
        'No effect on Android',
      ],
    },
    right: {
      title: 'SAFE-AREA-CONTEXT',
      tone: 'acc',
      items: [
        'useSafeAreaInsets hook',
        'SafeAreaProvider at the root',
      ],
    },
  },
}
