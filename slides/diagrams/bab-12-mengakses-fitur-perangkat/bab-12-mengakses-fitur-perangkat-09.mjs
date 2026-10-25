// Chapter 12 — Accessing Device Features · diagram 09
// Slide 33, "The Other Side: The Attendance Data Privacy Dilemma".
//
// This slide is an argument in one direction, and its first two bullets already spell
// the chain out: the attendance record "combines a student's face, location, and
// presence time", and "from those three points, a picture of 'where and when' someone
// was can be reconstructed". The blockquote closes it: a solution meant to protect
// academic integrity "turns into a surveillance tool that creates new problems". Cause
// → consequence → condition is a chain, so the pattern is `flow`.
//
// `beforeAfter` was the other candidate (diagrams 07 and 08 use it) and it is wrong
// here: this slide does not hold two models side by side, it holds one progression. It
// also would have left the three remaining bullets — the risk-limiting practices —
// sitting beside a picture that has nowhere to put them. As drawn, the slide does the
// teaching job cleanly: the picture is the risk, the bullets under it are the
// counter-measures. That division of labour is worth the whitespace (the flow canvas is
// fixed at 199px and this slide can afford 286px after the trim).
//
// The three stage labels are the slide's words: "Attendance data" (bullet 1), "where
// and when" (bullet 2, unquoted so it reads as a stage), "surveillance tool" (the
// blockquote). The notes under them are one clause each: "face, location, and presence
// time" is bullet 1's list, kept with its comma and its "and" so the picture quotes the
// slide instead of abbreviating it; "reconstructed" is bullet 2's verb; "without these
// practices" is the blockquote's condition. The two edges are the slide's own verbs —
// "combines" (bullet 1) and "turns into" (blockquote).
//
// The last stage is `red`, not the default accent: the accent marks the stage that
// matters, and this one matters because it is the failure mode.
//
// Bullets 1 and 2 moved into the notes verbatim (the flow draws exactly them). Bullets
// 3–5 — honest permission, data minimization, one coordinate instead of a track,
// retention — stay on the slide: the picture shows none of them, and they are the
// answer the slide exists to give.
export default {
  id: '09',
  slide: 'The Other Side: The Attendance Data Privacy Dilemma',
  pattern: 'flow',
  alt:
    'Attendance data — a student\'s face, location and presence time — combines into a ' +
    'reconstruction of where and when someone was; without these practices it turns into ' +
    'a surveillance tool.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Attendance data', note: 'face, location, and presence time' },
      { label: 'Where and when', note: 'reconstructed' },
      { label: 'Surveillance tool', note: 'without these practices', tone: 'red' },
    ],
    edges: ['combines', 'turns into'],
  },
}
