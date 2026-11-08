import { useEffect, useRef, useState } from 'react'

/**
 * Bilah sisi kanan: daftar subbab halaman aktif.
 *
 * Menerima daftar `subbab` ({ id, nomor, judul }) yang diekstrak dari konten.
 * Memakai IntersectionObserver sebagai scrollspy: tautan subbab yang sedang
 * terbaca di layar ditandai aria-current. Klik tautan menggulir lembut ke
 * subbab (scroll-margin-top di .subbab menjaga jarak dari bilah kendali).
 */
export default function SisiSubbab({ subbab }) {
  const [aktif, setAktif] = useState(null)
  const pemantau = useRef(null)

  useEffect(() => {
    if (!subbab.length) return

    const elemen = subbab
      .map((s) => document.getElementById(s.id))
      .filter(Boolean)

    pemantau.current = new IntersectionObserver(
      (entri) => {
        // Pilih subbab paling atas yang masih memotong viewport bagian atas.
        const terlihat = entri
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (terlihat.length > 0) {
          setAktif(terlihat[0].target.id)
        }
      },
      { rootMargin: '-72px 0px -66% 0px', threshold: 0 }
    )

    for (const el of elemen) {
      pemantau.current.observe(el)
    }
    return () => pemantau.current?.disconnect()
  }, [subbab])

  if (subbab.length === 0) return null

  return (
    <aside className="sisi-kanan" aria-label="Daftar subbab halaman ini">
      <p className="sisi-kanan-judul">Subbab halaman ini</p>
      <ol className="sisi-kanan-daftar">
        {subbab.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={aktif === s.id ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              <span className="sisi-kanan-nomor">{s.nomor}</span>
              {s.judul}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  )
}
