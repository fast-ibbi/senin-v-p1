// Chapter 9 — State Management · diagram 05
// Replaces the old Mermaid chart (bab-09-state-management-05.mmd): five stages from
// the touch to the badge, with the state update and the context value in between.
// These are fixed stages in one direction — no branch, no return — so `flow` is the
// honest pattern; a `stateMachine` would imply modes you can be in, which this is not.
//
// The old chart put the whole call on one node ("onPress: tambahItem(item)"). Here
// the call is the first arrow and the function it calls is the second stage, so the
// chain reads as the presenter notes tell it: the touch calls tambahItem, the
// provider updates the state, the context value changes, React re-renders the
// consumers, and the badge and the cart list follow.
//
// Edge labels are one short verb each: at five stages the arrow gap is 86px, and a
// longer word would be pushed to two lines or refused. Step labels carry the names.
export default {
  id: '05',
  slide: 'Satu Ketukan "Tambah", Satu Rantai Sampai Badge',
  pattern: 'flow',
  alt:
    'One add press, one way: the Add button in app/index.js fires onPress, tambahItem in ' +
    'CartProvider calls setItems, the context value changes, every consumer re-renders, and the ' +
    'badge and cart list update.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Add button', note: 'app/index.js' },
      { label: 'tambahItem', note: 'the provider' },
      { label: 'Context value', note: 'items' },
      { label: 'Consumers', note: 're-render' },
      { label: 'Badge', note: 'cart list', tone: 'acc' },
    ],
    edges: ['onPress', 'setItems', 'changes', 'shows'],
  },
}
