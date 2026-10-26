// Chapter 11 — Local Data Storage · diagram 04
// Replaces the old Mermaid diagram (bab-11-…-04.mmd), which drew five boxes in a
// top-down graph: rute di app/ → layar di screens/ → API kecil storage/notesStorage.js
// → AsyncStorage (kunci catatan:v1), with a side branch from the screen to
// utils/formatTanggal.js.
//
// The picture keeps the part the slide teaches — the three levels a data change
// passes through — and drops the route node and the utils branch: navigation is
// Chapter 7 material that this slide's notes explicitly do not repeat, and
// formatTanggal is a leaf helper, not a layer.
//
// `layers` rather than `flow`: the small API both saves and reads, so a one-way
// arrow would be a half-truth, and `layers` names the levels without asserting a
// direction. The accent sits on the middle band because the small API is the idea
// this chapter introduces; the top and bottom bands are written `neutral`
// explicitly, since `layers` defaults the top band to the accent.
export default {
  id: '04',
  slide: 'Alur Data: Layar, API Kecil, Lalu Penyimpanan',
  pattern: 'layers',
  alt:
    'Three levels a data change passes through: the screen in screens/, the small API in ' +
    'storage/notesStorage.js that the screen calls, and storage itself — AsyncStorage under ' +
    'the key catatan:v1.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'Screen', note: 'screens/DaftarCatatan.js', tone: 'neutral' },
      { label: 'Small API', note: 'storage/notesStorage.js', tone: 'acc' },
      { label: 'Storage', note: 'AsyncStorage, key catatan:v1', tone: 'neutral' },
    ],
  },
}
