// Chapter 13 — Authentication and Application Security · diagram 09
// Chapter 13 — Authentication and Application Security · diagram 09
// The misconception the slide is fighting is a one-word confusion: encoded is not encrypted.
// Two panels of two rows each is the shape that keeps the confusion visible — row 1 says what
// each part is, row 2 says what follows from it, and reading across a row is the comparison.
// `flow` would put header and signature in a chain, as if one produced the other, which is
// diagram 03's job and not this slide's point.
//
// The first two bullets are the two rows and moved into the notes. What stays on the slide is
// the one-letter test (a fact about tampering, not about encoding) and the payload rule (never
// put a password or secret data inside it) — neither of which any row shows.
//
// The left panel is `neutral`: encoding is not a mistake, it is just not secrecy. The accent
// sits on the signature, which is what actually protects the token.
export default {
  id: '09',
  slide: 'JWT Bukan Enkripsi',
  pattern: 'beforeAfter',
  alt:
    'Header and payload are only encoded, not encrypted — anyone can decode and read them. The ' +
    'signature protects the integrity and authenticity of the contents, but not their ' +
    'confidentiality.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'HEADER + PAYLOAD',
      tone: 'neutral',
      items: ['Only encoded, not encrypted', 'Anyone can decode and read them'],
    },
    right: {
      title: 'THE SIGNATURE',
      tone: 'acc',
      items: ['Protects integrity and authenticity', 'Not the confidentiality of the contents'],
    },
  },
}
