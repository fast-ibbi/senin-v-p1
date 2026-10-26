// Chapter 1 — Introduction to Mobile Programming · diagram 14
// Slide 24, "When Is React Native the Right Fit?". No legacy chart.
//
// Four bullets, and three of them answer one question in two directions: what RN is good
// for (interface- and data-rich apps; business apps, e-commerce, services, information
// systems) and what it is not (3D games and video editors, still better written natively).
// That is two mental models side by side — `beforeAfter`. The fourth bullet is a method
// statement ("the decision is made through trade-off analysis, not because of trends"),
// not a member of either column, so it stays in the prose and out of the picture.
//
// Panel titles are the slide's own words: "right fit" from the heading, "better written
// natively" from the third bullet. Nothing is added.
//
// Two rows on each side, and that is why the right panel is not the one-chip column it
// started as: the first bullet splits cleanly across the two panels — "interface- and
// data-rich apps" is what RN is for, "not heavyweight graphics rendering" is what belongs
// on the native side — so the picture carries that sentence as a matched pair of rows
// instead of leaving half a panel empty. patterns.md: matched row counts read best.
//
// Tones: `acc` on the fit side (that is the answer the slide is arguing for), `amber` on
// the native side — amber rather than red because writing a 3D game natively is not a
// mistake, it is the correct call for that project.
//
// Trimmed: bullets 1 and 2 moved verbatim into the presenter notes — they are rows 1 and 2
// of the left panel. Bullets 3 and 4 stay. Rule four requires two bullets to remain, and of
// the two survivors bullet 4 must stay (the picture does not carry a method), so bullet 3 is
// the one that stays while its twin sits in the right panel. That repetition is accepted
// deliberately: the right panel is a single chip, and the sentence is the slide's only
// "do not do this" — the one line a student should still be reading when the picture is on
// screen. The arrow-free layout means no direction is asserted between the two sides.
export default {
  id: '14',
  slide: 'Kapan React Native Tepat Dipakai?',
  pattern: 'beforeAfter',
  alt:
    'Two sides of the fit test. Right fit: interface- and data-rich apps, and business ' +
    'apps, e-commerce, services and information systems. Better written natively: ' +
    'heavyweight graphics rendering, and 3D games and video editors.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'RIGHT FIT',
      tone: 'acc',
      items: ['Interface- and data-rich apps', 'Business apps, e-commerce, services, and information systems'],
    },
    right: {
      title: 'BETTER WRITTEN NATIVELY',
      tone: 'amber',
      items: ['Heavyweight graphics rendering', '3D games and video editors'],
    },
  },
}
