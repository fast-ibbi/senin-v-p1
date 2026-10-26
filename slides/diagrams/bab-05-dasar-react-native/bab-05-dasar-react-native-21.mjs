// Chapter 5 — React Native Basics · diagram 21
// The facing `Diagram:` slide (38) already draws the three decisions as a `flow`
// (slow list → FlatList → card layout → Platform.select). Chaining them again here would
// be picture 14 twice, so this takes the axis the flow cannot show and the one that
// actually explains the lag: the list component sits on top of the whole dataset and only
// renders the visible slice of it. Hence `layers` — the component above, the rows it has to
// deal with below — rather than a second chain or a second panel pair.
//
// The two bands duplicate exactly two bullets (the row volume, and FlatList rendering only
// the visible rows); both moved to the presenter notes word for word. The top band keeps
// the slide's own "Decision 1" marker so the two decisions left on the slide still read as
// decisions 2 and 3. The web-table complaint and Decisions 2 and 3 stay on the slide,
// because no band shows them.
export default {
  id: '21',
  slide: 'Studi Kasus: Daftar yang Tersendat Saat Digulir',
  pattern: 'layers',
  alt:
    'The FlatList sits above the data it has to show: it renders only the visible rows while '
    + 'the Academic Office dataset holds hundreds to thousands of rows per academic advisor.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'Decision 1: FlatList', note: 'only the visible rows', tone: 'acc' },
      { label: 'Hundreds to thousands of rows', note: 'per academic advisor' },
    ],
  },
}
