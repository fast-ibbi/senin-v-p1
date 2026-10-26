// Chapter 10 — REST API and Backend Integration · diagram 05
// New picture — there was no such chart in the old Mermaid set. The slide is a
// five-step story of one transaction, and its heading is itself a chain
// ("Form → Server → List"); the numbered list hides the fact that the last step lands
// back on the screen the flow started from, which is what `flow` makes visible.
//
// Four stages, not five: the slide's steps 4 and 5 (router.back(), then useFocusEffect
// reloads the list) are one hand-over — the return to the list — so the last stage is
// the list screen and its note says how it refreshes. That keeps the chain at the
// pattern's comfortable width instead of squeezing five chips into 153px.
//
// Edge labels are the slide's own verbs: "the Save button is pressed", "POST …
// sends", "router.back()". The server's answer ("201 Created together with the new
// id") sits in the stage note rather than on an arrow, because it travels back to the
// app and not forward to the list — putting it on the forward arrow would draw the
// response going the wrong way.
export default {
  id: '05',
  slide: 'Alur Integrasi: Formulir, Server, Lalu Daftar',
  pattern: 'flow',
  alt:
    'One save transaction: the form holds the state and disables Save, the POST goes out ' +
    'to /api/mahasiswa, the server stores the record and answers 201 Created with the new ' +
    'id, then router.back() returns to the list, which reloads on focus.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Form', note: 'state filled, Save disabled' },
      { label: 'POST', note: '/api/mahasiswa' },
      { label: 'Server', note: '201 Created + id' },
      { label: 'List', note: 'useFocusEffect reloads', tone: 'acc' },
    ],
    edges: ['Save', 'sends', 'router.back()'],
  },
}
