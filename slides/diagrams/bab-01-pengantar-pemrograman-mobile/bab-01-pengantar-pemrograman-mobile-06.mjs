// Chapter 1 — Introduction to Mobile Programming · diagram 06
// Replaces the old Mermaid chart (bab-01-…-06.mmd): three chained client layers, then the
// server across an "HTTP + JSON" arrow. The client layers really do hand work downward and
// the server really is the far end of that chain, so the shape is `flow` — a stack would
// have put the server inside the client, which the old chart's subgraph was careful not to
// do.
//
// Only one edge label is quoted from the material: "HTTP + JSON" (the old chart's own arrow,
// and the blockquote's JSON answer). The two inside the client are the connector verbs the
// prose implies — the device "collects input" before the business layer sees it, and the
// business layer "requests" from the data layer — stated here rather than invented silently.
//
// The server band keeps the pattern's default accent: the accent marks the far end of the
// chain, which is where the three client layers point.
export default {
  id: '06',
  slide: 'General Architecture of a Mobile App',
  pattern: 'flow',
  alt:
    'The client–server chain: the presentation layer passes input to the business layer, the ' +
    'business layer requests from the data layer, and the data layer reaches the server over ' +
    'HTTP with JSON; the server holds the REST API, the database, and authentication.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Presentation', note: 'components, layout, navigation' },
      { label: 'Business', note: 'validation, state' },
      { label: 'Data', note: 'REST client, local storage' },
      { label: 'Server', note: 'REST API, database, authentication', tone: 'acc' },
    ],
    edges: ['input', 'requests', 'HTTP + JSON'],
  },
}
