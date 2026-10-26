// Chapter 13 — Authentication and Application Security · diagram 04
// Replaces the old Mermaid chart (bab-13-…-04.mmd), which drew two independent
// chains in one frame — client → Redirect, request → 401 — so the picture read as
// one path with a fork. The slide's point is that these are two separate guards
// doing two different jobs, so the shape is `beforeAfter`: two panels, and each
// row answers the row beside it.
//
// Row 1 is the job of each layer (the slide's own blockquote: "The client directs
// the user; the server decides whether access is allowed"), row 2 is what it
// checks, row 3 is what it answers. Reading across a row is the comparison; the
// presenter notes then ask what happens when only one layer is active.
//
// The left panel is `neutral` because client-side protection is not wrong, it is
// only not the security boundary. The accent sits on the server, which is the
// layer the slide says actually decides.
export default {
  id: '04',
  slide: 'Klien Mengarahkan, Server Memutuskan',
  pattern: 'beforeAfter',
  alt:
    'Two layers of protection compared row by row. The client layer directs the user, reads ' +
    'the authentication status and redirects to /login. The server layer decides whether ' +
    'access is allowed, checks the token on every request and answers 401 Unauthorized.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'CLIENT LAYER',
      tone: 'neutral',
      items: ['Directs the user', 'Reads the authentication status', 'Redirects to /login'],
    },
    right: {
      title: 'SERVER LAYER',
      tone: 'acc',
      items: [
        'Decides whether access is allowed',
        'Checks the token on every request',
        'Answers 401 Unauthorized',
      ],
    },
  },
}
