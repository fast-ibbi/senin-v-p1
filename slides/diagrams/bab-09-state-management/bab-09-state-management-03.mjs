// Chapter 9 — State Management · diagram 03
// Replaces the old Mermaid chart (bab-09-state-management-03.mmd), which was four
// boxes joined by unlabelled arrows. The slide calls this a hierarchy and its notes
// say "read this ladder from left to right … simple to complex", so the pattern is
// `flow`, not `layers`: these levels do not sit on one another, you climb them.
//
// The Mermaid chart had no arrow labels; the three signals here come from the
// chapter's own reasoning: a new reader (slide 7's notes — "one store, many
// readers" — which is what the blockquote's "climb only when there is a new user"
// means; "new user" on an arrow would read as an app user, so the chapter's other
// word is used), prop drilling (the limit of lifting, the slide before this one),
// and large scale (the summary's "Zustand and Redux are for large scale").
//
// Each note states the scope the level serves, not a second sentence, so the notes
// under the chips read as one axis: mechanism → the scope it covers.
//
// The accent sits on the FIRST rung, not the last one. `flow` accents the final stage
// by default, which here would glow on "State management library" and undo the slide:
// its notes exist to kill "professional apps always use Redux", and the blockquote says
// stop at the simplest level. The last stage is therefore neutralised explicitly and
// `Local state` is tinted instead — the default you should only leave when forced.
export default {
  id: '03',
  slide: 'State Decision Hierarchy',
  pattern: 'flow',
  alt:
    'The state decision ladder, simplest first: local state for one component, lifting state up ' +
    'to a shared parent, the Context API across screens, and a state management library such as ' +
    'Zustand or Redux Toolkit for large scale. Climb only when the level below no longer covers ' +
    'the new consumer.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Local state', note: 'one component', tone: 'acc' },
      { label: 'Lifting state up', note: 'one shared parent' },
      { label: 'Context API', note: 'across screens' },
      { label: 'State management library', note: 'Zustand · Redux Toolkit', tone: 'neutral' },
    ],
    edges: ['new reader', 'prop drilling', 'large scale'],
  },
}
