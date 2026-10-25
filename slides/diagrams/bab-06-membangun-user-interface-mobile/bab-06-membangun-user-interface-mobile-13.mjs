// Chapter 6 — Building a Mobile User Interface · diagram 13
// New picture. The slide puts two regions of one screen side by side and lists what each
// one holds: the header carries a title, a back button on the left and a contextual action
// on the right; the bottom navigation carries 3–5 icon-and-label tabs and marks the active
// one. "What belongs to what" is containment, so the pattern is `tree`, and the elbow
// arrows answer the question a student asks while building the wireframe: does this element
// belong to the header or to the tab bar?
//
// Why not `beforeAfter` (the obvious reading of a two-column slide): its numbered rows
// pair header row 1 with tab-bar row 1, and there is no such correspondence here — the two
// regions are not two answers to one question, they are two containers.
//
// Why not `layers`: bands are equal height and sit flush against each other, so a header
// band directly on top of a tab-bar band would say the tab bar starts where the header
// ends — and the screen's content, which the slide never mentions, would have to be
// invented to hold them apart.
//
// Only the *elements* are drawn. The two bullets about jobs ("where am I, what can I do,
// how do I go back" and "the most comfortable place for the thumb") are properties, not
// parts, and `tree` drops `note`, so they stay on the slide where they belong. The root
// order — Header above Bottom navigation — is the screen's own order, top to bottom.
//
// `imgWidth` is 1000 rather than the default 1120 for one measured reason: at five leaves the
// 358-unit canvas pushed the grid below it onto the footer on the slide. Cutting one leaf (the
// header's two action slots share one chip, in the slide's own order and wording) brings the
// canvas to 296 units, and 1000 keeps the 16px node labels at 13.8px effective — above the
// 13px floor. Nothing lost: "title", "contextual action on the right, back button on the left"
// and the tab bar's two facts are all still in the picture.
export default {
  id: '13',
  slide: 'Header and Bottom Navigation',
  pattern: 'tree',
  alt:
    'What belongs to what on one screen: the header holds the title and the two action slots — ' +
    'the contextual action on the right, the back button on the left; the bottom navigation ' +
    'holds 3–5 icon-and-label tabs and always marks the active tab.',
  imgWidth: 1000,
  data: {
    root: {
      label: 'Screen',
      children: [
        {
          label: 'Header',
          children: [
            { label: 'Title' },
            { label: 'Contextual action on the right, back button on the left' },
          ],
        },
        {
          label: 'Bottom navigation',
          children: [
            { label: '3–5 icon-and-label tabs' },
            { label: 'The active tab is always marked' },
          ],
        },
      ],
    },
  },
}
