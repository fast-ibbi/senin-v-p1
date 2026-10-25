// Chapter 11 — Local Data Storage · diagram 13
// New picture. The slide is a two-column grid — Problem on the left, Decision on the right —
// so a `beforeAfter` would only redraw the layout the student is already looking at. What the
// grid cannot show is the order the offline-first decision works in, and that order is in the
// decision bullets: the catalog is served from its snapshot while the network is gone, orders
// go into a local queue, and the queue is sent once the connection recovers. A chain in time,
// so the pattern is `flow`.
//
// The first chip is the sales staff, not the network. The presenter note asks for "a company
// story, not a list", and the story starts with the people: staff in areas whose network often
// disappears still see the catalog and still record orders. Starting the chain at "offline"
// would have made the picture a network diagram and lost the who that the case study is about.
//
// The third decision bullet — the sales token in secure storage, not AsyncStorage — is not part
// of that chain (a parallel choice, not a later step), so the picture leaves it alone and the
// bullet stays on the slide. A fifth chip would have claimed the token happens after syncing.
//
// Three bullets move VERBATIM to the presenter notes: "Sales staff visit areas whose network
// often disappears" (chip 1 plus its note), "The catalog is cached with snapshot + timestamp,
// and still shows offline" (chip 2 plus the arrow) and "Orders go into a local queue, sent when
// the connection recovers" (chips 3 and 4). Two stay: "The catalog cannot be read and orders
// cannot be recorded while offline" states what happens WITHOUT the decision — the picture
// shows the opposite, so it must not move — and the token bullet is not in the picture at all.
//
// Provenance: "areas whose network often disappears" joins two verbatim fragments of bullet 1
// ("areas" + "whose network often disappears"); "recorded while offline" is the Problem
// bullet's "orders cannot be recorded while offline" with the decision applied. Every other
// label is the slide's own wording.
export default {
  id: '13',
  slide: 'Case Study: Still Working Without Signal',
  pattern: 'flow',
  alt:
    'The offline-first chain as a company story: sales staff work in areas whose network often ' +
    'disappears, the catalog is still served from its cached snapshot with a timestamp and still ' +
    'shows offline, an order goes into a local queue where it is recorded while offline, and the ' +
    'queue is sent once the connection recovers.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Sales staff', note: 'areas whose network often disappears' },
      { label: 'Catalog', note: 'cached with snapshot + timestamp' },
      { label: 'Local queue', note: 'recorded while offline' },
      { label: 'Sent', note: 'when the connection recovers' },
    ],
    edges: ['still shows offline', 'orders go into', 'connection recovers'],
  },
}
