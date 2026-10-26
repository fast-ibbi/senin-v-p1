// Chapter 7 — App Navigation · diagram 03
// Replaces the old Mermaid chart (bab-07-…-03.mmd): Tabs at the top, the tab that holds
// its own Stack, and the three screens that Stack owns. Containment is the content, so
// the pattern is `tree`.
//
// The legacy chart had four ranks (Tabs → tab → Stack → screens) and `tree` stops at
// three, so the tab and its Stack share one node, labelled "Students tab · Stack": the
// slide's own phrase is "a tab containing a Stack", and the presenter notes say the
// mahasiswa/ folder has its own _layout.js holding that Stack. Nothing is dropped but
// the empty intermediate box.
//
// The screens are named as the slide names them ("List, Detail, and Add Student"), not
// as the route map names them ("Student List", "Student Detail", "Add/Edit Form").
export default {
  id: '03',
  slide: 'Tab yang Berisi Stack Punya Riwayat Sendiri',
  pattern: 'tree',
  alt:
    'Nested navigation: the Tabs root holds two tabs; the Students tab holds its own Stack, ' +
    'and that Stack owns List, Detail and Add Student. Each tab keeps its own history.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'Tabs',
      children: [
        { label: 'Home tab' },
        {
          label: 'Students tab · Stack',
          tone: 'acc',
          children: [
            { label: 'List' },
            { label: 'Detail' },
            { label: 'Add Student' },
          ],
        },
      ],
    },
  },
}
