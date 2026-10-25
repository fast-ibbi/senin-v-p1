// Chapter 14 — Debugging, Testing, and QA · diagram 02
// Replaces the old Mermaid chart (bab-14-…-02.mmd), which was a `graph TD` with a
// diamond decision node and two labelled edges. The kit has no decision pattern, and
// `flow` cannot branch, so the shape here is `tree`: the test at the root, the branch
// condition at level 1, the conclusion that follows from it at level 2. Nothing is
// invented — the root and the 200-branch are the slide's own words; the failing branch
// and the two side-lists are the network-debugging step from the slide before this one
// (§14.3), which is why they are reported as "not on the slide".
//
// Known tree quirk, accepted here: a level-1 node with a single child gets a zero-height
// elbow, so the condition and its conclusion sit on one y. Beside each other in
// adjacent columns that reads as a chain to the right (condition → conclusion), not as
// two siblings, because siblings are the pair on different rows.
export default {
  id: '02',
  slide: 'Server or App? Decision Flow',
  pattern: 'tree',
  alt:
    'Testing the endpoint first branches two ways: if the endpoint succeeds but the app still ' +
    'fails, the problem is on the app side (code, configuration or address); if the endpoint ' +
    'fails, the problem is on the server (not running, wrong port).',
  imgWidth: 1120,
  data: {
    root: {
      label: 'Testing the endpoint first',
      children: [
        {
          label: 'The endpoint succeeds but the app still fails',
          children: [{ label: 'Problem on the app side: code, config, address', tone: 'red' }],
        },
        {
          label: 'The endpoint fails',
          children: [{ label: 'Problem on the server: not running, wrong port', tone: 'amber' }],
        },
      ],
    },
  },
}
