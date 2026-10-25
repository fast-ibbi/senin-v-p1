// Chapter 1 — Introduction to Mobile Programming · diagram 10
// Slide 15, "Fragmentation vs Consistency". No legacy chart. (The chapter README used to
// say this slide should stay text because its two lists already read as parallel columns —
// this pass overrides that: the columns are the consequence lists, and the picture is what
// lets one of them leave the slide.)
//
// The panels are titled with the slide's own two sub-headings, "Consequences for Android"
// and "Consequences for iOS", verbatim, so the picture adds no claim the slide does not
// make. The Android side is reordered so the three rows answer each other:
//   1 behaviour varies across phones      ↔ behaviour is predictable
//   2 must be tested on many devices      ↔ high device and developer entry cost
//   3 distribution also outside a store   ↔ the rules are stricter
// The last row is the one that turns this picture into part of the chapter's argument:
// loose distribution on one side, strict review on the other, which is what pushes a team
// toward one codebase for both.
//
// Tone: `amber` on Android marks the friction the slide names with its "but … fragmentation"
// — it is not a verdict that Android is the wrong platform (the blockquote above the picture
// says it holds the majority of the market). `acc` on iOS marks the predictable side, again
// not a recommendation: its own costs are in the room.
//
// Trimmed: all three Android bullets moved verbatim into the notes; the picture's left
// panel states each of them. The iOS column stays on the slide, one bullet per pair of
// rows, because the picture splits that bullet's second clause ("… the rules are stricter")
// into a row of its own.
export default {
  id: '10',
  slide: 'Fragmentation vs Consistency',
  pattern: 'beforeAfter',
  alt:
    'Consequences of the two platforms on paired rows: on Android behaviour can differ from ' +
    'phone to phone, the app must be tested on a variety of devices, and distribution is not ' +
    'always through a store; on iOS behaviour is predictable, developer and device entry ' +
    'costs are relatively high, and the rules are stricter.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'Consequences for Android',
      tone: 'amber',
      items: [
        'Behavior can differ from phone to phone',
        'The app must be tested on a variety of devices',
        'Distribution is not always through a store (APK files)',
      ],
    },
    right: {
      title: 'Consequences for iOS',
      tone: 'acc',
      items: [
        'App behavior is predictable',
        'Developer and device entry costs are relatively high',
        'The rules are stricter',
      ],
    },
  },
}
