// Chapter 13 — Authentication and Application Security · diagram 14
// The slide argues by escalation, in its own words: code "is bundled into files and can be taken
// apart from the APK", and "once one user takes the application apart, every user is at risk".
// Code → one user → every user is a chain, so `flow`, and the accent is red on the last stage
// because it is a failure state, not a step forward.
//
// `beforeAfter` was the obvious alternative — client may hold X, server must hold Y — but this is
// the third panel-shaped picture in a row on this deck (13 is a chain, 15 and 04 are panels), and
// the escalation is the one thing a panel cannot draw: the risk grows *because* it moves from one
// device to everybody. So the rule itself stays on the slide as prose (bullets 2 and 4), and the
// picture draws the reason the rule exists.
//
// Trimming: bullet 1 is stage 1 plus the first arrow, and bullet 3 is stages 2–3 plus the second
// arrow, so both moved verbatim into the notes. What stays is bullet 2 (where keys are allowed to
// live — no stage says this) and bullet 4 (the one thing the client may store, and where). The
// count stays at two, which is the floor.
//
// Labels: "Bundled JavaScript", "One user", "Every user" and "at risk" are the slide's words. The
// arrow labels are authored compressions: `taken apart` is the slide's own verb phrase, `one leak`
// is the mechanism the slide names only as "at risk" — it is on the picture because without it the
// second arrow would have no content. Stage 2 carries no note on purpose: the user is the pivot,
// not a place.
export default {
  id: '14',
  slide: 'Principle 2: No Secret Key in the Application',
  pattern: 'flow',
  alt:
    'Bundled JavaScript inside the APK can be taken apart by one user, and one leak puts every ' +
    'user at risk.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Bundled JavaScript', note: 'inside the APK' },
      { label: 'One user' },
      { label: 'Every user', note: 'at risk', tone: 'red' },
    ],
    edges: ['taken apart', 'one leak'],
  },
}
