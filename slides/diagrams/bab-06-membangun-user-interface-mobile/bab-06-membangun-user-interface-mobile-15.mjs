// Chapter 6 — Building a Mobile User Interface · diagram 15
// New picture. The slide is an inventory of five tools, and an inventory is what a bulleted
// list already does well — so the picture does not redraw the inventory. It draws the one
// relationship the list leaves implicit: two of the tools are the two ends of the same
// question, "what does the layout do when the screen is not the size I assumed?". `flexWrap`
// answers for the narrow screen, `maxWidth` for the large one. Same question, two answers,
// one row each — that is `beforeAfter`, and its numbered rows genuinely correspond.
//
// Only two of the five tools are drawn, on purpose: `Flexbox`, percentage widths and
// `useWindowDimensions` are not about an edge, so putting them in a panel would be inventing
// an assignment the slide never makes. They stay in the prose.
//
// Neither panel is a wrong model, so both tones are written explicitly; the accent marks the
// large-screen answer because `maxWidth` is the tool nobody remembers to add. Panel titles are
// one word each because that is how the slide says it ("when the screen is narrow", "on large
// screens"); the comma in each item replaces the closing backtick of the slide's own sentence,
// so every label is verbatim.
export default {
  id: '15',
  slide: 'Responsive Design: Five Tools',
  pattern: 'beforeAfter',
  alt:
    'One layout at two screen sizes: on a narrow screen flexWrap moves elements to a new row; ' +
    'on a large screen maxWidth stops elements from stretching uncontrollably.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'NARROW',
      tone: 'neutral',
      items: ['flexWrap, so elements move to a new row'],
    },
    right: {
      title: 'LARGE',
      tone: 'acc',
      items: ['maxWidth, so elements do not stretch uncontrollably'],
    },
  },
}
