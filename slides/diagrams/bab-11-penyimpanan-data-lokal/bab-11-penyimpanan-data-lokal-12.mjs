// Chapter 11 — Local Data Storage · diagram 12
// New picture. The four bullets are one cause-and-effect story in the order they are written:
// the effect runs once at mount, the list screen stays mounted under the form, so the new note
// does not appear when the user returns, and useFocusEffect is the fix. That is a chain, so
// the pattern is `flow`.
//
// `beforeAfter` was the other candidate (useEffect against useFocusEffect, the deck's most
// used pattern) and it was rejected: this deck already carries four beforeAfter pictures, and
// the slide does not ask the student to choose between two mental models — it walks a bug from
// its cause to its remedy, which is exactly what `flow` draws. The two hooks still sit at the
// two ends of the chain, so the contrast survives inside the chain.
//
// The third chip is red because that stage is the bug; the last chip takes the pattern's
// default accent because it is the fix. The presenter note tells the same story in words
// ("the note is saved, but the screen does not know"), so the picture is the story's skeleton.
//
// Two bullets move VERBATIM to the presenter notes. Bullet 1 ("`useEffect` with empty
// dependencies runs only once when the screen mounts") is the first chip plus its note, and
// bullet 3 ("As a result a new note does not appear when the user returns from the form") is
// the arrow into the red chip plus that chip's label and note. Bullets 2 and 4 stay on the
// slide: bullet 2 carries the Chapter 7 cross-reference and the Stack-navigation reason, which
// the picture cannot show, and bullet 4 carries the judgement "exactly what is wanted".
//
// Provenance: "empty dependencies, runs once on mount" condenses bullet 1 into the note under
// the first chip — the slide spreads the same three facts over one sentence — and "No new note"
// is the chip-sized form of "a new note does not appear". Everything else is the slide's own
// wording.
export default {
  id: '12',
  slide: 'Kapan Data Harus Dimuat Ulang?',
  pattern: 'flow',
  alt:
    'The reload bug drawn as a chain: useEffect with empty dependencies runs only once at ' +
    'mount, the form screen opens on top and covers the list, the user returns and the new note ' +
    'does not appear, and useFocusEffect is the fix because it gains focus and re-triggers.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'useEffect', note: 'empty dependencies, runs once on mount' },
      { label: 'Form opens', note: 'the list screen stays mounted' },
      { label: 'No new note', note: 'does not appear', tone: 'red' },
      { label: 'useFocusEffect', note: 're-triggers every time' },
    ],
    edges: ['covers it', 'the user returns', 'gains focus'],
  },
}
