// Chapter 10 — REST API and Backend Integration · diagram 06
// New picture — there was no such chart in the old Mermaid set. The slide states the
// whole flow in one compressed line ("login → the server issues a token → the token is
// included in every request") and then names the header it travels in; who sends what
// to whom is exactly what a `sequence` makes explicit, and the presenter notes single
// out "where the token is conveyed" as one of the two things to remember.
//
// The picture sits on a `Diagram:` slide of its own, directly after the prose slide: at
// w:1120 the sequence is 307px tall, and the prose slide's four bullets plus its
// blockquote then pushed the blockquote through the footer (measured in the Marp PNG
// export). The alternative — shrinking the picture — breaks the 13px floor at 1160
// canvas units, so the slide was split instead and no bullet was removed.
//
// The fourth message is the answer to the protected request. It is written as one
// conditional label ("200 OK, or 401 if the token is wrong or expired") instead of two
// separate messages, because two messages in a time-ordered picture would say the 401
// happens after the 200. "wrong or expired" is the slide's own phrasing ("No token, a
// wrong token, or an expired token"); 200 OK comes from the status-code tables earlier
// in the chapter.
//
// The accent sits on the Bearer message — the slide's point is where the token goes, not
// that a login exists. Actor "Client" is the chapter's word (the client–server slide);
// this slide only names the server, so the build reports it.
//
// Provenance now reads the `Diagram:` slide, which has no prose, so every label is
// reported. They were checked by hand against the prose slide: login, token,
// Authorization: Bearer <token> and 401 Unauthorized are its words; Client is the
// chapter's word; "200 OK" comes from the status-code tables earlier in the chapter.
export default {
  id: '06',
  slide: 'Diagram: Introduction to API Authentication',
  pattern: 'sequence',
  alt:
    'The token flow: the client logs in, the server issues a token, the client sends the ' +
    'token in the Authorization: Bearer header on every later request, and the server ' +
    'answers 200 OK or 401 if the token is wrong or expired.',
  imgWidth: 1120,
  data: {
    actors: ['Client', 'Server'],
    messages: [
      { from: 'Client', to: 'Server', label: 'login' },
      { from: 'Server', to: 'Client', label: 'token' },
      { from: 'Client', to: 'Server', label: 'Authorization: Bearer <token>', tone: 'acc' },
      { from: 'Server', to: 'Client', label: '200 OK, or 401 if the token is wrong or expired' },
    ],
  },
}
