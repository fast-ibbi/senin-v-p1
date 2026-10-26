// Chapter 12 — Accessing Device Features · diagram 02
// Replaces the old Mermaid chart (bab-12-…-02.mmd), which drew five boxes in a row with
// unlabelled arrows. The relationship really is a chain — your JavaScript, the Expo
// package that bridges it, the OS device API, the hardware, and the value that comes
// back — so the pattern stays `flow`; nothing branched and nothing looped.
//
// The stage names are the slide's own: "you write JavaScript", "the native part is done
// by an Expo package", "a device API", "command the hardware or system services", and
// the presenter notes' "why must the result come back to JavaScript?".
//
// The first stage carries no note on purpose: the legacy chart's "your components and
// functions" is not on this slide, and a flow chip with no note is quieter than a note
// invented to fill the space.
//
// Edge verbs: "bridges" and "command" are the slide's words, "come back" is the notes'
// phrase. "calls" is the one word the picture needs that the prose only implies — the
// build reports it, and it is the connector between the package and the OS API.
export default {
  id: '02',
  slide: 'API Perangkat: JavaScript yang Menyuruh Perangkat Keras',
  pattern: 'flow',
  alt:
    'The device API chain: your JavaScript calls an Expo package, which bridges to the ' +
    "operating system's device API, which commands the hardware or system services; the " +
    'result comes back to JavaScript.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'JavaScript' },
      { label: 'Expo package', note: 'the native part' },
      { label: 'Device API', note: 'the operating system' },
      { label: 'Hardware', note: 'system services' },
      { label: 'Result', note: 'back to JavaScript', tone: 'acc' },
    ],
    edges: ['bridges', 'calls', 'command', 'come back'],
  },
}
