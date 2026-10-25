// Chapter 5 — React Native Basics · diagram 16
// This slide states five flat facts. Two of them are already the two-column picture on the
// facing `Diagram:` slide (09: local `require` against remote `uri`), so repeating that
// comparison here would be one idea drawn twice in a row. What no picture in the deck
// shows is the other half of the same slide: what the box holds *before* a remote photo
// arrives, and what happens to the photo inside it afterwards.
//
// The two paired rows are (a) what is drawn in the box while the bytes are still on the
// network, and (b) how the size of that box is decided. The first three bullets — the code
// form of both sources and the width/height requirement of the remote one — stay on the
// slide; the picture shows the two bullets the prose spends on the waiting state.
//
// The drop shadow of `cover` cannot be drawn: `layers` is the only pattern with an inset
// idea and the kit gives its bands equal height, so the crop is named in the row instead.
export default {
  id: '16',
  slide: 'Image: Two Image Sources',
  pattern: 'beforeAfter',
  alt:
    'While a remote photo is not available yet the box shows an initials placeholder, not ' +
    'an empty box, and its size is fixed by an explicit width and height in the style; ' +
    'once the photo is loaded it fills the box and resizeMode cover crops the overflowing ' +
    'part.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'NOT AVAILABLE YET',
      tone: 'neutral',
      items: [
        'An initials placeholder, not an empty box',
        'Explicit width and height in the style',
      ],
    },
    right: {
      title: 'ONCE IT IS LOADED',
      tone: 'acc',
      items: [
        'The photo fills the box',
        'resizeMode cover crops the overflow',
      ],
    },
  },
}
