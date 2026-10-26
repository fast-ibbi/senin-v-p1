// Chapter 13 — Authentication and Application Security · diagram 03
// Replaces the old Mermaid chart (bab-13-…-03.mmd), a top-down chain of three
// boxes: header → payload → signature. The chain was right; only the shape was
// wrong for a 16:9 slide — the vertical version is what forced the old
// `![w:260]`, which rendered a 14px label at 3px on the projector. `flow` draws
// the same three parts across the slide, so the picture keeps the 1120 width it
// needs and the three bullets below it stay where they are.
//
// The edge labels name the separator: the heading says "Three Parts Separated by
// Dots" and the presenter notes ask students to see one string with two dots as
// separators. A verb on the arrow would claim the parts cause one another, which
// they do not, and a literal "." label renders as a 4px speck on the projector —
// the word stays readable from the back of the room and matches the heading.
//
// The notes are quoted from the slide's own bullets, because the asymmetry is the
// lesson: the first two parts are only *encoded* (anyone can read them — the next
// slide makes that argument), the third is *computed* with a key the client never
// holds.
export default {
  id: '03',
  slide: 'JWT: Tiga Bagian, Dua Titik Pemisah',
  pattern: 'flow',
  alt:
    'A JWT read left to right as one string with two dot separators: header, dot, payload, ' +
    'dot, signature. Header and payload are only encoded with base64url; the signature is ' +
    'computed with a secret key that only the server knows.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Header', note: 'encoded with base64url' },
      { label: 'Payload', note: 'encoded with base64url' },
      { label: 'Signature', note: 'computed with a secret key', tone: 'acc' },
    ],
    edges: ['dot', 'dot'],
  },
}
