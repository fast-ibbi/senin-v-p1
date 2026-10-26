// Chapter 14 — Debugging, Testing, and QA · diagram 04
// Replaces the old Mermaid chart (bab-14-…-04.mmd), which already drew a loop: bug found
// → fix and retest → the bug becomes a permanent test case → the checklist is rerun every
// release → (catches a regression) → back to the start. A `flow` is one-way and would have
// to drop the closing edge, turning a cycle into a pipeline — the deck audit's explicit
// "skip unless you accept a chain". `stateMachine` is the only pattern in the set that can
// draw the return, so the cycle is drawn as what it is.
//
// Three states, not the Mermaid's four: "fix and retest" is an act, not a mode the team
// returns to, and folding it into the first transition keeps three chips legible at slide
// size. Nothing new is added — the states are the blockquote's "bug that slips through"
// and the notes' "becomes a permanent guard" and "the checklist is reused during release
// preparation".
//
// No `initial` dot: a cycle has no first state, and an entry arrow into the same chip the
// loop returns to would read as two competing starts. The return edge carries the legacy
// chart's own verb, "menangkap regression" → "catches regressions", because a bare timing
// word ("next release") would say when the loop repeats and not why it matters.
export default {
  id: '04',
  slide: 'Checklist yang Hidup Menjadi Penjaga Regresi',
  pattern: 'stateMachine',
  alt:
    'The checklist cycle: a bug that slips through is recorded as a permanent guard, the ' +
    'checklist is reused each release, and the rerun checklist catches regressions, which is ' +
    'why the same bug does not slip through again.',
  imgWidth: 1120,
  data: {
    states: [
      { id: 'slip', label: 'Bug that slips through' },
      { id: 'guard', label: 'Permanent guard', tone: 'acc' },
      { id: 'rerun', label: 'Checklist rerun' },
    ],
    transitions: [
      { from: 'slip', to: 'guard', label: 'recorded' },
      { from: 'guard', to: 'rerun', label: 'reused' },
      { from: 'rerun', to: 'slip', label: 'catches regressions', tone: 'acc' },
    ],
  },
}
