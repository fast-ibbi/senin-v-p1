// Chapter 5 — React Native Basics · diagram 08
// This slide has two columns holding two models, but the relationship actually taught is
// containment: View may only contain components, and only Text carries text — including
// Text inside Text.
//
// Two corrections after the geometry review:
//   1. The `tree` pattern only draws `label`; `note` is dropped without a warning. So the
//      remark "not raw text" cannot be put in a note — it is simply removed.
//   2. A single child produces a zero-height elbow, so parent and child look like they
//      sit on one line and read as two siblings. Text is therefore given two children
//      (nested Text, numberOfLines) so the containment is really visible.
export default {
  id: '08',
  slide: 'Satu View, Dua Text, dan Satu Kalimat Bersarang',
  pattern: 'tree',
  alt:
    'View only accepts components as children, not raw text; the only carrier of text ' +
    'is Text, and Text may be nested inside Text as well as use numberOfLines to ' +
    'truncate long text.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'View',
      children: [
        { label: 'Other components' },
        {
          label: 'Text',
          tone: 'acc',
          children: [
            { label: 'Nested Text' },
            { label: 'numberOfLines' },
          ],
        },
      ],
    },
  },
}
