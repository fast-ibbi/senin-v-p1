// Chapter 13 — Authentication and Application Security · diagram 07
// Two files were rejected here before this one. The first was a `sequence`: four messages
// (register, 201, login, 200) draw the two round trips best, but a sequence is 318 canvas
// units tall, and on this slide — heading + three-column table + two bullets — that pushed
// the last bullet into the page-number band (measured on the Marp render). The second was a
// `flow`: register → login → token is a straight line, but it claims an order the table does
// not make, and the deck already uses `flow` four times.
//
// So: `tree`. Both endpoints hang off one path prefix, and each endpoint is answered by one
// status code. That is containment, and it is the one thing the table's three columns cannot
// show — that these are two doors in the same wall. Height stays at 172 units, so the picture
// sits above the table without touching the bullets.
//
// The 401 answer is deliberately not drawn: it is an alternative answer to the login request,
// and it would sit as a second child of `login` making login look like it answers twice. The
// bullet that carries it (`Wrong credentials are answered by the server with 401 Unauthorized`)
// stays on the slide with its cause intact. Nothing was trimmed: both bullets carry facts no
// node shows (the 401, and how the book's server is started).
//
// Root and leaves are the slide's own strings; `POST /api/auth` is the shared prefix of the two
// endpoint cells, and `register` / `login` are the two halves the heading names.
export default {
  id: '07',
  slide: 'Register dan Login: Dua Endpoint, Satu Tiket Masuk',
  pattern: 'tree',
  alt:
    'Two endpoints hang off POST /api/auth: register is answered with 201 Created and login is ' +
    'answered with 200 OK.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'POST /api/auth',
      children: [
        { label: 'register', children: [{ label: '201 Created' }] },
        { label: 'login', children: [{ label: '200 OK' }] },
      ],
    },
  },
}
