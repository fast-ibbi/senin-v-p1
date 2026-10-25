// Chapter 10 — REST API and Backend Integration · diagram 03
// Replaces the old Mermaid chart (bab-10-…-03.mmd), a decision tree with a "did the
// request succeed?" diamond and three outcomes. The content is modes the screen sits in
// plus the events that change them, so the pattern is `stateMachine`, not `tree`:
// nothing here *contains* anything, and the error state has a way out, which a tree
// cannot draw.
//
// The three states are the slide's own title, and their names are the ones the chapter
// uses on the next two slides ("Loading and Error State", "Empty State and Pull-to-
// Refresh") and in Summary (2/2): "loading, error with an action, and an empty state
// that explains". `initial` puts the entry dot on loading, because the screen is in
// that mode while the request is in flight.
//
// Content decision — the fourth branch is missing on purpose. The legacy chart's
// fourth node ("Daftar tampil / FlatList", the list showing data) is the happy path,
// not one of the three interface states. Adding it as a fourth state puts two arcs out
// of `loading` (to empty and to error); the kit routes both at the same bow, so the two
// curves lie within 1–2px of each other for half their length and the picture reads as
// one line with two arrowheads. Three states is the readable form of this branch.
//
// Transition "try again" is the one invented label: the chapter says the error state
// needs "an action" and must "give a way out, not a dead end" (slide 25), and the
// legacy chart named it "Coba Lagi". The build reports it, plus every state name,
// because this slide carries a heading and a picture and no prose at all.
export default {
  id: '03',
  slide: 'The Three Interface States',
  pattern: 'stateMachine',
  alt:
    'Three interface states and how the screen moves between them: loading can end in the ' +
    'empty state when the request returns no data, or in the error state on a network ' +
    'failure or a 4xx/5xx status; the error state returns to loading when the user tries ' +
    'again. The normal case — the list showing data — is not one of the three states.',
  imgWidth: 1120,
  data: {
    initial: 'loading',
    states: [
      { id: 'loading', label: 'loading' },
      { id: 'empty', label: 'empty state' },
      { id: 'error', label: 'error state', tone: 'red' },
    ],
    transitions: [
      { from: 'loading', to: 'empty', label: 'no data' },
      { from: 'loading', to: 'error', label: '4xx / 5xx', tone: 'red' },
      { from: 'error', to: 'loading', label: 'try again' },
    ],
  },
}
