// Chapter 2 — Development Environment Setup · diagram 02
// Replaces the old Mermaid chart (bab-02-…-02.mmd), which drew a four-box chain plus a second
// edge from Metro to Fast Refresh. The chain is a `flow` — the presenter notes say to read it
// "from left to right" — but `flow` is one-way and has exactly n-1 edges, so the branch cannot
// be an arrow. Fast Refresh is therefore the note on the last stage: it is what the student
// sees at the device after saving a file, which is precisely where the legacy chart's second
// edge pointed.
//
// Every label is the slide's own vocabulary: the edge verbs are the notes' own words ("Metro
// reads every imported module, bundles them, then sends them to the device"), "port 8081" is
// the notes' default port, "not the source files" is the notes' guiding-question answer, and
// "Fast Refresh" is the heading.
export default {
  id: '02',
  slide: 'Metro Membundel Kode, Perangkat Hanya Menerima Hasilnya',
  pattern: 'flow',
  alt:
    'The Metro pipeline left to right: the source files and every imported module are read by ' +
    'the Metro Bundler on port 8081, which produces the bundle — not the source files — that is ' +
    'sent to the device, where a save updates the screen through Fast Refresh.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Source files', note: 'every imported module' },
      { label: 'Metro Bundler', note: 'port 8081' },
      { label: 'The bundle', note: 'not the source files' },
      { label: 'The device', note: 'Fast Refresh on save', tone: 'acc' },
    ],
    edges: ['reads', 'bundles', 'sends'],
  },
}
