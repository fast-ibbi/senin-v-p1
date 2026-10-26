// Chapter 13 — Authentication and Application Security · diagram 13
// The slide's two drawable bullets are the server's two jobs — it re-validates the data, and it
// never concatenates client data into a query — and both sit on the request's path. That is a
// chain, so `flow`: the request arrives, the server re-validates it, the server builds the query.
//
// `beforeAfter` was rejected here even though the slide contrasts client and server validation.
// Picture 04 ("Two Layers of Protection") already draws the client/server split for this chapter,
// and a second pair of panels two-thirds of the way down the deck would say the same thing in the
// same shape. The flow can say something 04 cannot: *where* on the path the trustworthy gate sits,
// and that everything downstream of it is built by the server.
//
// Trimming: bullets 2, 3 and 4 are the three stages and the two arrows, so they moved verbatim
// into the notes. What stays is bullet 1 (form validation is only quick feedback, and it carries
// the Chapter 8 pointer no stage can hold) and bullet 5 (the one-sentence rule — a judgement, not
// a step).
//
// Labels: "Request", "Server" and "SQL command" are the slide's nouns; the two notes compress its
// bullets ("the endpoint can be called with curl", "re-validates data types, lengths, email
// format", "never concatenated directly"). The two edge verbs, `reaches` and `builds`, are
// authored — the slide states the constraint on the query but never names the act of building it.
//
// Accent: the middle stage, because the slide's title puts the validation on the server side. The
// query stage is deliberately neutral — it is not the actor, it is what the server must build
// safely.
export default {
  id: '13',
  slide: 'Prinsip 1: Klien Tidak Bisa Dipercaya, Server Harus Memvalidasi',
  pattern: 'flow',
  alt:
    'The request — not always sent by your application, curl can call the endpoint — reaches the ' +
    'server, which re-validates types, lengths and email format, and which builds the SQL command ' +
    'without ever concatenating client data into it.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Request', note: 'not always your application — curl can call it' },
      { label: 'Server', note: 're-validates types, lengths, email format', tone: 'acc' },
      { label: 'SQL command', note: 'client data never concatenated', tone: 'neutral' },
    ],
    edges: ['reaches', 'builds'],
  },
}
