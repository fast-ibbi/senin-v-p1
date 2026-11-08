import { Link } from 'react-router-dom'
import Kerangka from '../komponen/Kerangka.jsx'
import { BABS } from '../data/bab.js'

/**
 * Halaman muka: daftar 15 bab dengan status ketersediaan konten demo.
 */
export default function Muka() {
  return (
    <Kerangka>
      <h1>Demo Web · Pemrograman Mobile</h1>
      <p className="ringkas">
        Situs demo interaktif kuliah <strong>Pemrograman Mobile</strong> (React Native + Expo).
        Tiap bab memuat penjelasan yang diturunkan dari <code>slides/</code>, snippet kode
        verbatim dari deck, buku, dan praktikum, serta perbandingan{' '}
        <strong>sebelum/sesudah</strong> — cara lama yang salah atau naif di samping cara yang
        benar.
      </p>
      <p>
        Bab <strong>4 — Dasar-Dasar React</strong> dan <strong>5 — Dasar React Native</strong>{' '}
        sudah lengkap. Bab lain menyusul bertahap dengan pola yang sama: tiap bab folder
        sendiri berisi berkas HTML konten, dirender oleh kerangka SPA ini.
      </p>
      <ul className="daftar-bab">
        {BABS.map((b, indeks) => (
          <li key={b.slug}>
            <Link to={`/bab/${b.slug}`}>
              <span className="nomor">Bab {indeks + 1}</span>
              <span className="judul">{b.judul}</span>
              <span className="keterangan">
                {b.pertemuan}
                {b.status === 'lengkap'
                  ? ` · ${b.berkas.length} halaman`
                  : ' · konten sedang ditulis'}
              </span>
              {b.status !== 'lengkap' && (
                <span className="keterangan">
                  <span className="segera">Segera</span> — kerangka sudah siap, konten menyusul.
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </Kerangka>
  )
}
