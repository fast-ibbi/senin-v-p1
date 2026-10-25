// Chapter 7 — App Navigation · diagram 08
// The case study's three bullets are **Pattern** (three tabs + a stack inside each tab),
// **Guard** (one access check on the group layout) and **Deep linking** (a cancellation
// notification opens the Appointment Detail). The first two are already drawn in this
// chapter — diagram 03 draws a tab owning a Stack, diagram 05 draws the group layout above
// every screen it protects — so redrawing them here would be filler. The third is the one
// claim no other picture in the chapter makes, and it is a chain: a notification, then the
// address it carries, then the screen that address opens. That is `flow`.
//
// Only the deep-link bullet is the picture, so only that bullet moves into the presenter
// notes. Pattern and Guard stay on the slide as text, because the picture says nothing
// about either — moving them would strip facts the picture does not show.
//
// The chips are the slide's own words: "a cancellation notification", the address
// `sehatin://janji/415` exactly as the slide writes it, and "Appointment Detail". The two
// edge labels are the slide's own preposition and verb from "opens … via …": read left to
// right, the notification arrives via that address, and the address opens the detail
// screen. No stage is invented — the notification, the address and the screen are the
// slide's three nouns.
//
// The third chip is accented because it is where the chain ends, and its note ties it back
// to the Pattern bullet: the detail screen is one of the screens the Appointments stack
// owns ("a stack inside each tab").
export default {
  id: '08',
  slide: 'Case Study: the "SehatIn" Clinic',
  pattern: 'flow',
  alt:
    'The case study\'s deep link, stage by stage: a cancellation notification arrives via ' +
    'sehatin://janji/415, and that address opens the Appointment Detail — one of the screens ' +
    'the Appointments stack owns.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'cancellation notification' },
      { label: 'sehatin://janji/415', note: 'the deep link' },
      { label: 'Appointment Detail', note: 'in the Appointments stack', tone: 'acc' },
    ],
    edges: ['via', 'opens'],
  },
}
