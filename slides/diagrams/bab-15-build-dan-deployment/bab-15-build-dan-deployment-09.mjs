// Chapter 15 — Build and Deployment · diagram 09
// A new picture (no legacy chart at this id). The slide's heading is the claim ("Permanent
// Once Published") and its last two bullets are the mechanism: once published the ID may
// not be changed — the store considers it a new app — and the old users and reviews vanish
// with the old ID. That is one consequence following another, so the pattern is `flow`.
//
// `stateMachine` was the other candidate and was rejected on its own merits: three states in
// a row with two forward edges and no branch and no return is a straight line, and
// patterns.md says a straight line belongs in `flow`. Drawing it as a state machine would
// have bought pattern variety and nothing a student can see.
//
// The red tone on the last stage is the slide's verdict, not a new one: "it is considered a
// new app", and the loss of users and reviews is the cost. The slide's first three bullets
// (the identity itself and the reverse-domain writing rules) are how the ID is written, not
// what happens to it, so they stay on the slide — the picture quotes the reverse-domain
// example instead of restating the rule.
//
// Every label is a substring of the slide: "ac.id.univ + mahasiswa", "the ID may not be
// changed", "a new app", "old users and reviews seem to vanish". The two edge verbs are the
// slide's own words as well ("Once published", "may not be changed").
export default {
  id: '09',
  slide: 'Application ID: Sekali Terbit, Tidak Bisa Diganti',
  pattern: 'flow',
  alt:
    'Why the application ID is permanent: the reverse-domain ID goes live when it is ' +
    'published, it may not be changed once published, and changing it makes the store treat ' +
    'the app as a new app whose old users and reviews vanish.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Application ID', note: 'ac.id.univ + mahasiswa' },
      { label: 'Published', note: 'the ID may not be changed' },
      { label: 'A new app', note: 'old users and reviews seem to vanish', tone: 'red' },
    ],
    edges: ['publish', 'changed'],
  },
}
