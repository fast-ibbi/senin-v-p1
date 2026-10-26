// Chapter 7 — App Navigation · diagram 01
// New picture (the old Mermaid set had no chart for this slide). The slide is a "why"
// slide whose five bullets interleave two paths: hand-built navigation and a navigation
// library. The relationship is two models on the same axis, so `beforeAfter` carries it.
//
// Every row answers the same dimension: where the truth about the screen lives, what you
// write yourself, and what it costs. Left is the default `red` because the slide itself
// calls the hand-built path "the result": mixed state, inaccurate history, inconsistent
// transitions. Right is `acc`, the path the presenter notes recommend.
//
// Left/right titles are taken from the slide's own words, never invented: the left panel
// keeps "WITHOUT A LIBRARY" ("Without a library, the active screen is kept in state and
// the back logic is written by hand") and the right panel is "THE PAYOFF" — the slide's
// own label for the library side ("The payoff: the app flow is readable from the folder
// tree, not from registration code").
export default {
  id: '01',
  slide: 'Salah Memilih Navigasi Terasa Langsung oleh Pengguna',
  pattern: 'beforeAfter',
  alt:
    'Two ways to own navigation. Hand-built: the active screen is kept in state, the back ' +
    'logic is written by hand, and the history is inaccurate. Library: the app flow is ' +
    'readable from the folder tree rather than from registration code, at the price of ' +
    'creating a screen on the fly straight from code.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'WITHOUT A LIBRARY',
      tone: 'red',
      items: [
        'Active screen is kept in state',
        'Back logic is written by hand',
        'History is inaccurate',
      ],
    },
    right: {
      title: 'THE PAYOFF',
      tone: 'acc',
      items: [
        'App flow is readable from the folder tree',
        'Not from registration code',
        'Creating a screen on the fly straight from code',
      ],
    },
  },
}
