// Chapter 13 — Authentication and Application Security · diagram 15
// "Without HTTPS …" and "With HTTPS …" is literally a before/after, and the two rows answer each
// other: row 1 is what the data looks like on the wire, row 2 is where that arrangement is
// allowed to be used. `layers` was considered — TLS really does sit between the message and the
// network — and rejected: a stack shows one arrangement and cannot show the one you must not ship.
//
// The left panel takes the pattern's default `red` here, unlike pictures 02/04/06/09, because
// this is the one place in the chapter where a side genuinely is wrong: cleartext in production is
// a defect, not a different valid model.
//
// Trimming: bullets 1, 3 and 5 are the four panel rows, so they moved verbatim into the notes.
// What stays is bullet 2 (the man-in-the-middle — the attack itself, which a row cannot depict)
// and bullet 4 (Android 9 / API 28 blocking cleartext — a platform fact with a version number in
// it, useless inside a chip and wrong to compress).
//
// Labels: "email, passwords, and tokens", "cleartext", "TLS encrypts the request and the response",
// "localhost", "local development exception" and "production" are the slide's own words. "Without
// HTTPS" / "With HTTPS" are the heading's frame, not an invented participant: only two actors
// exist in the picture and both are the same request.
export default {
  id: '15',
  slide: 'Prinsip 3: Tanpa HTTPS, Password Dibaca dari Jaringan yang Sama',
  pattern: 'beforeAfter',
  alt:
    'Without HTTPS, email, passwords and tokens travel as cleartext, and that is only a local ' +
    'development exception for localhost. With HTTPS, TLS encrypts the request and the response, ' +
    'and it is mandatory in production.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'WITHOUT HTTPS',
      tone: 'red',
      items: [
        'Email, passwords, and tokens travel as cleartext',
        'Only a local development exception: localhost',
      ],
    },
    right: {
      title: 'WITH HTTPS',
      tone: 'acc',
      items: ['TLS encrypts the request and the response', 'Mandatory in production'],
    },
  },
}
