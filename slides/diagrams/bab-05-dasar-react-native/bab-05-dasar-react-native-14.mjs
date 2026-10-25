// Chapter 5 — React Native Basics · diagram 14
// The case study is written as a story: one complaint, then three decisions in order.
// The `flow` pattern shows that those three decisions are one chain leading to a
// resolution — not three pieces of advice standing on their own.
export default {
  id: '14',
  slide: 'Diagram: Case Study: A List That Lags While Scrolling',
  pattern: 'flow',
  alt:
    'A complaint about a slow list is answered by three decisions in order: FlatList so ' +
    'that only visible rows are rendered, a card layout with useWindowDimensions, then ' +
    'Platform.select and the safe area for both platforms.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Slow list', note: 'hundreds to thousands of rows', tone: 'red' },
      { label: 'FlatList', note: 'only visible rows' },
      { label: 'Card layout', note: 'useWindowDimensions' },
      { label: 'Platform.select', note: 'plus the safe area', tone: 'acc' },
    ],
    edges: ['Decision 1', 'Decision 2', 'Decision 3'],
  },
}
