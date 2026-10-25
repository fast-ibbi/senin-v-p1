// Chapter 14 — Debugging, Testing, and QA · diagram 06
// New picture (the old Mermaid set had no chart here). The "Why This Chapter Exists"
// slide's first two bullets are one causal statement: every new feature adds the chance
// that one change breaks another part, and that condition is called regression. Causal
// chain with named stages is `flow`; the order of the three chips is the teaching.
//
// The chain is a definition chain, not a process: the second arrow is the naming move the
// slide itself makes ("That condition is called regression"). A verb of movement there
// would invent a step — nothing moves from "breaks another part" to "regression", the
// condition only acquires a name — so the edge says what the slide says.
//
// Only the slide's first two bullets are drawn, and both moved into the presenter notes
// verbatim, because the picture now says them in full (New feature + "adds the chance" +
// "One change breaks another part" for bullet 1; "is called" + "Regression" + "a decline in
// quality" for bullet 2). Bullets 3 and 4 stay on the slide: "the team spends its time
// guessing" and the cost comparison are facts the picture does not show.
//
// The middle chip's note, "the old feature was correct before", is not on the slide: it
// compresses the presenter notes' definition ("an old feature that used to be correct
// breaks because of a change somewhere else"), which is the distinction between a
// regression and a new bug. Reported as the one provenance miss.
//
// `tone: 'red'` on the last chip, not the default accent: regression is what the chapter
// exists to fight, and red is this deck's mark for "the problem" (the tree in 02 uses it
// the same way). The first chip stays neutral — a new feature is not the fault.
export default {
  id: '06',
  slide: 'Why This Chapter Exists',
  pattern: 'flow',
  alt:
    'Every new feature adds the chance that one change breaks another part, and that ' +
    'condition is called regression — an old feature that used to be correct now declining ' +
    'in quality.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'New feature' },
      { label: 'One change breaks another part', note: 'the old feature was correct before' },
      { label: 'Regression', note: 'a decline in quality', tone: 'red' },
    ],
    edges: ['adds the chance', 'is called'],
  },
}
