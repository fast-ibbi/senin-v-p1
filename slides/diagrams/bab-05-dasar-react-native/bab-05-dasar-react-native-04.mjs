// Chapter 5 — React Native Basics · diagram 04
// Replaces the old Mermaid chart. The chart carries one return side — a touch travelling
// up from BarisMahasiswa to App — that neither `tree` nor `flow` can draw. The `sequence`
// pattern is meant for ordered exchanges, so that return arrow is now really drawn
// instead of lost.
export default {
  id: '04',
  slide: 'Practicum: Student Profile Layout',
  pattern: 'sequence',
  alt:
    'Student data flows down through props from App to ProfilMahasiswa and ' +
    'BarisMahasiswa; a touch flows back up to App through padaPilih.',
  imgWidth: 1120,
  data: {
    actors: ['data/mahasiswa.js', 'App.js', 'ProfilMahasiswa', 'BarisMahasiswa'],
    messages: [
      { from: 'data/mahasiswa.js', to: 'App.js', label: 'initial data' },
      { from: 'App.js', to: 'ProfilMahasiswa', label: 'props: mahasiswa' },
      { from: 'App.js', to: 'BarisMahasiswa', label: 'props: aktif + padaPilih' },
      { from: 'BarisMahasiswa', to: 'App.js', label: 'padaPilih', tone: 'acc' },
    ],
  },
}
