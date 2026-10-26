// Chapter 11 — Local Data Storage · diagram 11
// New picture. Three of the slide's four bullets are peers — a feature list wants an aligned
// list, not a picture — but the first bullet is containment and nothing else on the slide is:
// "The note entity { id, judul, isi, createdAt } following the book's data contract" is one
// object holding four fields. That is the only structure here, so the pattern is `tree`, with
// the four field names exactly as the slide writes them.
//
// Why a flat tree is worth drawing: these four names are the contract the rest of the
// practicum leans on — the list card prints judul and isi, the form edits judul and isi, the
// search compares judul and isi, the route parameter is id, and createdAt is what the list is
// ordered by. The picture is the map the next six slides read against.
//
// One bullet moves VERBATIM to the presenter notes: the entity bullet, which this tree is.
// Its closing clause ("following the book's data contract") is attribution rather than a
// field, so it survives in the note block instead of being drawn as a box that would claim a
// contract is a property of a note. The three remaining bullets — add/edit/delete with a
// confirmation, search by title or content, and the data surviving a restart — are facts the
// tree does not carry, so they stay on the slide.
//
// `tree` renders labels only (a node's `note` is dropped), so nothing here depends on notes.
//
// Width: w:1030, not the deck's usual w:1120. The tree is the tallest picture in the pass —
// four leaf slots at 62 units make a 296-unit canvas — and the slide's three remaining bullets
// plus a two-line blockquote had 305px for it. At w:1120 the picture pushed the blockquote's
// last line into the footer; at w:1030 the 16-unit node labels render at 14.2px effective,
// still above the 13px floor, and the blockquote ends 8px clear. Nothing was shaved off the
// canvas's padding and no font size was touched.
export default {
  id: '11',
  slide: 'Praktikum: Yang Dibangun Pertemuan Ini',
  pattern: 'tree',
  alt:
    'The note entity drawn as containment: one note holds exactly four fields, id, judul, isi ' +
    'and createdAt — the data contract the list, the form and the search all read from.',
  imgWidth: 1030,
  data: {
    root: {
      label: 'The note entity',
      children: [
        { label: 'id' },
        { label: 'judul' },
        { label: 'isi' },
        { label: 'createdAt' },
      ],
    },
  },
}
