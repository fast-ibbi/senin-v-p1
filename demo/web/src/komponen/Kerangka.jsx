import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BABS } from '../data/bab.js'
import SisiSubbab from './SisiSubbab.jsx'

/**
 * Kerangka situs: kepala (jejak + navigasi berkas bab), bilah sisi (daftar
 * semua bab + berkas bab aktif), isi, dan kaki. Tautan "langkah" sebelum/
 * sesudah berpindah antarberkas dalam bab yang sama.
 *
 * Di layar sempit (≤ 980px) bilah sisi disembunyikan di luar layar dan dibuka
 * sebagai laci lewat tombol "Menu" di kepala; laci menutup saat halaman
 * berpindah, layar latar diklik, atau tombol Escape ditekan.
 */
export default function Kerangka({
  bab,
  berkasAktif,
  children: anak,
  langkah,
  punyaJudulKonten = false,
  subbab = [],
}) {
  const lokasi = useLocation()
  const [sisiTerbuka, setSisiTerbuka] = useState(false)
  const [sempit, setSempit] = useState(() => window.matchMedia('(max-width: 980px)').matches)
  const tombolRef = useRef(null)
  const sisiRef = useRef(null)

  // Sinkronkan status "layar sempit" dengan media query CSS yang sama.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 980px)')
    const sinkron = () => setSempit(mq.matches)
    sinkron()
    mq.addEventListener('change', sinkron)
    return () => mq.removeEventListener('change', sinkron)
  }, [])

  // Tutup laci setiap berpindah halaman.
  useEffect(() => {
    setSisiTerbuka(false)
  }, [lokasi.pathname])

  // Saat laci terbuka: kunci gulir badan halaman, pindahkan fokus ke laci,
  // dan tutup saat Escape ditekan. Saat tertutup, kembalikan fokus ke tombol.
  useEffect(() => {
    if (!sisiTerbuka || !sempit) return
    const badan = document.body
    const gulirSebelumnya = badan.style.overflow
    badan.style.overflow = 'hidden'
    sisiRef.current?.focus()
    const tutupDenganEscape = (e) => {
      if (e.key === 'Escape') setSisiTerbuka(false)
    }
    document.addEventListener('keydown', tutupDenganEscape)
    return () => {
      document.removeEventListener('keydown', tutupDenganEscape)
      badan.style.overflow = gulirSebelumnya
      tombolRef.current?.focus()
    }
  }, [sisiTerbuka, sempit])

  return (
    <>
      <a className="lewati" href="#isi">
        Lewati ke isi
      </a>

      <header className="puncak">
        <div className="puncak-atas">
          <button
            type="button"
            ref={tombolRef}
            className="tombol-sisi"
            aria-expanded={sisiTerbuka}
            aria-controls="sisi-samping"
            onClick={() => setSisiTerbuka((terbuka) => !terbuka)}
          >
            <span className="tombol-sisi-ikon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            Menu
          </button>
          <p className="jejak">
            Demo web · {bab ? `${bab.judul} · ${bab.pertemuan}` : 'Pemrograman Mobile'}
          </p>
        </div>
        {bab && (
          <nav className="nav-bab" aria-label="Navigasi bab">
            <NavLink to={`/bab/${bab.slug}`} end>
              {bab.judul}
            </NavLink>
            {bab.berkas.map((b) => (
              <span key={b.file} className="nav-item">
                <span className="pemisah" aria-hidden="true">
                  |
                </span>
                <NavLink
                  to={`/bab/${bab.slug}/${b.file === 'index.html' ? '' : b.file}`}
                  end
                >
                  {b.judul}
                </NavLink>
              </span>
            ))}
          </nav>
        )}
      </header>

      {sisiTerbuka && (
        <button
          type="button"
          className="sisi-penutup"
          aria-label="Tutup menu"
          tabIndex={-1}
          onClick={() => setSisiTerbuka(false)}
        />
      )}

      <div className={`kerangka${subbab.length ? '' : ' kerangka-tanpa-kanan'}`}>
        <aside
          id="sisi-samping"
          ref={sisiRef}
          tabIndex={-1}
          aria-hidden={sempit && !sisiTerbuka}
          className={`sisi${sisiTerbuka ? ' terbuka' : ''}`}
        >
          <nav
            aria-label="Daftar bab"
            onClick={(e) => {
              // Tautan ke halaman yang sama tidak mengubah pathname; tutup
              // laci langsung supaya tidak ada laci yang tersisa terbuka.
              if (e.target.closest('a')) setSisiTerbuka(false)
            }}
          >
            <Link to="/" className="sisi-balik">
              ← Semua bab
            </Link>
            <p className="sisi-judul">15 bab</p>
            <ul className="sisi-daftar">
              {BABS.map((b, indeks) => (
                <li key={b.slug}>
                  <NavLink to={`/bab/${b.slug}`} end>
                    <span className="sisi-nomor">Bab {indeks + 1}</span> {b.singkat}
                  </NavLink>
                  {b === bab && b.berkas.length > 0 && (
                    <ul className="sisi-daftar sisi-daftar-cabang">
                      {b.berkas.map((berkas) => (
                        <li key={berkas.file}>
                          <NavLink
                            to={`/bab/${b.slug}/${berkas.file === 'index.html' ? '' : berkas.file}`}
                            end
                          >
                            {berkas.judul}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            {bab && (
              <p className="sisi-status">
                Status bab ini: <strong>{bab.status === 'lengkap' ? 'Lengkap' : 'Menunggu penulisan'}</strong>
                {bab.status !== 'lengkap' && <span className="segera"> (segera)</span>}
              </p>
            )}
          </nav>
        </aside>

        <main className="isi-utama" id="isi">
          {berkasAktif && !punyaJudulKonten && <h1>{berkasAktif.judul}</h1>}
          {anak}
          {langkah && (
            <nav className="langkah" aria-label="Halaman berikutnya">
              {langkah.sebelum ? (
                <Link to={langkah.sebelum.ke}>
                  <span className="arah">← Sebelumnya</span>
                  {langkah.sebelum.judul}
                </Link>
              ) : (
                <span />
              )}
              {langkah.sesudah && (
                <Link to={langkah.sesudah.ke}>
                  <span className="arah">Berikutnya →</span>
                  {langkah.sesudah.judul}
                </Link>
              )}
            </nav>
          )}
        </main>

        <SisiSubbab subbab={subbab} />
      </div>

      <footer className="kaki">
        <div className="kaki-isi">
          <p>
            Demo web kuliah Pemrograman Mobile · Sistem Informasi / Teknik Informatika ·
            Universitas IBBI. Konten mengikuti{' '}
            <code>slides/</code> (deck Marp), <code>buku/</code>, dan <code>praktikum/</code>.
          </p>
          <p>
            Tampilan memakai token tema academic yang sama dengan deck: satu warna aksen, font
            sistem, tanpa unduhan.
          </p>
        </div>
      </footer>
    </>
  )
}
