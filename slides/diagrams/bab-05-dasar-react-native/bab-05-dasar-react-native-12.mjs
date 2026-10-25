// Chapter 5 — React Native Basics · diagram 12
// Notch, safe area, content, and home indicator occupy the same vertical layer on a phone
// screen. The `layers` pattern uses that order as it is; the two outermost bands are
// given the red tone because they are precisely not safe areas.
export default {
  id: '12',
  slide: 'Diagram: SafeAreaView and the Safe Area',
  pattern: 'layers',
  alt:
    'From top to bottom: the notch and status bar, then the safe area whose width is ' +
    'called the inset, then the app content, then the home indicator. The two outermost ' +
    'layers are not safe areas for content.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'Notch and status bar', note: 'not a safe area', tone: 'red' },
      { label: 'Safe area', note: 'inset', tone: 'acc' },
      { label: 'App content', note: 'inside the safe area' },
      { label: 'Home indicator', note: 'not a safe area', tone: 'red' },
    ],
  },
}
