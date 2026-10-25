// Chapter 7 — App Navigation · diagram 07
// The slide's claim is containment: every file in the `app/` folder becomes one screen, and
// the file name becomes its address. "What hangs off what" is `tree`, so the root is the
// `app/` folder and each file carries the address it produces. The three chips are the
// slide's three "Address convention" bullets, so those move verbatim into the presenter
// notes; the "How it differs from the old approach" bullets stay on the slide, because the
// picture says nothing about registration code.
//
// Deliberately not one level deeper: `mahasiswa/` holds a single file at this point in the
// chapter, and the kit collapses a single-child parent onto the same y as its child, which
// would read as a sibling of its own child. The path inside the chip keeps the folder
// visible instead. The three chips are the only screen files the slide itself names.
//
// No child is accented: nothing here is a special screen — the root's accent already marks
// "the folder is the structure", which is the point of the slide.
export default {
  id: '07',
  slide: 'File-Based Routing: Folders Become Addresses',
  pattern: 'tree',
  alt:
    'The app/ folder holds three files, and each file name becomes the address beside it: ' +
    'index.js becomes /, login.js becomes /login, and mahasiswa/index.js becomes /mahasiswa.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'app/',
      children: [
        { label: 'index.js → /' },
        { label: 'login.js → /login' },
        { label: 'mahasiswa/index.js → /mahasiswa' },
      ],
    },
  },
}
