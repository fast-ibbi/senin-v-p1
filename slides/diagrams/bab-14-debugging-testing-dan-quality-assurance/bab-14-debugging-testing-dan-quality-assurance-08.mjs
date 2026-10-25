// Chapter 14 — Debugging, Testing, and QA · diagram 08
// New picture (this deck had no chart here). The case study carries the slide's own two bold
// labels — "Symptoms in the field" and "Root cause after the audit" — which is a case with
// two sides: three failures the field meets, two testing gaps the audit finds. Two models
// held side by side with numbered rows is `beforeAfter`; nothing here is a chain (`flow`) and
// nothing is contained by anything else (`tree`), because the slide never says which gap
// produced which symptom. That mapping lives on the next slide ("Incident Analysis: The Stage
// That Should Have Caught It") and is deliberately not borrowed here.
//
// Row counts are uneven (3 vs 2) because the slide's own lists are uneven. Padding the audit
// panel to three rows would be writing a cause the material does not contain.
//
// Panel titles are the slide's own fragments rather than its two bold headings: the headings
// themselves stay on the slide with one bullet each, and a figure that repeats them verbatim
// two centimetres higher reads as a copy-paste accident instead of a summary.
//
// Trimmed, verbatim, into this slide's presenter notes: the second and third symptom bullets
// plus the first cause bullet. The picture already states all five in the slide's own words,
// and the slide cannot hold a legible picture with the full six-line grid above it. One bullet
// of each column stays: the first symptom, and the second cause — the shorter of the two, so
// that its second line ends at x ≈ 920 and the deck's page number at x ≈ 1105 is left clear.
// Those two kept bullets do restate one picture row each; that is the price of the two-bullet
// floor and it is stated in the notes rather than hidden.
//
// `imgWidth` stays at the default 1120. The picture sits between the lead line and the grid,
// so its height comes out of what the grid and the footer have left: at 1120 the grid's last
// line lands at y ≈ 638 and the footer rule is at 684. Raising the width further would only
// eat that margin; lowering it would push the 14px row badges toward the 13px floor for no
// gain, so the default is also the honest choice here.
//
// Left panel is red (the failures the field met) and the right is amber (the gaps that caused
// them): neither side is the "right" answer, so the default red/accent pair would read as a
// verdict. Amber marks a cause worth fixing, red marks what already broke.
export default {
  id: '08',
  slide: 'Case Study: The KRS Online Incident',
  pattern: 'beforeAfter',
  alt:
    'Symptoms in the field beside the root cause after the audit: a form that accepted a ' +
    '6-digit NIM, blank KRS screens, and a save button covered by the iOS keyboard, caused by ' +
    'testing only the success flow on one Android emulator and never unit-testing the ' +
    "validation functions.",
  imgWidth: 1120,
  data: {
    left: {
      title: 'IN THE FIELD',
      tone: 'red',
      items: [
        'The form accepted a 6-digit NIM, so foreign data was saved',
        'Many students saw a blank screen when opening the KRS list',
        'iOS users could not save because the button was covered by the keyboard',
      ],
    },
    right: {
      title: 'AFTER THE AUDIT',
      tone: 'amber',
      items: [
        'The team only tested the success flow on one Android emulator, with no real-device test',
        "There were no unit tests for that app's validation functions",
      ],
    },
  },
}
