// Chapter 7 — App Navigation · diagram 05
// Replaces the old Mermaid chart (bab-07-…-05.mmd), which drew the sign-in check as a
// flowchart with a yes/no diamond. That branch is slide 26's subject, not this slide's:
// slide 25 says one thing — "protection sits at one point, the (app) group layout, and
// applies automatically to every screen inside it, including screens added later". That
// is containment, so the pattern is `tree`: one root, every protected screen hanging off
// it, and adding a screen means hanging one more node on the same root.
//
// The kit paints the root in the accent tone, which is the right zone here: the root IS
// the single control point. No child is accented, so nothing competes with it.
//
// Screen names are taken from the route map table on the same chapter's Route Map slide
// (Home, Student List, Student Detail, Add/Edit Form); this slide's own text names only
// "every screen inside it", so all four are reported as provenance misses.
//
// The fourth node is written "Form", not the table's "Add/Edit Form": `tree` renders any
// label containing a slash in monospace, and one mono chip beside three proportional ones
// reads as an accident. The alt text keeps the full name. Slide 30 also calls it "the form".
export default {
  id: '05',
  slide: 'Perlindungan di Satu Titik Berlaku untuk Semua Layar',
  pattern: 'tree',
  alt:
    'One control point: the (app) group layout sits above Home, Student List, Student ' +
    'Detail and the Add/Edit Form, so the sign-in check written once there applies to every ' +
    'screen inside the group — including a screen added later.',
  imgWidth: 1120,
  data: {
    root: {
      label: '(app) group layout',
      children: [
        { label: 'Home' },
        { label: 'Student List' },
        { label: 'Student Detail' },
        { label: 'Form' },
      ],
    },
  },
}
