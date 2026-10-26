// Chapter 14 — Debugging, Testing, and QA · diagram 03
// Replaces the old Mermaid chart (bab-14-…-03.mmd), which was a `graph BT`: unit tests at
// the bottom, integration in the middle, end-to-end at the top. That really is a stack —
// each stratum sits on the one below — so the pattern is `layers`, and the array order is
// reversed against the Mermaid source because `layers` draws the first item at the top.
//
// The notes are the slide's own count words ("the fewest… at the top", "fewer integration
// tests in the middle", "many unit tests as the base"). The cost/fragility argument
// ("cost and fragility increase upward") is deliberately left to the presenter notes: a
// 15px right-aligned note cannot hold it, and inventing a short version would be putting
// words on the slide that the slide does not have.
//
// `tone: 'acc'` is on the base, not the top: `layers` defaults the top band to the accent,
// but the zone that matters here is the many cheap unit tests the chapter asks students to
// write. The top two bands are explicitly neutral so only one band glows.
//
// Honest limit: `layers` gives every band the same height, so a pyramid reads as three equal
// slabs rather than a taper. The notes carry the proportion instead (the fewest / fewer /
// many), and the picture's job is the order of the strata, which is exact.
export default {
  id: '03',
  slide: 'Piramida Testing: Banyak di Bawah, Sedikit di Atas',
  pattern: 'layers',
  alt:
    'The testing pyramid, read from the bottom: many unit tests as the base, fewer ' +
    'integration tests in the middle, and the fewest end-to-end tests at the top.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'End-to-end tests', note: 'the fewest', tone: 'neutral' },
      { label: 'Integration tests', note: 'fewer', tone: 'neutral' },
      { label: 'Unit tests', note: 'many', tone: 'acc' },
    ],
  },
}
