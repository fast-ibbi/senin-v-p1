// Chapter 15 — Build and Deployment · diagram 07
// A new picture (no legacy chart at this id). The slide's left panel is headlined "What
// happens during a build" and lists three things in order: Metro produces the JavaScript
// bundle, the bundle is combined with the Android/iOS native shell, the result is one
// installable file. It is a chain of stages with a named verb between each pair, so the
// pattern is `flow` — the order is the content.
//
// The alternative was `tree`: one installable file *contains* the bundle and the native
// shell, which is what kills the misconception the notes name ("If Metro stops, what
// happens?"). It lost because `tree` renders `label` only and drops `note` silently, so
// "Metro", "Android/iOS" and "can be installed" would all disappear from the picture and
// the drawing would be three words under an arrow.
//
// The right panel ("What is not a build") is deliberately not drawn and not trimmed: it is
// an exclusion, not a step, and its two bullets are the only content of that column — moving
// them into the notes would leave a labelled panel with nothing under it.
//
// Provenance: one authored phrase, "Metro produces it" — the slide writes "Metro produces the
// JavaScript bundle", and the pronoun replaces the chip's own label so the note does not say
// "bundle" three times in one row. The two edge verbs are the slide's own words ("The bundle
// is combined with the Android/iOS native shell … one file that can be installed").
//
// Canvas height is written down for one measured reason: the flow reserves a 44px note row
// for up to two lines, and these three notes are one line each, so the geometry leaves 16px
// of dead space at the bottom of the picture. At the full 184px height that dead space pushed
// this slide's bullet list down until its last line landed on the page-number band (measured:
// ink at y 614–635 against the number at 623–635). 168px keeps 14px under the note ink and
// lifts the prose clear. No font size changed — the type is the kit's.
export default {
  id: '07',
  slide: 'Build Bukan npx expo start',
  pattern: 'flow',
  alt:
    'What happens during a build: Metro produces the JavaScript bundle, the bundle is ' +
    'combined with the Android/iOS native shell, and the result is one file that can be ' +
    'installed.',
  imgWidth: 1120,
  data: {
    canvas: [1160, 168],
    steps: [
      { label: 'JavaScript bundle', note: 'Metro produces it' },
      { label: 'Native shell', note: 'Android / iOS' },
      { label: 'One installable file', note: 'can be installed', tone: 'acc' },
    ],
    edges: ['combined with', 'assembled into'],
  },
}
