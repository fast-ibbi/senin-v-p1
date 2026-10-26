// Chapter 13 — Authentication and Application Security · diagram 16
// This slide's own presenter notes say the rule "applies on three layers at once: device
// permissions, the claims inside the token, and the data the server sends in every response". The
// word is the author's, so the pattern is `layers`: three bands, read top to bottom as the request
// travels — from the permission on the user's device, through the claims the client carries, to
// the access the server allows.
//
// Honest limit: the bands are equal height, while the three scopes are not comparable in size. The
// stack here means "the same rule at every level of one request", not a foundation layering; the
// notes use "layers", and the bands are labelled as scopes rather than as sizes.
//
// Trimming: bullet 2 is band 1 ("requested when the feature is used, not all at once") and bullet
// 3 is bands 2–3 ("claims as few as possible", "API access limited per role"), so those two moved
// verbatim into the notes. What stays is bullet 1 (the statement of the principle), bullet 4 (the
// concrete counter-example — admin rights because login succeeded) and bullet 5 (what the rule
// buys: a narrower attack surface). None of the three is a band.
//
// Accent: the bottom band. The client can ask for little and the token can carry little, but the
// server is the one that enforces the limit, which is the chapter's standing argument.
export default {
  id: '16',
  slide: 'Prinsip 4: Least Privilege Mempersempit Sasaran Serangan',
  pattern: 'layers',
  alt:
    'Least privilege applied at three layers of one request: device permissions requested when ' +
    'the feature is used, token claims kept as few as possible, and API access limited per role.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'Device permissions', note: 'requested when the feature is used', tone: 'neutral' },
      { label: 'Token claims', note: 'as few as possible', tone: 'neutral' },
      { label: 'API access', note: 'limited per role', tone: 'acc' },
    ],
  },
}
