// Chapter 3 — Modern JavaScript for React Native · diagram 07
// New picture: this slide had none. The heading names the relationship itself — copying,
// then updating — and that is a chain: `...dataLama` scatters the old object's keys into a
// new object literal, then `ipk: 3.35` overwrites one key of that copy, and what comes out
// is `dataBaru` while `dataLama` keeps `ipk` 3.2. Three stages, two arrows, so `flow`.
//
// The alternative reading of the slide — spread scatters versus rest gathers — is bullet 1
// and only bullet 1; the heading and the second code block are about copying and updating,
// which is what the React note ("copy first, then update") is for. That alternative is also
// a `beforeAfter`, and this deck already spends three of its seven pictures on that pattern,
// which is the ceiling.
//
// Labels: both chips are the code's variable names, the notes are the slide's own phrases
// (`ipk 3.2` and `ipk 3.35` from the two `console.log` lines, "copy first" and "a new
// object" from the presenter notes), and the second arrow label is the overriding key
// exactly as it is written in the fence. Nothing here is paraphrased into a new vocabulary.
//
// Both bullets stay: the slide has only two, and the picture does not show the second job
// of `...` (rest gathers) that bullet 1 spends half its sentence on.
//
// `canvas` height is forced to the kit's 160 floor. The pattern's default is 184 units
// (24 pad + 76 chip + 16 gap + 44 note box), and a one-line note only needs 18 of those 44,
// so the default leaves the picture taller than its ink. This slide also carries a file line,
// a five-line fence and two bullets, and at w:1120 the 184-unit picture pushed the second
// bullet to within 18px of the footer. Cropping the empty band is what bought the clearance —
// no label moved and no font changed.
export default {
  id: '07',
  slide: 'Spread Operator: Copying and Updating',
  pattern: 'flow',
  alt:
    'Copy first, then update: ...dataLama copies every key of the old object into a new ' +
    'literal, ipk: 3.35 then overwrites the copied key, and the result is dataBaru with ipk ' +
    '3.35 while dataLama still holds ipk 3.2. The original object is never mutated.',
  imgWidth: 1120,
  data: {
    canvas: [1160, 160],
    steps: [
      { label: 'dataLama', note: 'ipk 3.2' },
      { label: '{ ...dataLama }', note: 'copy first' },
      { label: 'dataBaru', note: 'a new object', tone: 'acc' },
    ],
    edges: ['spread', 'ipk: 3.35'],
  },
}
