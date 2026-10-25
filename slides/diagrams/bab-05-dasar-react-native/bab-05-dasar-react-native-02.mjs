// Chapter 5 — React Native Basics · diagram 02
// Replaces the old Mermaid diagram (bab-05-dasar-react-native-02.mmd) so that the whole
// chapter uses one palette and one geometry vocabulary from the kit.
//
// The content is taken directly from its Mermaid chart: one JSX tree with two render
// branches. What is lost to the `tree` pattern's three-level limit: the intermediate
// node "Platform native component" — its label moves into the alt text and the presenter
// notes.
export default {
  id: '02',
  slide: 'From JSX to Native Components',
  pattern: 'tree',
  alt:
    'The same JSX branches two ways: react-dom renders it into DOM elements, ' +
    'React Native renders it into UIView on iOS and ViewGroup on Android.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'JSX',
      children: [
        {
          label: 'react-dom',
          children: [{ label: 'DOM: div, span, p, img' }],
        },
        {
          label: 'React Native',
          tone: 'acc',
          children: [
            { label: 'iOS: UIView' },
            { label: 'Android: ViewGroup' },
          ],
        },
      ],
    },
  },
}
