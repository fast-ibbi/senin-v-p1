// Chapter 7 — App Navigation · diagram 02
// Replaces the old Mermaid chart (bab-07-…-02.mmd): four files and the four route
// addresses they produce. The chart is a correspondence, not a hierarchy, so it is not a
// `tree`: the addresses are not contained in the files, they are produced by them.
// `beforeAfter` is the only pattern in the set that renders matched rows on two sides,
// which is exactly what "read each line aloud: which file produces which address" asks
// for. Rows are paired by position: row n of the left panel is the address of row n.
//
// The paths keep the `(app)` group because that is the slide's own warning — the quote
// under the picture says the bracketed folder adds no segment to the address, and the
// picture shows it: `(app)/mahasiswa/index.js` still resolves to `/mahasiswa`.
//
// Both panels are forced to monospace: filenames and addresses are paths, and a mono
// left panel beside a proportional right panel reads as an accident.
//
// Provenance: every label is a string the slide itself now prints. The slide's note states
// the mapping in its own words — `index.js` is `/`, `login.js` is `/login`,
// `(app)/mahasiswa/index.js` is `/mahasiswa`, `(app)/mahasiswa/[id].js` is the dynamic
// `/mahasiswa/:id` — so nothing here is invented. The dynamic segment is written `:id`,
// the deck's own notation in the Route Map table one slide later; `2201001` is an example
// value that belongs to the prose on `Dynamic Routes and Parameters`, not to a route.
export default {
  id: '02',
  slide: 'Tanda Kurung Mengelompokkan, Bukan Menambah Alamat',
  pattern: 'beforeAfter',
  alt:
    'Four files in the app/ folder and the route address each one produces: index.js gives ' +
    '/, login.js gives /login, (app)/mahasiswa/index.js gives /mahasiswa, and ' +
    '(app)/mahasiswa/[id].js gives the dynamic /mahasiswa/:id. The (app) group adds no segment.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'FILE',
      tone: 'neutral',
      mono: true,
      items: [
        'index.js',
        'login.js',
        '(app)/mahasiswa/index.js',
        '(app)/mahasiswa/[id].js',
      ],
    },
    right: {
      title: 'ADDRESS',
      tone: 'acc',
      mono: true,
      items: ['/', '/login', '/mahasiswa', '/mahasiswa/:id'],
    },
  },
}
