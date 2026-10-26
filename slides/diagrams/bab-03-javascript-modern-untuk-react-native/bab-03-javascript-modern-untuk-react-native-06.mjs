// Chapter 3 — Modern JavaScript for React Native · diagram 06
// New picture: this slide had none. The slide is a code fence plus two bullets, and the
// two bullets are two guards applied one after the other to the same value — `?.` first,
// then `??`. That order is the lesson (a default is only reachable because the guarded
// access already returned undefined), and it is one-way, so the pattern is `flow`, not
// `beforeAfter`: the slide is not asking students to choose between the operators.
//
// The three stages are the code's own chain: `mahasiswa.alamat` is `null` (line 1 of the
// fence), `mahasiswa.alamat?.kota` yields `undefined` without throwing, and `??` supplies
// the default string. The two arrow labels are the operators themselves — one token each,
// which is all the 106px gap between stage chips can hold at 14px.
//
// Both bullets stay on the slide: it has only two, and a slide that had bullets must keep
// at least two. The picture also does not carry bullet 2's qualifier ("only when the value
// is null or undefined") — that is a fact about when the guard fires, which a three-stage
// chain cannot show.
//
// Provenance: "undefined, not an error" is the code comment's meaning — the fence itself
// says "undefined, tidak error" in Indonesian, and the notes say only that the unguarded
// access "throws an error". Reported as a miss and kept, because "no error" is the whole
// point of the first guard. The third note is bullet 2's own phrase, "a default value".
export default {
  id: '06',
  slide: '?. dan ?? Menjaga Akses ke Data Kosong',
  pattern: 'flow',
  alt:
    'The value travels through two guards: mahasiswa.alamat is null, so the guarded access ' +
    'mahasiswa.alamat?.kota yields undefined instead of an error, and ?? then supplies the ' +
    'default value "Alamat tidak tercatat".',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'mahasiswa.alamat', note: 'null' },
      { label: 'mahasiswa.alamat?.kota', note: 'undefined, not an error' },
      { label: "'Alamat tidak tercatat'", note: 'a default value', tone: 'acc' },
    ],
    edges: ['?.', '??'],
  },
}
