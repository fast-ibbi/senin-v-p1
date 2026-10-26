// Chapter 6 — Building a Mobile User Interface · diagram 10
// New picture. The Card slide is a rule plus its cost: one card carries one entity, it
// buys a visual boundary while scrolling, and it costs vertical space — uniform data is
// more economical as rows. That is two layouts with different economics, side by side,
// which is `beforeAfter`. A `tree` was the other candidate (a list contains cards, a card
// contains one student) but its elbows would say containment only, and containment is not
// what the trade-off bullet argues.
//
// Only three rows on the left against two on the right, on purpose: the slide's fourth
// bullet (the anatomy — white background, radius 8–12, padding 16) is a fact the picture
// does not show, so it stays on the slide and is deliberately absent here. The right
// panel is thin because the slide says only two things about rows, and inventing a third
// would be writing the lecture for the author.
//
// The accent sits on the card because the card is this slide's subject; the default red
// on the left would read as "the wrong model", and a card is not wrong — it is a choice
// with a price.
export default {
  id: '10',
  slide: 'Satu Kartu Membawa Satu Entitas',
  pattern: 'beforeAfter',
  alt:
    'Card against row: a card carries one entity — one student — and separates entities ' +
    'while scrolling, at the cost of vertical space; a row is more economical for uniform data.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'CARD',
      tone: 'acc',
      items: [
        'One card = one entity',
        'In our app, one student',
        'Separate entities while scrolling',
      ],
    },
    right: {
      title: 'ROW',
      tone: 'neutral',
      items: ['Uniform data', 'More economical as rows'],
    },
  },
}
