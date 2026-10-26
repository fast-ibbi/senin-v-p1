// Chapter 8 — Forms, Input, and Validation · diagram 03
// Replaces the old Mermaid chart (bab-08-…-03.mmd), which drew containment top-down:
// the thin route owns the form screen, and the screen uses FormField and the validator
// functions. Containment of that shape is `tree`, and the root is accented by the kit —
// the right zone, because the route is the data owner the slide's blockquote names.
//
// The legacy root label was "app/(app)/mahasiswa/tambah.js — rute tipis, pemilik data".
// `tree` gives the root a 218px chip and drops node notes, so the path is written on two
// lines ("app/(app)/" / "mahasiswa/tambah.js") and the descriptor "thin route — data
// owner" lives in the alt text instead. The child labels keep their folder prefixes, as in the legacy
// chart. `tree` renders any label containing a slash in monospace, so all three children
// share one voice and the root — proportional, bold, accented — reads as the owner.
//
// The route has a single child, so the kit's zero-height elbow puts the route and the
// screen on one y with a horizontal, arrow-headed connector: a chain, not two siblings.
// The screen then fans out to the two components it uses.
export default {
  id: '03',
  slide: 'Empat Lapisan dengan Tanggung Jawab Masing-Masing',
  pattern: 'tree',
  alt:
    'The file map: app/(app)/mahasiswa/tambah.js is the thin route and the data owner; it ' +
    'renders screens/FormMahasiswa.js, which holds the form logic and uses ' +
    'components/FormField.js for label, input and error, and utils/validators.js for the ' +
    'pure validation functions.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'app/(app)/ mahasiswa/tambah.js',
      children: [
        {
          label: 'screens/FormMahasiswa.js',
          children: [
            { label: 'components/FormField.js' },
            { label: 'utils/validators.js' },
          ],
        },
      ],
    },
  },
}
