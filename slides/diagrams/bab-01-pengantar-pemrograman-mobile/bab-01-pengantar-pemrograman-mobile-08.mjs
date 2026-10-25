// Chapter 1 — Introduction to Mobile Programming · diagram 08
// Slide 8, "Four Approaches (1): Native & Web Mobile". No legacy chart.
//
// Two approaches, and the slide describes each in the same three beats — what you write,
// what you get, what it costs. `beforeAfter` is the pattern for two mental models in
// parallel rows; a `layers` reading (native above web) would claim a hierarchy the slide
// does not make: these are alternatives, not strata.
//
// Two rows, not three, and that is a teaching decision, not a space one. The picture takes
// the two axes the slide's own columns state as labels —
//   1 what it is made with   the platform's official tools   ↔ a website opened in a browser
//   2 what it costs to ship  a codebase per platform         ↔ one codebase, no gatekeeping
// — and leaves the middle axis (performance and device access) to the two bullets that
// stay on the slide. That way no bullet below the picture is a cell inside it: the slide
// reads once, not twice. A three-row mirror was built first and read as the same five
// sentences printed twice.
//
// The bottom-right cell is the slide's closing paragraph, not a bullet. It is the only
// place the deck pays for the web side's cheapness, so the picture keeps it.
//
// Tone: the left panel is `neutral`, not the pattern's default red — native is expensive,
// not wrong. `acc` on the right marks the less obvious of the four approaches, which is
// what this slide exists to introduce; it is not a recommendation (Table 1.1, two slides
// later, says no approach wins).
export default {
  id: '08',
  slide: 'Four Approaches (1): Native & Web Mobile',
  pattern: 'beforeAfter',
  alt:
    'Native app against mobile web app on two paired rows. Made with: the platform\u2019s ' +
    'official language and tools (Kotlin/Java, Swift) against a website optimized for small ' +
    'screens and opened through a browser. Costs to ship: one codebase per platform and ' +
    'doubled cost against one codebase, no app store gatekeeping, and updates that take ' +
    'effect immediately.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'NATIVE APP',
      tone: 'neutral',
      items: [
        'The official language and tools of one platform: Kotlin/Java, Swift',
        'Weakness: one codebase per platform, doubled cost',
      ],
    },
    right: {
      title: 'MOBILE WEB APP',
      tone: 'acc',
      items: [
        'A website optimized for small screens, opened through a browser',
        'One codebase, no app store gatekeeping, updates take effect immediately',
      ],
    },
  },
}
