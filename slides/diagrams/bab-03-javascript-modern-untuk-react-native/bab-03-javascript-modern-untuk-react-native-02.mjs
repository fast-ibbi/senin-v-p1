// Chapter 3 — Modern JavaScript for React Native · diagram 02
// Replaces the old Mermaid chart (bab-03-…-02.mmd), which drew the same three boxes with
// unlabelled arrows. The shape is a chain — data leaves one file, is processed in the
// next, and is saved to a third — so the pattern is `flow`, and the two arrows now carry
// the verbs the Mermaid chart left implicit: `export` (the slide's own word, "only what is
// exported can be used by another file") and `write` (the prose's implication: the logic
// file produces the JSON file).
//
// The file names carry the lesson — "splitting code into files" means nothing without
// them — so they are kept verbatim rather than paraphrased into roles. The build's
// provenance report names them as not on this slide: they are named on the practicum
// slides of the same chapter (29–31) and in kode/bab-03/. The two notes ARE this slide's
// words ("the data file", "the logic file").
export default {
  id: '02',
  slide: 'Modules: Splitting Code into Files',
  pattern: 'flow',
  alt:
    'Modules split code into files: data-mahasiswa.mjs is the data file and exports ' +
    'daftarMahasiswa; pengolah-nilai.mjs is the logic file and imports it; the result is ' +
    'written to hasil-rekap.json.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'data-mahasiswa.mjs', note: 'the data file' },
      { label: 'pengolah-nilai.mjs', note: 'the logic file' },
      { label: 'hasil-rekap.json', tone: 'acc' },
    ],
    edges: ['export', 'write'],
  },
}
