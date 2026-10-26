// Chapter 11 — Local Data Storage · diagram 07
// New picture. The slide's second bullet is a containment metaphor and the picture is the
// metaphor drawn: "The concept is like filing drawers: one drawer, one label, and its
// contents are read through that label", on top of bullet 1, "Every piece of data is stored
// under a key, a unique name used to read it back". A store holding labelled drawers, each
// drawer holding its contents, is containment, so the pattern is tree.
//
// The two labels are the two keys this chapter actually uses: `preferensi:nama` from the
// worked example (the slide after the API table) and `catatan:v1`, the notes key that
// Section 11.3 and the practicum both write to. They are not on this slide, and the build
// says so; using real keys beats "key1 / key2" because the student meets these two strings
// again within three slides.
//
// What the picture buys, and why one bullet moved to the presenter notes: the tree states
// the drawer relationship better than a sentence does, so the drawer bullet is preserved
// verbatim in the notes instead of competing with the picture. The two bullets that remain
// on the slide are the ones the picture cannot say: the definition of a key and the
// `npx expo install` difference.
//
// `tree` has no per-node note, so the leaf wording is as short as the fact allows: a name
// under one key, one long string under the other (Section 11.3's "one key holds the whole
// list").
export default {
  id: '07',
  slide: 'AsyncStorage Bukan Database, Hanya Kunci dan Nilai',
  pattern: 'tree',
  alt:
    'AsyncStorage as a set of labelled drawers: the key preferensi:nama holds the saved name, ' +
    'and the key catatan:v1 holds the notes list as one string. The label is the key, and the ' +
    'contents are read back through it.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'AsyncStorage',
      children: [
        { label: 'preferensi:nama', children: [{ label: 'The saved name' }] },
        { label: 'catatan:v1', children: [{ label: 'The notes list as one string' }] },
      ],
    },
  },
}
