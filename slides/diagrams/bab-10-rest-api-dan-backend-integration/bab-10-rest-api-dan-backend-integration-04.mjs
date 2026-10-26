// Chapter 10 — REST API and Backend Integration · diagram 04
// Replaces the old Mermaid chart (bab-10-…-04.mmd): one source and three forward links.
// The relationship really is containment of a kind a tree can carry — "what hangs off
// Chapter 10" — and the three children are siblings with no order between them, so the
// tree's elbows read correctly. `flow` would have put the three destinations in a line
// and implied Chapter 11 leads to Chapter 13.
//
// `tree` renders `label` only (a `note` would be silently dropped), so the reason each
// link exists has to live in the label itself. The destination names are the References
// slide's own entries ("Chapter 11 — Local Data Storage", "Chapter 13 — Authentication
// and Security") and the milestone named in the practicum slide ("Final Project").
//
// This slide is a heading and a picture with no prose, so the build reports the three
// destination labels as provenance misses. The legacy chart carried the same three in
// Indonesian; the English wording comes from the References slide of this chapter.
export default {
  id: '04',
  slide: 'Pola Ini Bertahan Sampai Project Akhir',
  pattern: 'tree',
  alt:
    'Chapter 10 feeds three later destinations: Chapter 11 for local data storage, ' +
    'Chapter 13 for authentication and security, and the Final Project for API integration.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'Chapter 10',
      children: [
        { label: 'Chapter 11 — Local Data Storage' },
        { label: 'Chapter 13 — Authentication and Security' },
        { label: 'Final Project — API integration' },
      ],
    },
  },
}
