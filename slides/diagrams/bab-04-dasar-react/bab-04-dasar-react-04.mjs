// Chapter 4 — React Fundamentals · diagram 04
// Replaces the old Mermaid chart (bab-04-dasar-react-04.mmd) and the hand-drawn five-panel
// pipeline the chapter-build script used to emit at this path: user tap → onClick handler
// → state setter → re-render → new screen.
//
// Pattern: `sequence`, not `flow`, for two reasons. (1) The three stages belong to three
// different participants — the user, the component, and React — and this slide's own
// question is who produces the new screen: "Why can the screen not change without a
// setter? (React only knows state has changed if the setter is called.)" A sequence keeps
// the participants visible as lifelines; a flow would show the order and hide the actor.
// (2) `flow` already carries the lifecycle on diagram 03, and the deck-pass rule allows no
// pattern to hold more than half a chapter's diagrams.
//
// Nothing new is invented: the four labels are the slide's own vocabulary — "tap",
// "onClick handler" (the slide's central sentence is what is handed to onClick), "setter",
// "re-render". The self-call is the handler running inside the component, which is why the
// tap does not move a cursor by itself.
export default {
  id: '04',
  slide: 'The Event Flow: One Tap, One Re-render',
  pattern: 'sequence',
  alt:
    'One tap, one re-render: the user taps, the component runs its onClick handler, the ' +
    'handler calls the setter, and React re-renders the component. The screen is only ever ' +
    'changed by a re-render, never by touching it directly.',
  imgWidth: 1120,
  data: {
    actors: ['User', 'Component', 'React'],
    messages: [
      { from: 'User', to: 'Component', label: 'tap' },
      { from: 'Component', to: 'Component', label: 'onClick handler' },
      { from: 'Component', to: 'React', label: 'setter called' },
      { from: 'React', to: 'Component', label: 're-render', tone: 'acc' },
    ],
  },
}
