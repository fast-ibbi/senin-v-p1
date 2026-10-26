// Chapter 8 — Forms, Input, and Validation · diagram 10
// New picture; this slide had none. The slide is four bullets, and every bullet is
// written as a pair: the principle in bold, then a dash, then the form it takes on the
// screen. That dash is the relationship — a named rule on the left, its concrete
// appearance on the right — which is `beforeAfter`'s shape (matched rows), not a list
// of peers. The rows are therefore the four bullets, split at the dash the slide
// already prints.
//
// Two bullets are trimmed into the presenter notes under "Trimmed to the picture": the
// picture restates both of them, and the slide cannot hold a four-row picture plus four
// bullets plus its blockquote — at four bullets the blockquote ran off the bottom of the
// page. Two bullets stay because the kit's rule is "keep at least two", and the two kept
// are the ones the blockquote and the class discussion lean on: "specific and close to
// the field" and "two signals at once", the principle the blockquote continues from.
// The picture still draws all four, so the trimmed pair is not lost — it is one row
// higher up.
//
// Tones: `acc` on the principle, `neutral` on its appearance — neither column is a
// mistake, so the default red/acc pairing would say "never do this", which the slide
// does not. It is a rule and what the rule looks like.
export default {
  id: '10',
  slide: 'Pesan Error: Spesifik, Dekat, Dua Sinyal',
  pattern: 'beforeAfter',
  alt:
    'Four error-message principles and the form each takes: specific and close to the ' +
    'field shows the expected format as an example; two signals at once means a red ' +
    'border and the message text; consistent and brief means short sentences without ' +
    'exclamation marks; the value is not cleared, so the user only fixes the wrong part.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'PRINCIPLE',
      tone: 'acc',
      items: [
        'Specific and close to the field',
        'Two signals at once',
        'Consistent and brief',
        'The value is not cleared',
      ],
    },
    right: {
      title: 'ON THE SCREEN',
      tone: 'neutral',
      items: [
        '"Invalid email format (example: …)"',
        'A red border and the message text',
        'Short sentences, without excessive exclamation marks',
        'The user only fixes the part that is wrong',
      ],
    },
  },
}
