// Chapter 13 — Authentication and Application Security · diagram 02
// Replaces the old Mermaid chart (bab-13-…-02.mmd), which drew two disconnected
// node pairs — "client sends X" → "server does Y" — once for a session and once
// for a token. The slide asks students to compare the two rows, so the shape is
// `beforeAfter`, not `flow`: a flow would run session and token end to end, as if
// a request used both. Two panels keep the rows answerable one against the other.
//
// Row 1 is "what the client sends", row 2 is "what the server does". The presenter
// notes ask the class to find the missing step on the token side: there is no
// "look up the record" row, and that absence is the meaning of stateless.
//
// The left panel is `neutral`, not the default red: a session is not the wrong
// model, it is the model this chapter does not pick for mobile and REST. The
// accent marks the token column, the choice the chapter argues for.
export default {
  id: '02',
  slide: 'Server yang Mengingat Butuh Tempat Berbagi, yang Stateless Cukup Satu Kunci',
  pattern: 'beforeAfter',
  alt:
    'Two servers side by side. A session: the client sends the session ID, the server looks ' +
    'up the session record. A token: the client sends Authorization: Bearer, the server ' +
    'verifies the signature — with no record to look up.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'SESSION',
      tone: 'neutral',
      items: ['Client sends the session ID', 'Server looks up the session record'],
    },
    right: {
      title: 'TOKEN',
      tone: 'acc',
      items: ['Client sends Authorization: Bearer', 'Server verifies the signature'],
    },
  },
}
