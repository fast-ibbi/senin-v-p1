// Chapter 13 — Authentication and Application Security · diagram 10
// Why the server can stay stateless is a three-step procedure with no storage step in it: the
// token arrives, the signature is recomputed from what it carries, and the result is compared.
// That is `flow`, and the accent lands on the outcome with the load-bearing absence written
// under it — no database lookup. The absence is the lesson, so it lives as a note on the last
// stage rather than as a fourth stage: a chain cannot draw something that is not there, and
// inventing a "database" box would draw the opposite.
//
// The first bullet — the signature recomputed from header and payload — is exactly this chain,
// so it moved into the notes. What stays is the phrase "no lookup of a list of valid tokens"
// (the picture shows no lookup, but not what would have been looked up), the secret key and
// `exp` claim (neither is a stage here), and the fact that any server holding the key verifies
// the same token.
//
// Authored labels: the edge verbs `recompute` and `compare`. Everything else is the slide's own
// wording.
export default {
  id: '10',
  slide: 'Kenapa JWT Membuat Server Tidak Menyimpan Apa pun',
  pattern: 'flow',
  alt:
    'The token arrives carrying a header and a payload; the server recomputes the signature with ' +
    'the secret key and compares, so verification finishes with no database lookup.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Token', note: 'header and payload' },
      { label: 'Signature', note: 'with the secret key' },
      { label: 'Verified', note: 'no database lookup', tone: 'acc' },
    ],
    edges: ['recompute', 'compare'],
  },
}
