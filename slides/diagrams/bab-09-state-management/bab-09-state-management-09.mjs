// Chapter 9 — State Management · diagram 09
// Slide 17, "Three Signs Global State Is Not Needed". No legacy chart.
//
// The slide is three criteria, and the first pass read that as "a list of peers — skip". This
// pass overrules it, because each of the three signs has a *destination* built into it: the
// data that must not go global does not evaporate, it lives somewhere else (computed at
// render, one fetch-and-cache layer, the screen's own local state). Sign → home is a pair of
// rows, which is `beforeAfter`: the left column is the data, the right column is where it
// belongs instead. A `tree` would have had to claim these three things are *contained* in
// something, and a `flow` would have claimed one causes the next; neither is what the slide
// says.
//
// The pattern's job here is the question the slide only half answers: two of the three
// bullets already name their home, the first one does not. "recomputed from items on every
// render" is the chapter's own rule — slide 17's notes ("it can always be computed from the
// item list") and the blockquote two code slides later ("recomputed from `items` on every
// render"). Without that cell the left column is just the three bullets again. The right
// column keeps the deck's own wording ("fetched and cached by one dedicated layer") so the
// picture is a re-reading of the slide, not a paraphrase of it.
//
// Tone: the left panel is `amber`, not the pattern's default red. Red would say "wrong", and
// these three are not wrong — they are real data that must not be *stored globally*. Amber is
// the caution the slide actually gives ("storing derived state opens the door to going out of
// sync"). The right panel takes `acc` because it is the answer: one home per kind of data.
//
// Row 1's left cell moved off the slide into the presenter notes (its words, plus its two
// examples, are in the picture), which is what keeps the canvas clear of the page number at
// the bottom of this slide. All three rows are numbered identically, so the pairing reads
// left-to-right without a legend.
export default {
  id: '09',
  slide: 'Three Signs Global State Is Not Needed',
  pattern: 'beforeAfter',
  alt:
    'The three kinds of data that must not be made global, each with its own home: data that can ' +
    'be recomputed — totalHarga and jumlahItem — is computed from items on every render, ' +
    'server-owned data is fetched and cached by one dedicated layer, and temporary one-screen ' +
    'data stays in that screen’s local state.',
  imgWidth: 1120,
  data: {
    left: {
      title: "DON'T MAKE IT GLOBAL",
      tone: 'amber',
      items: [
        'can be recomputed — totalHarga, jumlahItem',
        'data owned by the server',
        'temporary data for one screen',
      ],
    },
    right: {
      title: 'WHERE IT BELONGS',
      tone: 'acc',
      items: [
        'recomputed from items on every render',
        'fetched and cached by one dedicated layer',
        'local state in that screen',
      ],
    },
  },
}
