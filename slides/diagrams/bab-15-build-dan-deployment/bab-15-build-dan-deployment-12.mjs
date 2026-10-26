// Chapter 15 — Build and Deployment · diagram 12
// A new picture (no legacy chart at this id). Slide 22 is a definition slide plus one rule, and
// the rule is the content: "Anyone can rebuild the app, but only the owner of the key can sign
// it. The system rejects an update signed with a different key." Two doers, one axis, three
// matched rows — `beforeAfter`, not a chain: nothing here happens in order.
//
// Rows correspond, which is what keeps the two panels readable as one picture:
//   who acts:   anyone can rebuild the app       ↔ only the owner of the key can sign it
//   with what:  signed with a different key      ↔ holds the key and certificate
//   outcome:    the system rejects the update    ↔ comes from a legitimate developer
//
// `sequence` was the other candidate (build → sign → verify) and lost on honesty: the slide
// never narrates that order, and inventing the order is inventing the lesson. `tree` would have
// drawn the keystore's contents (key + certificate) and dropped the rule entirely.
//
// Tones: the left panel is `neutral`, not the pattern's default red. Rebuilding someone's app is
// not the mistake — signing it with a key you do not own is. Red marks the rejected outcome, and
// that outcome is already inside the rows.
//
// Trimmed to the picture: bullets 2 and 4, whose facts are the two rows they sit beside.
// Bullet 1 (the definition of the term itself), bullet 3 (the `.jks` / `.keystore` file types,
// which the picture does not draw) and bullet 5 (EAS stores the keystore, `eas credentials`)
// stay on the slide — the picture says none of them.
export default {
  id: '12',
  slide: 'Signing: Tanda Tangan yang Membuktikan Keaslian',
  pattern: 'beforeAfter',
  alt:
    'Anyone can rebuild the app, but only the owner of the key can sign it. A copy signed with a ' +
    'different key is rejected by the system as an update; the key owner holds the key and ' +
    'certificate in the keystore, so the file comes from a legitimate developer.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'REBUILD',
      tone: 'neutral',
      items: [
        'anyone can rebuild the app',
        'signed with a different key',
        'the system rejects an update',
      ],
    },
    right: {
      title: 'SIGN',
      tone: 'acc',
      items: [
        'only the owner of the key can sign it',
        'holds the key and certificate',
        'the file comes from a legitimate developer',
      ],
    },
  },
}
