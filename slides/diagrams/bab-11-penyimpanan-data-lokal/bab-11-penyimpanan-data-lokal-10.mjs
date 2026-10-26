// Chapter 11 — Local Data Storage · diagram 10
// New picture. The slide's four bullets are one escalation, in the order the slide states
// them: the data is not encrypted, so any code in the app can read it, a rooted or
// jailbroken device makes that worse, and a stolen token lets an attacker act as the user.
// The presenter note frames the same three questions — "who can read it, how they would do
// it, and what it costs the user" — so the pattern is `flow`, not a two-model contrast.
//
// The picture is deliberately not a `layers` stack (nothing here sits on anything else) and
// not a `beforeAfter` (the slide compares no two models; it narrates a risk). The last chip
// is red rather than the pattern's default accent: the outcome is the unacceptable one, and
// the slide's own note says to read it as a risk.
//
// Two bullets move VERBATIM to the presenter notes. Bullet 1 ("AsyncStorage data is not
// encrypted: its values are stored as plain text") is the first chip plus its note, and
// bullet 4 ("A stolen token: an attacker can call the API on the user's behalf") is the last
// arrow plus the last chip — both are the picture now. Bullets 2 and 3 stay on the slide:
// the picture compresses them to a chip and an arrow, and bullet 3 also carries the two
// platforms (Android, iOS) that the chip note can only hint at.
//
// Provenance: "App code" condenses "Any code running inside the app"; "plain text, not
// encrypted" joins the two halves of bullet 1 ("not encrypted" + "stored as plain text").
// Every other label is the slide's own wording.
export default {
  id: '10',
  slide: 'Token Tidak Boleh Tinggal di AsyncStorage',
  pattern: 'flow',
  alt:
    'The risk chain for a token in AsyncStorage: the stored value is plain text and not ' +
    'encrypted, so any code running inside the app can read it; a rooted or jailbroken device ' +
    'raises the risk, and a stolen token lets an attacker call the API on the user\'s behalf.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'AsyncStorage', note: 'plain text, not encrypted' },
      { label: 'App code', note: 'any code running inside' },
      { label: 'Rooted device', note: 'or jailbroken (iOS)' },
      { label: 'Attacker', note: "calls the API on the user's behalf", tone: 'red' },
    ],
    edges: ['can read it', 'raises the risk', 'a stolen token'],
  },
}
