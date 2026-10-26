// Chapter 2 — Development Environment Setup · diagram 05 (new: no legacy Mermaid chart at 05)
//
// The npm slide lists three duties as three peers, but the duties are one pipeline: a recorded
// version list, one command, a registry, and a folder. The notes state the order themselves —
// "just run npm install and every package is reinstalled according to the package.json record" —
// which is a chain with named stages between, so `flow`.
//
// Why the registry is a stage and not a side note: the presenter notes draw the distinction
// between the registry and a local folder ("the online storehouse npmjs.com, not a folder on the
// student's computer"), and the trimmed first bullet names npmjs.com, so the picture has to hold
// that stage or the fact would leave the slide.
//
// Trimming: two of the five bullets duplicated what the arrows say (the download and the
// node_modules folder). They moved verbatim into the presenter notes; the version-record bullet
// stayed because it is the slide's link to package.json, and both "If done manually" bullets
// stayed because the picture does not show what goes wrong without npm.
export default {
  id: '05',
  slide: 'npm Mencatat Daftar Paket, Bukan Menyimpannya Sendiri',
  pattern: 'flow',
  alt:
    'The npm pipeline: package.json keeps the version record, npm install reads it, the packages ' +
    'are downloaded from the npmjs.com registry, and every one of them is stored in node_modules/.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'package.json', note: 'the version record' },
      { label: 'npm install', note: 'reinstalls them all' },
      { label: 'npmjs.com registry', note: 'the online storehouse' },
      { label: 'node_modules/', note: 'every package', tone: 'acc' },
    ],
    edges: ['reads', 'downloads from', 'stores in'],
  },
}
