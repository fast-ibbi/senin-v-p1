// Chapter 5 — React Native Basics · diagram 11
// WARNING: this flow is actually a loop (a keystroke calls onChangeText, the state
// changes, the component re-renders, and value={nama} binds the box back to the state).
// The `flow` pattern can only draw a chain, so the return arrow is NOT drawn — what is
// drawn is a four-stage chain that starts at the handler and ends where the loop closes.
// The alt text states this so it does not read as a one-way process.
//
// Direction review: the first version started at the state and put the label "keystroke"
// on the arrow state → onChangeText, which reads against the prose ("onChangeText updates
// it on every keystroke"): the update travels from the handler to the state, not the other
// way round. The chain now starts at onChangeText, so every arrow follows the prose.
//
// The first chip was labelled "nama state" — Indonesian word order left in an English
// deck. It is now "state: nama", matching the prose ("one state holds the value") plus
// the identifier the code slide uses.
//
// Legibility review: the middle edge used to read "state changes". A four-stage flow
// leaves a 100px gap between chips, and that label is 91px wide by the kit's own
// metrics — in the Marp export its last letter sat on the "re-render" border. The edge
// is now "triggers", the connector the prose implies ("the state changes, the component
// re-renders"), which is short enough to leave a real gap.
export default {
  id: '11',
  slide: 'Diagram: TextInput: Controlled Component',
  pattern: 'flow',
  alt:
    'A keystroke reaches onChangeText, setNama updates the state nama, that change '
    + 'triggers a re-render of App, and value={nama} makes the input box always reflect '
    + 'the state. This flow repeats on every keystroke — drawn as a chain, not a loop.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'onChangeText', note: 'on every keystroke' },
      { label: 'state: nama', note: 'useState' },
      { label: 're-render', note: 'App()' },
      { label: 'input box', note: 'value={nama}', tone: 'acc' },
    ],
    edges: ['setNama', 'triggers', 'value'],
  },
}
