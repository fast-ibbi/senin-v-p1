// Chapter 6 — Building a Mobile User Interface · diagram 12
// New picture. The consistency slide names two item patterns in one bullet — one line
// (title only) and two lines (title on top, small caption below) — and then says which
// one this app uses. Two patterns held side by side with the app's choice spelled out is
// `beforeAfter`; a `layers` stack would claim the two lines sit on top of the one line,
// which the slide never says.
//
// Both panels are `tone`-explicit: neither pattern is wrong, so leaving the default would
// paint the one-line pattern red and read as a verdict the slide does not make. The accent
// sits on the two-line panel because that is the pattern "our app uses".
//
// The three rows on the right are the slide's own words, in the slide's own order; the
// left panel has one row because the slide says one thing about the one-line pattern.
// Uneven row counts are deliberate: padding the left to three rows would be writing content
// the slide does not have.
export default {
  id: '12',
  slide: 'Item Seragam Membuat Daftar Terasa Tenang',
  pattern: 'beforeAfter',
  alt:
    'Two list item patterns: the one-line pattern carries a title only; the two-line pattern ' +
    'puts the title on top with a small caption below, which is what our app uses — student ' +
    'name, then NIM–cohort.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'ONE-LINE PATTERN',
      tone: 'neutral',
      items: ['Title only'],
    },
    right: {
      title: 'TWO-LINE PATTERN',
      tone: 'acc',
      items: ['Title on top', 'Small caption below', 'Student name, then NIM–cohort'],
    },
  },
}
