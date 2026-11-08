import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Banding from './Banding.jsx'
import { sorot, ambilBahasa } from '../penyorot.js'

/**
 * Tombol "Salin" untuk blok kode. Memakai Clipboard API bila tersedia,
 * dengan cadangan textarea + execCommand untuk konteks non-aman (mis.
 * situs dibuka lewat alamat IP jaringan lokal, bukan localhost).
 */
function TombolSalin({ teks }) {
  const [tersalin, setTersalin] = useState(false)
  const pewaktu = useRef(null)

  // Bersihkan pewaktu saat komponen dilepas.
  useEffect(() => () => clearTimeout(pewaktu.current), [])

  async function salin() {
    let berhasil = false
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(teks)
        berhasil = true
      }
    } catch {
      berhasil = false
    }
    if (!berhasil) {
      const area = document.createElement('textarea')
      area.value = teks
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      try {
        berhasil = document.execCommand('copy')
      } catch {
        berhasil = false
      }
      area.remove()
    }
    if (berhasil) {
      setTersalin(true)
      clearTimeout(pewaktu.current)
      pewaktu.current = setTimeout(() => setTersalin(false), 2000)
    }
  }

  return (
    <>
      <button
        type="button"
        className={`kode-salin${tersalin ? ' kode-salin-berhasil' : ''}`}
        onClick={salin}
      >
        {tersalin ? 'Tersalin ✓' : 'Salin'}
      </button>
      {/* Pengumuman untuk pembaca layar; label tombol tidak diubah diam-diam. */}
      <span className="kode-salin-status" aria-live="polite">
        {tersalin ? 'Kode tersalin ke papan klip.' : ''}
      </span>
    </>
  )
}

/**
 * Merender <figure class="kode"> dari konten: figcaption apa adanya, lalu kode
 * disorot oleh highlight.js. Kelas `language-*` di elemen code dipertahankan.
 */
function KodeFigur({ node }) {
  const figcaption = node.querySelector(':scope > figcaption')
  const pre = node.querySelector(':scope > pre')
  const code = pre?.querySelector(':scope > code')
  const kodeTeks = code ? code.textContent : (pre?.textContent ?? '')
  const bahasa = code ? ambilBahasa(code.className) : 'javascript'
  const terwarnai = sorot(kodeTeks, bahasa)

  const preProps = salinAtribut(pre)
  const codeProps = salinAtribut(code)

  return (
    <figure className={node.className}>
      {figcaption && (
        <figcaption {...salinAtribut(figcaption)}>
          {[...figcaption.childNodes].map((turunan, i) => (
            <RenderaNode key={i} node={turunan} />
          ))}
          <TombolSalin teks={kodeTeks} />
        </figcaption>
      )}
      <pre {...preProps}>
        <code
          {...codeProps}
          className={`${code?.className ?? ''} hljs`.trim()}
          dangerouslySetInnerHTML={{ __html: terwarnai ?? kodeTeks }}
        />
      </pre>
    </figure>
  )
}

/**
 * Ubah string gaya inline (mis. "width: 10px; color: #333") menjadi objek gaya
 * React. Properti di-camelCase-kan; nilai dibiarkan string (React DOM menerima
 * string untuk hampir semua properti).
 */
function parseGaya(teks) {
  const gaya = {}
  for (const deklarasi of teks.split(';')) {
    const titikDua = deklarasi.indexOf(':')
    if (titikDua === -1) continue
    const kunci = deklarasi.slice(0, titikDua).trim()
    const nilai = deklarasi.slice(titikDua + 1).trim()
    if (!kunci || !nilai) continue
    // Awalan --var dibiarkan apa adanya (properti kustom CSS).
    const camel = kunci.startsWith('--')
      ? kunci
      : kunci.replace(/-([a-z])/g, (_, huruf) => huruf.toUpperCase())
    gaya[camel] = nilai
  }
  return gaya
}

/**
 * Salin atribut elemen DOM menjadi props React.
 * Atribut data-* dan aria-* diteruskan apa adanya; `class` jadi `className`;
 * `style` (string CSS) diubah menjadi objek gaya React; beberapa atribut HTML
 * dikonversi ke bentuk camelCase React.
 */
function salinAtribut(el) {
  const props = {}
  if (!el) return props
  for (const atribut of el.attributes) {
    const nama = atribut.name
    if (nama === 'class') {
      props.className = atribut.value
    } else if (nama === 'for') {
      props.htmlFor = atribut.value
    } else if (nama === 'style') {
      props.style = parseGaya(atribut.value)
    } else if (nama === 'colspan') {
      props.colSpan = Number(atribut.value)
    } else if (nama === 'rowspan') {
      props.rowSpan = Number(atribut.value)
    } else if (nama === 'tabindex') {
      props.tabIndex = Number(atribut.value)
    } else if (nama.startsWith('data-') || nama.startsWith('aria-')) {
      props[nama] = atribut.value
    } else {
      props[nama] = atribut.value
    }
  }
  return props
}

/**
 * Tautan di dalam konten. Tiga macam:
 *   - href="#id"            → anchor di halaman yang sama (gulir lembut)
 *   - href="berkas.html#id" → halaman lain di bab yang sama (navigasi router + gulir)
 *   - href luar             → dibuka di tab baru
 */
function Taulan({ node }) {
  const navigate = useNavigate()
  const { slug } = useParams()
  const href = node.getAttribute('href') || ''

  const anak = []
  for (const turunan of node.childNodes) {
    anak.push(<RenderaNode key={anak.length} node={turunan} />)
  }

  if (href.startsWith('#')) {
    const id = href.slice(1)
    return (
      <a
        {...salinAtribut(node)}
        href={href}
        onClick={(e) => {
          e.preventDefault()
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      >
        {anak}
      </a>
    )
  }

  if (href.endsWith('.html')) {
    const [berkas, anchor] = href.split('#')
    const tujuan = berkas === 'index.html' ? `/bab/${slug}` : `/bab/${slug}/${berkas}`
    return (
      <a
        {...salinAtribut(node)}
        href={`#${tujuan}`}
        onClick={(e) => {
          e.preventDefault()
          navigate(tujuan)
          if (anchor) {
            setTimeout(() => {
              document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 80)
          }
        }}
      >
        {anak}
      </a>
    )
  }

  return (
    <a {...salinAtribut(node)} target="_blank" rel="noopener noreferrer">
      {anak}
    </a>
  )
}

const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
])

const TABEL = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr', 'colgroup'])

/**
 * Perender rekursif node DOM → elemen React.
 *
 * Dua node diperlakukan khusus:
 *   - <figure class="kode">  → KodeFigur (penyorotan sintaks)
 *   - <div class="banding">  → Banding (toggle sebelum/sesudah)
 *
 * Node lain dirender sebagai elemen HTML biasa dengan atributnya. Konten HTML
 * ditulis sendiri oleh repo ini (bukan masukan pengguna), jadi aman dirender
 * apa adanya.
 */
export function RenderaNode({ node }) {
  if (!node) return null

  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null
  }

  const nama = node.tagName.toLowerCase()
  if (nama === 'figure' && node.classList.contains('kode')) {
    return <KodeFigur node={node} />
  }
  if (nama === 'div' && node.classList.contains('banding')) {
    return <Banding node={node} />
  }
  if (nama === 'a') {
    return <Taulan node={node} />
  }

  const props = salinAtribut(node)
  const anak = []
  // Whitespace murni di antara tag tabel memicu peringatan React; lewati.
  const dalamTabel = TABEL.has(nama)
  for (const turunan of node.childNodes) {
    if (
      dalamTabel &&
      turunan.nodeType === Node.TEXT_NODE &&
      /^\s*$/.test(turunan.textContent)
    ) {
      continue
    }
    anak.push(<RenderaNode key={anak.length} node={turunan} />)
  }

  if (anak.length === 0 && VOID.has(nama)) {
    return React.createElement(nama, props)
  }
  return React.createElement(nama, props, ...anak)
}
