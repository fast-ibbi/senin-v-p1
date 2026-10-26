// Chapter 3 — Modern JavaScript for React Native · diagram 03
// Replaces the old Mermaid chart (bab-03-…-03.mmd). The relationship really is a mode
// set with events: one starting mode and two terminal ones, reached by the two calls the
// Promise constructor hands you. `stateMachine` is therefore the right pattern, not a
// chain — a chain would put fulfilled and rejected in a line and imply one follows the
// other.
//
// The arc labels stay as short as the Mermaid chart's "resolve(hasil)" / "reject(alasan)":
// the straight label above an adjacent arrow has a 90px box, and "resolve(result)" does
// not fit it at 14px. Tone green/red marks which ending is which; the starting state keeps
// the accent through `initial`.
//
// Provenance: pending, fulfilled, rejected, resolve and reject lived only in the old
// Mermaid chart. The slide's blockquote and notes describe the promise without naming the
// three states, so the build reports all five — expected, and the reason this picture is
// on the slide at all.
export default {
  id: '03',
  slide: 'Promise Punya Tiga Keadaan',
  pattern: 'stateMachine',
  alt:
    'The three states of a Promise: it starts pending, becomes fulfilled when resolve is ' +
    'called with the result, and becomes rejected when reject is called with the reason. ' +
    'It never returns from fulfilled or rejected to pending.',
  imgWidth: 1120,
  data: {
    initial: 'pending',
    states: [
      { id: 'pending', label: 'pending' },
      { id: 'fulfilled', label: 'fulfilled', tone: 'green' },
      { id: 'rejected', label: 'rejected', tone: 'red' },
    ],
    transitions: [
      { from: 'pending', to: 'fulfilled', label: 'resolve', tone: 'green' },
      { from: 'pending', to: 'rejected', label: 'reject', tone: 'red' },
    ],
  },
}
