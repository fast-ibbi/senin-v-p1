// Chapter 5 — React Native Basics · diagram 07
// The source slide is five ordered items that are really one timeline: React 2013
// renders to the DOM, React Native 2015 uses the same idea with a different medium, and
// the price is an additional native module. The `flow` pattern shows that order; two
// panels would hide it.
//
// Geometry review: the second edge used to read "native modules". Measured in Chrome
// (the engine Marp exports with) it was 106px wide inside a 118px gap — 6px of clearance
// on each side, which reads as a label sitting on the third chip's border. The deck's own
// words are "an additional native module", so the singular is both closer to the prose
// and 10px clear of each chip.
export default {
  id: '07',
  slide: 'Diagram: React Web vs React Native',
  pattern: 'flow',
  alt:
    'React 2013 renders JSX into the DOM through react-dom; React Native 2015 uses the ' +
    'same idea with a different medium, renders native components, and the price of the ' +
    'difference is an additional native module.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'React 2013', note: 'JSX rendered by react-dom' },
      { label: 'React Native 2015', note: 'components, props, state, hooks stay' },
      { label: 'Native components', note: 'the medium changes', tone: 'acc' },
    ],
    edges: ['same idea', 'native module'],
  },
}
