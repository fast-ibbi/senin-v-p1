// Chapter 5 — React Native Basics · diagram 03
// Replaces the old Mermaid chart. Its original shape was already a two-branch decision
// tree, so the `tree` pattern holds it without changing the content: one question, two
// sizes of difference, three tools.
//
// Geometry review: the old chart drew "large difference" with one child, the label
// ".ios.js / .android.js" as a single node. A `tree` parent with a single child gets a
// zero-height elbow, so parent and child sit on the same y and read as two siblings on
// a chain rather than as containment. The pair of extensions is split into the two
// files the slide names — one component written once per platform — which gives the
// branch a real elbow and makes the shape symmetric with "small difference". Nothing
// is added to the content: the deck's own sentence names ".ios.js and .android.js".
export default {
  id: '03',
  slide: 'Three Tools for Platform Differences',
  pattern: 'tree',
  alt:
    'A small difference — a value, a text, or a style — is handled by Platform.OS or ' +
    'Platform.select with a default; a large difference in the form of a whole ' +
    'component is handled by a platform file: .ios.js and .android.js.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'Difference to handle',
      children: [
        {
          label: 'Small difference',
          children: [
            { label: 'Platform.OS' },
            { label: 'Platform.select', tone: 'acc' },
          ],
        },
        {
          label: 'Large difference',
          children: [
            { label: 'File .ios.js' },
            { label: 'File .android.js' },
          ],
        },
      ],
    },
  },
}
