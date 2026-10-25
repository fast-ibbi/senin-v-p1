// Chapter 15 — Build and Deployment · diagram 13
// A new picture (no legacy chart at this id). The slide's own presenter notes state the shape
// to draw: "Read this table as a ladder from most private to most public: each step down adds
// testers and reduces speed." Four rungs in a fixed order with a named gate between each pair is
// `flow` — the order is the content, and a table's rows cannot show which way the ladder points
// or what lets the next audience in.
//
// `layers` was the alternative (a vertical ladder, production on top). It lost because bands
// carry one line each: it would have duplicated the table's rows without being able to name the
// three gates, which is the only thing the picture adds to the table underneath it.
//
// Every label is on the slide:
//   stage labels — the table's "Track" column
//   stage notes  — the table's "Who receives it" column, verbatim
//   edge labels  — the gate that lets the next audience in, taken from the "Note" column:
//                  "testers invited through a link" → invited, "anyone who signs up as a tester"
//                  → signs up, "passing through Google review" → Google review
// The arrows are short because `flow` gives a 100px gap between four stages; the long forms live
// in the table and in these notes.
//
// The last stage keeps the accent (production is where the ladder ends). Nothing is trimmed:
// the slide keeps both bullets, and neither one is duplicated here — the picture lists the four
// track names but never says what a "track" is, which is exactly what bullet 2 defines.
//
// Two measured layout decisions hold this slide up, and neither one changes a font size:
//
// 1. The image line sits BELOW the table, not under the heading like every other picture in this
//    deck. The slide is a heading, two definition bullets and a five-row table, and the table's
//    235px leave only ~213px of slide below it. Inserted under the heading, the table is pushed
//    down until its last row lands on the page-number band — measured ink y604–623 and y607–626
//    in two layouts against the number at y623–635, i.e. the number drawn inside the last row.
//    Below the table the last ink on the slide is this picture's note row at y605, clear of the
//    number at y623–635. The build finds and keeps an existing image line wherever it sits, so
//    this placement survives rebuilds.
// 2. `canvas: [1160, 160]` is the 160-unit floor: the flow reserves a 44px note row for two
//    lines and these notes are one line each, so the auto 184px carried 24 units of dead space
//    into a slide that has none to spare. 160px leaves the picture's last ink at y605.
//
// Honest limit: the four track names appear twice on this slide — in the table and in the chips.
// That is unavoidable when the picture *is* the table's order; what the picture adds is the
// direction of the ladder and the three gates, which the table's rows cannot show.
export default {
  id: '13',
  slide: 'Google Play: Four Release Tracks',
  pattern: 'flow',
  alt:
    'The Play release ladder from most private to most public: internal testing, at most 100 ' +
    'registered testers; closed testing, testers invited through a link; open testing, anyone who ' +
    'signs up as a tester; production, all users, passing through Google review.',
  imgWidth: 1120,
  data: {
    // Floor height, for the measured reason recorded in point 2 of the header comment.
    canvas: [1160, 160],
    steps: [
      { label: 'internal testing', note: 'at most 100 registered testers' },
      { label: 'closed testing', note: 'testers invited through a link' },
      { label: 'open testing', note: 'anyone who signs up as a tester' },
      { label: 'production', note: 'all users', tone: 'acc' },
    ],
    edges: ['invited', 'signs up', 'Google review'],
  },
}
