// Chapter 13 — Authentication and Application Security · diagram 12
// The slide's fourth bullet is one sentence with a switch inside it: "The redirect page
// `app/index.js` decides the direction based on authentication status." That is one decision
// point with three outcomes, which is containment, so `tree` — the root is the decider and each
// branch is a status with the thing it renders. `stateMachine` was the other candidate and was
// rejected: a mode diagram draws *movement* between states, and this slide is not about how the
// application moves from one status to another, it is about where each status sends the user.
//
// The picture does not repeat `beforeAfter` 04, which already occupies the client-layer /
// server-layer comparison. What no other picture in this chapter shows is the direction table
// itself, and that is what bullet 4 states, so bullet 4 moved verbatim into the notes.
//
// Labels: the root and `memuat` are the slide's own words; `masuk` and `keluar` are the other two
// values of the same status, read from the route-group layout that the next slide shows in full
// (`if (status === 'memuat') … if (status === 'keluar') … return <Stack />`). They are code
// identifiers, not invented participants, and the deck already uses them in that code.
// `loading indicator` and `Redirect /login` are the outputs the slide names; `the Stack` is what
// the layout returns for `masuk`.
export default {
  id: '12',
  slide: 'Protected Route Mengatur Tampilan, Bukan Mengunci Data',
  pattern: 'tree',
  alt:
    'The redirect page app/index.js decides by authentication status: while memuat it shows a ' +
    'loading indicator, when masuk it renders the Stack, when keluar it Redirects to /login.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'app/index.js',
      children: [
        { label: 'memuat', children: [{ label: 'loading indicator' }] },
        { label: 'masuk', children: [{ label: 'the Stack' }] },
        { label: 'keluar', children: [{ label: 'Redirect /login' }] },
      ],
    },
  },
}
