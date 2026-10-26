// Chapter 13 — Authentication and Application Security · diagram 08
// The slide names a mechanism without drawing it: a password goes in, a one-way function with
// a salt is applied, and what the server keeps is the hash value. That is a chain, so `flow`,
// and the accent lands on the hash value because that is the only thing the database holds.
//
// Two of the five bullets are the links of this chain and moved into the notes: the one-way
// hashing bullet (bcrypt, not the original text) and the salt bullet (identical passwords,
// different hashes). What stays are the three facts no stage can carry: what credentials are,
// the `••••••••` placeholder convention, and the rule that a password is never printed,
// stored, or logged.
//
// Authored labels: the edge verbs `+ salt` and `one-way` — the slide says "Salt" and "one-way
// hashing" but never writes what the arrows themselves do. Stage 1 and stage 3 notes are the
// slide's phrases ("the original text", "hash values", "stores").
export default {
  id: '08',
  slide: 'Password Tidak Pernah Disimpan sebagai Teks Polos',
  pattern: 'flow',
  alt:
    'The password — the original text — goes through one-way hashing with a salt, for example ' +
    'bcrypt, and what the server stores is only the resulting hash value; two identical ' +
    'passwords produce different hashes.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Password', note: 'the original text' },
      { label: 'Bcrypt hashing', note: 'identical passwords, different hashes' },
      { label: 'Hash value', note: 'what the server stores', tone: 'acc' },
    ],
    edges: ['+ salt', 'one-way'],
  },
}
