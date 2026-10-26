// Chapter 12 — Accessing Device Features · diagram 03
// Replaces the old Mermaid chart (bab-12-…-03.mmd): a decision flowchart with two
// diamond tests (`granted?`, `canAskAgain?`) and four exits. A diamond is not one of the
// six patterns, and the slide's own framing is a mode set, not a chain: the notes say
// "there are three exits, not two: granted, denied temporarily, and denied permanently.
// The third exit is the one students forget most often." Modes plus the events that move
// between them is `stateMachine`.
//
// The chips are the slide's words: "check first, request if needed" (the blockquote) and
// the notes' three exits, kept verbatim so the two denied chips are told apart at a
// glance. "Check" and "Request" are steps rather than statuses, but they are what the
// student decides between, and the legacy chart drew them the same way.
//
// The check → request edge is labelled "if needed" — the blockquote's phrase, and the
// whole point of checking before requesting.
//
// Row order is set by the router, not by reading order, and the reason is measurable:
// a stateMachine draws a reverse edge as an arc over the row, and that arc only lands on
// the target chip when the two chips are NEIGHBOURS. Two slots apart, the arc comes in
// too shallow and its head stops ~15px past the chip's corner (measured: head ink at
// x429–439 while the Request border sits at x415) — the head floats in white space and
// the edge reads as coming from nowhere. Hence Granted sits immediately left of Request:
// both edges into Request (granted off-ramp, ask-again loop) are now one slot away, land
// on the top border, and stay short enough to be unambiguous. Request → Granted still
// reads as a fan-out off Request, which is what it is; the row is a mode set, not a
// timeline, so the order of the chips carries no chronology.
//
// The return arc from "Denied temporarily" back to "Request" carries no state change of
// its own beyond going back, so it is the one edge whose label ("ask again") is not on
// this slide: the word is `canAskAgain` on "Reading the Permission Result" and
// "don't ask again" on "Handling Denial as a Normal State". The build reports it.
//
// The last arc (temporarily → permanently) is unlabelled on purpose: the two red chips
// sit next to each other, and a label there would need more width than the 90px gap
// between neighbouring chips allows.
export default {
  id: '03',
  slide: 'Alur Permintaan Izin Punya Tiga Pintu Keluar',
  pattern: 'stateMachine',
  alt:
    'Permission modes: from Check, "if needed" moves to Request and a granted permission ' +
    'lands in Granted. A request can be denied, landing in Denied temporarily — which can ' +
    'loop back to Request — or escalate to Denied permanently.',
  imgWidth: 1120,
  data: {
    initial: 'check',
    states: [
      { id: 'check', label: 'Check' },
      { id: 'granted', label: 'Granted', tone: 'green' },
      { id: 'request', label: 'Request' },
      { id: 'temp', label: 'Denied temporarily', tone: 'red' },
      { id: 'perm', label: 'Denied permanently', tone: 'red' },
    ],
    transitions: [
      { from: 'check', to: 'request', label: 'if needed' },
      { from: 'request', to: 'granted', label: 'granted', tone: 'green' },
      { from: 'request', to: 'temp', label: 'denied', tone: 'red' },
      { from: 'temp', to: 'request', label: 'ask again' },
      { from: 'temp', to: 'perm' },
    ],
  },
}
