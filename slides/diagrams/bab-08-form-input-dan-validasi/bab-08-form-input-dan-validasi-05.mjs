// Chapter 8 — Forms, Input, and Validation · diagram 05
// New picture; this slide had none. The slide opens the chapter with four costs of bad
// data, and each cost is a two-part sentence: a concrete typo on the left of the arrow,
// who pays on the right. That is `beforeAfter`'s shape — two panels whose rows answer
// each other — not a list, so the rows are laid out as matched pairs.
//
// Only the first two rows are drawn. A third row is a hard height decision, not a
// preference: at `w:1120` a three-row `beforeAfter` is 270px on the slide, and this
// slide has 181px of slack under its blockquote. Two rows (235px) fit once the two
// bullets the picture duplicates are trimmed into the presenter notes; three rows would
// need a third bullet trimmed, and this slide has four, so the kit's rule "keep at
// least two bullets" would break. The NIM row therefore stays on the slide as a bullet
// and is deliberately absent here — a bullet the picture does not show must not move.
//
// Labels are the slide's own words, split at the arrow the bullets already print:
// "A misspelled email → academic information does not reach the student" and
// "A phone number short of digits → the academic advisor cannot reach the parents".
// Left is `red` because it is the mistake; right is `acc` because the cost is what the
// chapter is asking the student to see. Neither panel is "the wrong model" — the two
// halves are cause and price, which is why the numbers read as a pair rather than as
// alternatives.
export default {
  id: '05',
  slide: 'Data yang Salah Masuk Adalah Biaya',
  pattern: 'beforeAfter',
  alt:
    'Each typo and its price, in two matched rows: a misspelled email means academic ' +
    'information does not reach the student; a phone number short of digits means the ' +
    'academic advisor cannot reach the parents.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'BAD DATA',
      tone: 'red',
      items: ['A misspelled email', 'A phone number short of digits'],
    },
    right: {
      title: 'THE COST',
      tone: 'acc',
      items: [
        'Academic information does not reach the student',
        'The academic advisor cannot reach the parents',
      ],
    },
  },
}
