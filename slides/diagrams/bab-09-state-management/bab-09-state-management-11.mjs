// Chapter 9 — State Management · diagram 11
// Slide 37, "Class Discussion: Where Does the Cart Live?". No legacy chart.
//
// A discussion slide is a prompt plus a rubric, and neither is a relationship — the two panels
// of its grid2 stay exactly as they are. What the slide does contain is one relational sentence,
// the takeaway under it: "A good state design holds up when requirements change: from memory to
// local storage, and then to the server." Three homes, in the order a project climbs them, each
// step forced by a requirement that the one before cannot meet — that is `flow`, and it is the
// scaffold students need to answer the first discussion question ("where should the cart be
// stored, and what is the risk?"). The ladder names the risk on every arrow.
//
// The sentence itself moved into the presenter notes: the picture now says it, and the slide had
// no room for both (the grid2 plus the quote leaves ~107px of a 604px content box, while the
// smallest legible picture on this deck is 184 units, i.e. ~178px at w:1120).
//
// Edge labels: "app closed" is the deck's own words ("making it survive after the app is closed
// is Chapter 11 material" — the Summary's blockquote); "switch devices" is slide 33's note ("so
// that customers switch devices without losing the cart"). The notes under each chip name where
// the chapter teaches that home, which is the deck's habit in the other diagrams and keeps the
// chips to one word each.
//
// No chip is accented. `flow` would put the accent on the last stage, and that would say the
// server is the goal — the opposite of this chapter's discipline ("stop at the simplest level")
// and the opposite of a discussion slide, which must not answer its own question. The accent
// stays on the arrow labels instead, because the requirement change is the point: the design
// holds up when requirements change, not when you start at the top.
export default {
  id: '11',
  slide: 'Diskusi: Di Mana Keranjang Seharusnya Tinggal?',
  pattern: 'flow',
  alt:
    'The cart’s three possible homes in the order a project climbs them: in memory for this ' +
    'chapter, local storage in Chapter 11 once the cart has to survive the app being closed, and ' +
    'the server in Chapter 10 once the cart has to move between devices.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'In memory', note: 'this chapter' },
      { label: 'Local storage', note: 'Chapter 11' },
      { label: 'Server', note: 'Chapter 10', tone: 'neutral' },
    ],
    edges: ['app closed', 'switch devices'],
  },
}
