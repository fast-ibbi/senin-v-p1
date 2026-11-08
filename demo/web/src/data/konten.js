/**
 * Pemuatan konten HTML per bab.
 *
 * Berkas fragmen HTML di `konten/**` diimpor sebagai string mentah (?raw) secara
 * malas: tiap bab menjadi satu chunk sendiri, jadi halaman muka tidak ikut
 * menyeret seluruh isi konten.
 *
 * Kunci modul berbentuk '../konten/<folder-bab>/<file>.html'.
 */
const modulKonten = import.meta.glob('../../konten/**/*.html', {
  query: '?raw',
  import: 'default',
})

export function kunciKonten(slug, file) {
  return `../../konten/${slug}/${file}`
}

export function adaKonten(slug, file) {
  return Boolean(modulKonten[kunciKonten(slug, file)])
}

/** Muat isi sebuah berkas konten; lempar galat bila berkas tidak ada. */
export async function muatKonten(slug, file) {
  const pemuat = modulKonten[kunciKonten(slug, file)]
  if (!pemuat) {
    throw new Error(`Berkas konten tidak ditemukan: konten/${slug}/${file}`)
  }
  return pemuat()
}
