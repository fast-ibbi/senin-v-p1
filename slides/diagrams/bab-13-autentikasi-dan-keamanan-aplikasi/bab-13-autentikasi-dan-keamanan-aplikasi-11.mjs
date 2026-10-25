// Chapter 13 — Authentication and Application Security · diagram 11
// The slide's price is an absence: the server keeps no list, so a stolen token stays valid
// until `exp`. An absence cannot be drawn as a chain, so the picture draws the mechanism the
// slide answers with — the short-lived access token, the long-lived refresh token, and the new
// access token that comes back without another login. That is `flow`; the edge verb `exp` is
// what ends the first stage, and `issues` is the slide's own word for what the refresh token
// does.
//
// The first bullet (no list of revoked tokens, a stolen token valid until `exp`) and the last
// (the refresh token only needs to be understood as a general picture; its implementation is
// in the Challenge) stay on the slide: the first is the price itself, the second is the
// course's scope, and no stage can hold either. The middle two bullets — the 15 minutes to 1
// hour lifetime, and the refresh token issuing a new access token — are the three stages and
// the two arrows, so they moved into the notes.
//
// `stateMachine` was considered and rejected: the sequence has no branch and no return, so a
// row of modes would only decorate a straight line (see references/patterns.md).
export default {
  id: '11',
  slide: 'The Price of Stateless: Revocation Is Hard',
  pattern: 'flow',
  alt:
    'An access token lives 15 minutes to 1 hour; at exp a long-lived refresh token issues a new ' +
    'access token without logging in again.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Access token', note: '15 minutes to 1 hour' },
      { label: 'Refresh token', note: 'long-lived' },
      { label: 'New access token', note: 'without logging in again', tone: 'acc' },
    ],
    edges: ['exp', 'issues'],
  },
}
