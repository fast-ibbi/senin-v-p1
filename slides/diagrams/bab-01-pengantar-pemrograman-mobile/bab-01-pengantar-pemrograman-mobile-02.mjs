// Chapter 1 — Introduction to Mobile Programming · diagram 02
// Replaces the old Mermaid chart (bab-01-…-02.mmd), which drew one question with four
// branches into four approaches. That shape is not a tree: each branch has exactly one
// child, so a `tree` would put every priority and its approach on the same y — zero-height
// elbows — and the pair would read as eight unrelated siblings. The relationship is four
// parallel pairs on one axis, which is exactly `beforeAfter`.
//
// The left column is `tone: 'neutral'`: all four priorities are legitimate, so the default
// red would label three of them "wrong". The automatic badges carry the pairing, which is
// what the four branch rows of the old chart were for.
//
// The right column uses the four approach names exactly as Table 1.1 spells them, so the
// picture, the table two slides earlier, and the summary all agree.
export default {
  id: '02',
  slide: 'Prioritas Pasar Menentukan Urutan Platform',
  pattern: 'beforeAfter',
  alt:
    'Four priorities each point at one approach: peak performance and the newest device ' +
    'features favor native, a limited budget with no device features needed favors mobile ' +
    'web, a web-strong team that accepts a UX compromise favors hybrid, and a business app ' +
    'with two platforms, forms, data, and a server favors cross-platform.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'PRIORITY',
      tone: 'neutral',
      items: [
        'Peak performance, newest device features',
        'Limited budget, no device features needed',
        'Web-strong team, accepts a UX compromise',
        'Business app: two platforms, forms, data, server',
      ],
    },
    right: {
      title: 'APPROACH',
      tone: 'acc',
      items: ['Native', 'Mobile web', 'Hybrid', 'Cross-platform'],
    },
  },
}
