// Chapter 5 — React Native Basics · diagram 15
// The prose slide is five flat bullets: two history facts, one invariant, one change, and
// the price. Its facing `Diagram:` slide (07) already draws the history as a `flow`
// (React 2013 → React Native 2015 → native components). Reshaping that chain into two
// panels would be the same three facts twice, so this picture takes the other axis the
// slide teaches — the invariant against the change — which is also what the presenter
// notes ask for ("only the render target changes, not the way of thinking").
//
// Rows are matched two apiece, the general claim first and the concrete vocabulary
// second: the way of thinking against the medium it renders into, then the four concepts
// you write against what they render into. The history bullets and the price are left on
// the slide: the picture does not show them.
export default {
  id: '15',
  slide: 'React 2013, React Native 2015: Gagasan Sama, Media Beda',
  pattern: 'beforeAfter',
  alt:
    'What stays the same between the two libraries: the way of thinking, and components, ' +
    'props, state, and hooks. What changes is the medium: from web pages to native ' +
    'components.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'STAYS THE SAME',
      tone: 'neutral',
      items: [
        'The way of thinking',
        'Components, props, state, and hooks',
      ],
    },
    right: {
      title: 'CHANGES',
      tone: 'acc',
      items: [
        'The medium',
        'From web pages to native components',
      ],
    },
  },
}
