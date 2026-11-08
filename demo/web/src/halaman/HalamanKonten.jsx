import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Kerangka from '../komponen/Kerangka.jsx'
import KendaliLebar from '../komponen/KendaliLebar.jsx'
import { RenderaNode } from '../komponen/NodeKonten.jsx'
import { cariBab, cariBerkas } from '../data/bab.js'
import { adaKonten, muatKonten } from '../data/konten.js'

const LEBAR_BINGKAI_BAWAAN = 390

/**
 * Halaman konten satu bab: memuat fragmen HTML berkas konten, mem-parsingnya
 * dengan DOMParser, lalu merender node-nya lewat perender rekursif.
 */
export default function HalamanKonten() {
  const { slug, file } = useParams()
  const bab = cariBab(slug)
  const berkasAktif = bab
    ? cariBerkas(bab, file ?? 'index.html') ?? cariBerkas(bab, 'index.html')
    : null

  const [html, setHtml] = useState(null)
  const [galat, setGalat] = useState(null)
  const [lebarBingkai, setLebarBingkai] = useState(LEBAR_BINGKAI_BAWAAN)

  useEffect(() => {
    if (!bab) {
      setGalat(new Error(`Bab tidak dikenal: ${slug}`))
      return
    }
    if (!berkasAktif) {
      setGalat(new Error(`Berkas tidak dikenal: ${file}`))
      return
    }
    if (!adaKonten(bab.slug, berkasAktif.file)) {
      setGalat(new Error(`Berkas konten belum ditulis: konten/${bab.slug}/${berkasAktif.file}`))
      return
    }
    let batal = false
    setHtml(null)
    setGalat(null)
    muatKonten(bab.slug, berkasAktif.file)
      .then((teks) => {
        if (!batal) setHtml(teks)
      })
      .catch((e) => {
        if (!batal) setGalat(e)
      })
    return () => {
      batal = true
    }
  }, [bab, berkasAktif])

  const dokumen = useMemo(() => {
    if (!html) return null
    const dok = new DOMParser().parseFromString(html, 'text/html')
    return dok
  }, [html])

  const punyaBingkai = useMemo(() => Boolean(dokumen?.querySelector('.bingkai')), [dokumen])
  const judulDokumen = useMemo(() => dokumen?.querySelector('h1')?.textContent ?? '', [dokumen])

  // Daftar subbab untuk bilah sisi kanan. Bagian tanpa id diberi id urut
  // supaya tetap bisa dijadikan target tautan dan scrollspy.
  const daftarSubbab = useMemo(() => {
    if (!dokumen) return []
    const hasil = []
    dokumen.querySelectorAll('.subbab').forEach((el, indeks) => {
      if (!el.id) el.id = `subbab-${indeks + 1}`
      const label = el.querySelector('.label-subbab')
      const nomor = label ? (label.childNodes[0]?.textContent ?? '').trim() : ''
      const judul = el.querySelector('h2')?.textContent?.trim() ?? ''
      hasil.push({ id: el.id, nomor, judul })
    })
    return hasil
  }, [dokumen])

  useEffect(() => {
    document.title = bab && berkasAktif
      ? `${judulDokumen || berkasAktif.judul} · ${bab.judul} — Demo Web`
      : 'Demo Web · Pemrograman Mobile'
  }, [bab, berkasAktif, judulDokumen])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug, file])

  if (!bab) {
    return (
      <Kerangka>
        <p className="ringkas">Bab tidak ditemukan. Kembali ke <a href="#/">daftar bab</a>.</p>
      </Kerangka>
    )
  }

  if (galat) {
    return (
      <Kerangka bab={bab} berkasAktif={berkasAktif}>
        <div className="kartu-kosong">
          <p className="kartu-kosong-judul">Konten bab ini belum tersedia.</p>
          <p>
            Kerangka dan rutenya sudah siap; berkas konten di{' '}
            <code>konten/{bab.slug}/</code> menyusul di sesi penulisan berikutnya.
          </p>
        </div>
      </Kerangka>
    )
  }

  if (!dokumen) {
    return (
      <Kerangka bab={bab} berkasAktif={berkasAktif}>
        <p className="ringkas">Memuat konten…</p>
      </Kerangka>
    )
  }

  const indeksBerkas = bab.berkas.findIndex((b) => b.file === berkasAktif.file)
  const langkah = {
    sebelum:
      indeksBerkas > 0
        ? { ke: keTautan(bab, bab.berkas[indeksBerkas - 1]), judul: bab.berkas[indeksBerkas - 1].judul }
        : null,
    sesudah:
      indeksBerkas >= 0 && indeksBerkas < bab.berkas.length - 1
        ? { ke: keTautan(bab, bab.berkas[indeksBerkas + 1]), judul: bab.berkas[indeksBerkas + 1].judul }
        : null,
  }

  return (
    <Kerangka bab={bab} berkasAktif={berkasAktif} langkah={langkah} punyaJudulKonten={Boolean(judulDokumen)} subbab={daftarSubbab}>
      {punyaBingkai && <KendaliLebar nilai={lebarBingkai} onUbah={setLebarBingkai} />}
      <div style={{ '--lebar-bingkai': `${lebarBingkai}px` }}>
        {[...dokumen.body.childNodes].map((node, indeks) => (
          <RenderaNode key={indeks} node={node} />
        ))}
      </div>
    </Kerangka>
  )
}

function keTautan(bab, berkas) {
  return berkas.file === 'index.html' ? `/bab/${bab.slug}` : `/bab/${bab.slug}/${berkas.file}`
}
