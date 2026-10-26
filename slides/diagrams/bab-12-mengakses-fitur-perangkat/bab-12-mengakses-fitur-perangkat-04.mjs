// Chapter 12 — Accessing Device Features · diagram 04
// Replaces the old Mermaid chart (bab-12-…-04.mmd), which was a top-down flowchart:
// the profile screen, four feature branches, a "Save" node that all four fed into, and
// two leaves under it. That chart was not a tree — three of its edges converged on
// "Save" — and `tree` is the only containment pattern in the set.
//
// What survives is the containment the slide actually states, in its own words:
// "File structure: App.js, screens/ProfilMahasiswa.js, utils/profilStorage.js" is the
// three-file skeleton, and "four data groups: academic, photo, location, and device
// information" is what the screen holds. One screen, storage split into utils — the
// presenter notes say exactly that.
//
// What is dropped: the legacy chart's "Simpan Profil" junction, `simpanProfil()` and the
// test notification. All three are steps, not containment, and a tree cannot draw an
// arrow into a save step without inventing a parent for it. The save/load code is the
// subject of the next slide ("Profile Save and Load Pattern").
//
// The two file chips render monospace because `tree` switches any label containing a
// slash to mono; `App.js` is written with its extension for the same reason — so the
// three file names share one voice instead of one chip looking accidental.
export default {
  id: '04',
  slide: 'Modul Profil: Empat Kelompok Data, Satu Layar',
  pattern: 'tree',
  alt:
    'The Student Profile App file structure: App.js holds screens/ProfilMahasiswa.js, and ' +
    'the screen holds the four data groups — academic, photo, location and device info — ' +
    'with utils/profilStorage.js beside it.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'App.js',
      children: [
        {
          label: 'screens/ProfilMahasiswa.js',
          tone: 'acc',
          children: [
            { label: 'Academic' },
            { label: 'Photo' },
            { label: 'Location' },
            { label: 'Device info' },
          ],
        },
        { label: 'utils/profilStorage.js' },
      ],
    },
  },
}
