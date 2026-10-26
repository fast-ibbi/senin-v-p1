// Chapter 4 — React Fundamentals · diagram 03
// Replaces the old Mermaid chart (bab-04-dasar-react-03.mmd): a three-node chain
// Mount → Update → Unmount whose two edges were the events that move the component
// between stages. The event wording survives the translation as "dependency changes"
// and "component removed".
//
// Pattern: `flow`. The lifecycle is a one-way chain with exactly two hand-over points,
// which is what `flow` shows and what `stateMachine` would over-draw here: three modes in
// a row with no branch and no return is the case the kit's own guidance sends to `flow`.
//
// The notes under each stage are the effect's behaviour at that stage, not a second
// sentence about the stage: they come from this slide's presenter notes on cleanup
// (cleanup runs before an effect re-runs, and again when the component is removed).
export default {
  id: '03',
  slide: 'Siklus Hidup: Mount, Update, Unmount',
  pattern: 'flow',
  alt:
    'The component lifecycle as a chain: on mount the effect runs once, when a dependency ' +
    'changes the cleanup runs and then the effect again, and when the component is removed ' +
    'the final cleanup runs.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Mount', note: 'effect runs once' },
      { label: 'Update', note: 'cleanup, then the effect' },
      { label: 'Unmount', note: 'final cleanup runs' }, // last stage takes the accent by default
    ],
    edges: ['dependency changes', 'component removed'],
  },
}
