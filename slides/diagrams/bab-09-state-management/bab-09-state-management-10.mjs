// Chapter 9 — State Management · diagram 10
// Slide 21, "Designing the Cart State". No legacy chart.
//
// The slide is five design questions and the picture answers the first three of them, which is
// why those three bullets moved into the presenter notes: what is stored (the item list and its
// four fields), what operations are needed (add, decrease, remove, empty), and what is computed
// rather than stored (jumlahItem, totalHarga). The remaining two questions stay on the slide
// because no pattern can draw them: where the state lives is slide 27's provider tree, and
// "still in memory, TODO Chapter 11" is a plan, not a structure.
//
// The pattern is `tree`, because the relationship is containment: everything in the picture
// hangs off one cart state object. It is literally the `value` the provider publishes — one
// object with these keys (slide 24: `{ items, tambahItem, kurangiItem, hapusItem, jumlahItem,
// totalHarga }`), grouped here into the three roles the design questions ask about. A `flow`
// would have claimed an order these three do not have; `beforeAfter` would have split them into
// two columns and left the third out.
//
// The four field chips are the record's own fields, not four invented concepts: the slide's
// first bullet spells them `{ id, nama, harga, qty }` and they are in the notes verbatim. They
// also solve two kit facts at once. The kit's canvas is always 1160 wide and its tree puts
// grandchildren at x=710, so a three-leaf tree inks only the left half of the canvas and reads
// as a small, left-hugging picture; and a parent with a *single* child gets a zero-height
// elbow, which would put "items" and its field on one y and read as siblings. Four grandchildren
// fill the canvas and give "items" a visible fan-out.
//
// The root is "Cart state", not "CartProvider": the provider is question 4's answer and it stays
// on the slide as prose, and diagram 04 already uses CartProvider as a tree root for a different
// question (which routes sit inside its scope). Same deck, same word, two pictures that must not
// look like the same picture.
//
// The accent sits on the computed branch. That is the distinction this chapter keeps repeating
// (slide 15, slide 17, slide 23, the quiz, the summary): derived values are computed from items,
// not stored beside them, so the one child that is not data has to be visible as such.
//
// Labels use commas rather than the deck's mid-dots: at 16px in a 300-unit chip the dotted form
// wraps onto a line starting with "· empty", which reads as a stray mark rather than a list.
export default {
  id: '10',
  slide: 'Designing the Cart State',
  pattern: 'tree',
  alt:
    'The cart state split into three parts: the stored item list, whose fields are id, nama, harga ' +
    'and qty; the operations add, decrease, remove and empty; and the values computed from the ' +
    'items rather than stored, jumlahItem and totalHarga.',
  imgWidth: 1000,
  data: {
    root: {
      label: 'Cart state',
      children: [
        {
          label: 'items',
          children: [
            { label: 'id' },
            { label: 'nama' },
            { label: 'harga' },
            { label: 'qty' },
          ],
        },
        { label: 'operations: add, decrease, remove, empty' },
        { label: 'computed, not stored: jumlahItem, totalHarga', tone: 'acc' },
      ],
    },
  },
}
