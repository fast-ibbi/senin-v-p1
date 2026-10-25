// Chapter 5 — React Native Basics · diagram 09
// Two image sources with opposite consequences at the moment the app runs. The rows are
// paired so that the difference in "when is it available" and "what must be written"
// reads horizontally instead of being scattered across five items.
export default {
  id: '09',
  slide: 'Diagram: Image: Two Image Sources',
  pattern: 'beforeAfter',
  alt:
    'A local asset uses require and is bundled at build time; a remote image uses a uri, ' +
    'is loaded while the app runs, and must be given an explicit width and height.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'LOCAL ASSET',
      tone: 'neutral',
      items: [
        "require('./assets/icon.png')",
        'bundled at build time',
        'already there when the app starts',
      ],
    },
    right: {
      title: 'REMOTE IMAGE',
      tone: 'acc',
      items: [
        "{ uri: 'https://…' }",
        'loaded while the app runs',
        'explicit width and height required',
      ],
    },
  },
}
