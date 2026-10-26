// Chapter 13 — Authentication and Application Security · diagram 05
// A new picture: this slide had no chart, and its five numbered steps plus the
// blockquote leave no room for a legible one, so the deck gains a
// "## Diagram: …" slide directly after it (the prose slide is untouched).
//
// The pattern is `sequence`, not `flow`, because the steps are an exchange
// between three parties — the user, the application, the auth server — and the
// slide's closing quote only makes sense if the picture shows who is absent:
// "Logout in a token architecture means throwing away the key on the client; the
// server has no session to close." In a flow the storage and the deletion would
// collapse into the same line as the network calls; here the two self-calls at
// the Application lifeline show both as client-side acts with no server involved,
// and the accented loop is the logout.
//
// Actors and labels are the slide's own words (user, application, auth server,
// email and a password, credentials, JWT token, SecureStore, the
// `Authorization: Bearer <token>` header, logout deletes the token). Nothing new
// is drawn: the 401 branch belongs to the presenter notes of this slide ("if the
// token is lost or expired …") and is left to the notes.
export default {
  id: '05',
  slide: 'Diagram: Siapa Berbicara ke Siapa, dan di Mana Token Disimpan',
  pattern: 'sequence',
  alt:
    'The complete flow as an exchange: the user sends an email and a password to the ' +
    'application, which sends the credentials to the auth server; the auth server answers ' +
    'with a JWT token, the application stores it in SecureStore, later sends it back as the ' +
    'Authorization: Bearer header, and at logout deletes it on the client without calling the server.',
  imgWidth: 1120,
  data: {
    actors: ['User', 'Application', 'Auth server'],
    messages: [
      { from: 'User', to: 'Application', label: 'email and a password' },
      { from: 'Application', to: 'Auth server', label: 'credentials' },
      { from: 'Auth server', to: 'Application', label: 'JWT token' },
      { from: 'Application', to: 'Application', label: 'stores the token in SecureStore' },
      { from: 'Application', to: 'Auth server', label: 'Authorization: Bearer <token>' },
      { from: 'Application', to: 'Application', label: 'logout deletes the token', tone: 'acc' },
    ],
  },
}
