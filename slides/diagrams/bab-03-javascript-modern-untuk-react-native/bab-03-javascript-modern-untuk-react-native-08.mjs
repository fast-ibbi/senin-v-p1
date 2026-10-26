// Chapter 3 — Modern JavaScript for React Native · diagram 08
// New picture: this slide had none. The slide is a five-row table plus two bullets, and the
// audit rule "a spec sheet is already in its clearest form" would normally leave it alone.
// The relationship the table does *not* show is the one every student gets wrong: three
// different methods hang off one array, each hands back a new value of a different shape, and
// the array itself is never touched. That is containment, so `tree` — one source, three
// operations, three results.
//
// Three levels rather than two: with only the root and three method chips, the kit's level
// widths (218 / 300 / 300) leave two thirds of the 1160 canvas empty and the picture reads as
// a left-aligned list. Putting each result one level further right is also the honest reading —
// the result belongs to the method, not to the array.
//
// Kit quirk, deliberate: every level-1 node has exactly one child, so the elbow is zero-height
// and a method sits on the same y as its result. The arrows still point parent → child
// (method → result), so each row reads left to right as "map produces a new array, same length".
// That is the reading the table's "Its result" column gives, in one glance.
//
// `canvas` height is cropped from the pattern's computed 234 to 216: the last node ends at 206,
// so the default leaves a dead band at the bottom of a slide that already carries a table.
// No label moves and no font changes.
//
// Every label here is a verbatim fragment of the slide: the root is bullet 1's "the original
// array" (the invariant), the chips are the table's method column, and the leaves are its
// "Its result" column. Bullet 2 (`find`, `some`, `every`) is not in the picture and stays.
// Nothing was trimmed from this slide.
export default {
  id: '08',
  slide: 'map, filter, reduce: Tiga Cara Mengolah Array',
  pattern: 'tree',
  alt:
    'Containment, not a chain: one array — the original array, unchanged — carries three ' +
    'methods. map turns each element into a new element and gives a new array of the same ' +
    'length; filter keeps the elements that meet a condition and gives a new array, shorter or ' +
    'the same; reduce combines all elements into one value, for example the total GPA.',
  imgWidth: 1120,
  data: {
    canvas: [1160, 216],
    root: {
      label: 'the original array',
      children: [
        { label: 'map', children: [{ label: 'new array, same length' }] },
        { label: 'filter', children: [{ label: 'new array, shorter or the same' }] },
        { label: 'reduce', children: [{ label: 'one value' }] },
      ],
    },
  },
}
