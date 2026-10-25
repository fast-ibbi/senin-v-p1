// Chapter 5 — React Native Basics · diagram 05
// Two scroller arrangements that both "work", but only one keeps FlatList's
// virtualization. The slide states the symptom and the fix in order; this picture pairs
// them row by row so the correlation is visible.
//
// Row 2 was re-paired: it used to read "Both fight for scroll control" opposite "Fixed
// content goes into ListHeaderComponent" — a symptom facing a fix step, so the row taught
// no correspondence. It now answers the competition with the competition removed, which
// is the negation of the slide's own phrase ("Both fight for scroll control"). The
// ListHeaderComponent detail stays on the slide's own bullet and in the alt text; it was
// never a counterpart to anything on the left.
export default {
  id: '05',
  slide: 'One Screen, One Main Scroller',
  pattern: 'beforeAfter',
  alt:
    'Nested scrollers between ScrollView and FlatList break virtualization; one main ' +
    'scroller with FlatList on the outside keeps it working, and fixed content moves into ' +
    'ListHeaderComponent.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'COMPETING SCROLLERS',
      tone: 'red',
      items: [
        'FlatList inside a same-direction ScrollView',
        'Both fight for scroll control',
        'FlatList virtualization breaks',
      ],
    },
    right: {
      title: 'ONE MAIN SCROLLER',
      tone: 'acc',
      items: [
        'FlatList becomes the outer scroller',
        'Nothing else competes for scrolling',
        'Virtualization works normally',
      ],
    },
  },
}
