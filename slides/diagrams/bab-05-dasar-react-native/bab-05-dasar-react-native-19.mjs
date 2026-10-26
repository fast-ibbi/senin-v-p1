// Chapter 5 — React Native Basics · diagram 19
// The facing `Diagram:` slide (13) draws the *precedence* half of this slide — a later
// style sits above the base style and wins — as a `layers` stack. Nothing in the deck
// draws the other half: the conditional, `aktif && styles.barisAktif`. Drawing that as a
// second `layers` would be picture 13 again, and as a `beforeAfter` it would be the third
// panel pair in four slides.
//
// So this is a `stateMachine`: one row has two visual modes, the two style names the code
// example gives, and the condition that switches it. Two states, one transition each way;
// the entry dot marks the mode a row starts in. Nothing is trimmed — every bullet on the
// slide carries something the picture does not: the array merge order, both code examples,
// and that `null` (not only `false`) is ignored.
// Trimming: nothing could move (see the comment above), so the picture has to earn its
// space in a slide that keeps all five bullets. A natural `stateMachine` canvas is 272
// units — 96 above the chips for the return arc and 66 below them that nothing uses —
// and at w:1120 that put the last bullet's ink at y=623, hard against the page-number
// band, the tightest slide of the pass. The canvas is cut to 200 units (the same trade
// as the `flow` canvas in bab-11-13): nothing is drawn below the chips at y=182, the arc
// still has its 47 units of headroom, and the bullets move 63px clear.
export default {
  id: '19',
  slide: 'Array Style Menggabungkan Gaya Secara Berurutan',
  pattern: 'stateMachine',
  alt:
    'A row starts in the baris style; while aktif holds, the style array adds barisAktif '
    + 'and the row takes that style; once aktif is false the array drops that entry and the '
    + 'row returns to baris.',
  imgWidth: 1120,
  data: {
    canvas: [1160, 200],
    initial: 'baris',
    states: [
      { id: 'baris', label: 'baris', tone: 'neutral' },
      { id: 'barisAktif', label: 'barisAktif', tone: 'acc' },
    ],
    transitions: [
      { from: 'baris', to: 'barisAktif', label: 'aktif', tone: 'acc' },
      { from: 'barisAktif', to: 'baris', label: 'false' },
    ],
  },
}
