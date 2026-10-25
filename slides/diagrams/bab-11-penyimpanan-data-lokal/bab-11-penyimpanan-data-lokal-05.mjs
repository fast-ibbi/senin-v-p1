// Chapter 11 — Local Data Storage · diagram 05
// New picture — there was no such chart in the old Mermaid set. The slide's title is
// "JSON Serialization: Bridging the String Rule", its bullets are the two functions
// plus the word for each direction, and the code beneath them is the same round trip in
// order. That order is the content, so the pattern is `flow`.
//
// The four chips are the four forms the data takes — the array, the JSON string a key
// can hold, the storage entry, and the array again — and each arrow is the call that
// moves the data from one form to the next. The first and the last chip carry the same
// label on purpose: the round trip closes, and `flow` cannot draw that with a loop
// arrow, so the repeat is how the picture says it. The alt text repeats the limit.
//
// The last arrow names two calls (getItem, JSON.parse) because reading back genuinely
// takes both: getItem hands over a string, and only the parse produces the array again.
//
// The picture sits on a `Diagram:` slide of its own, directly after the prose slide: the
// prose slide carries three bullets, a nine-line code fence and a closing bullet, so at
// w:1120 the picture pushed the last bullet out of the frame. The alternative — shrinking
// the picture — breaks the 13px floor at 1160 canvas units, so the slide was split
// instead and no bullet was removed.
export default {
  id: '05',
  slide: 'Diagram: JSON Serialization: Bridging the String Rule',
  pattern: 'flow',
  alt:
    'The serialization round trip, drawn as a one-way chain rather than a loop: ' +
    'daftarCatatan as the array in memory, stringify turning it into a JSON string, ' +
    'setItem storing that string in AsyncStorage under catatan:v1, and getItem with ' +
    'JSON.parse bringing daftarCatatan back. The first and the last chip are the same array.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'daftarCatatan', note: 'the array in memory' },
      { label: 'JSON string', note: 'one long string' },
      { label: 'AsyncStorage', note: 'key catatan:v1' },
      { label: 'daftarCatatan', note: 'the array again', tone: 'acc' },
    ],
    edges: ['stringify', 'setItem', 'getItem, JSON.parse'],
  },
}
