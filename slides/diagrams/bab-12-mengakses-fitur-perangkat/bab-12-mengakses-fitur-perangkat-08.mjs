// Chapter 12 — Accessing Device Features · diagram 08
// Slide 32, "Case Study: Photo and Location Attendance".
//
// The table on this slide is already in its clearest form — three server checks beside
// the device feature that answers each — so the picture does not redraw it. What the
// table cannot say is *why the checks exist*: the presenter notes put that in one
// sentence ("a signed attendance sheet can be signed for someone else, so its academic
// integrity is weak. Device features close that gap"), and the slide's own second
// bullet states the result ("the practice of having someone else sign the attendance
// sheet in person becomes far harder"). Two attendance models, one paragraph — that is
// `beforeAfter`.
//
// One row per side, and no bullet moves. The slide has only two bullets and this pass
// keeps at least two on every slide, so there is nothing to trim: both stay, and both
// are facts the picture does not carry (the reminder goes out as a local notification;
// the faking practice becomes harder). The picture takes no bullet's place — it takes
// the argument the table and the bullets only imply.
//
// Room: 229px under the table, 179px for a one-row panel. A second row per side (the
// three checks split out) would cost 56px more and lands 6px past the theme's bottom
// padding, which is why the right panel states the three checks in one row instead.
//
// Three of the four panel strings are verbatim from the material: "a signed attendance
// sheet" and "can be signed for someone else" are the notes' own words, and "the server
// checks" is the table's column header. Two are not, and both are reported rather than
// silenced: "PHOTO + LOCATION + DEVICE" joins three words the slide and the table use
// separately into the name of one model, and "all three" is the panel's own count. The
// picture needs the pair named in four words each; a sentence would not fit the band.
export default {
  id: '08',
  slide: 'Case Study: Photo and Location Attendance',
  pattern: 'beforeAfter',
  alt:
    'A signed attendance sheet can be signed for someone else; with photo, location and ' +
    'device the server checks all three.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'A SIGNED ATTENDANCE SHEET',
      tone: 'red',
      items: ['Can be signed for someone else'],
    },
    right: {
      title: 'PHOTO + LOCATION + DEVICE',
      tone: 'acc',
      items: ['The server checks all three'],
    },
  },
}
