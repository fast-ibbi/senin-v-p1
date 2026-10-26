#!/usr/bin/env node
// Verifikasi terjemahan slides/ ke bahasa Indonesia.
//
// Baseline = versi Inggris di branch `main` (`git show main:slides/<berkas>`).
// Yang diperiksa adalah INVARIAN TINGKAT BAB, bukan kesamaan slide ke-N, karena
// restrukturisasi boleh menyusun ulang slide selama kode, gambar, dan isi bertahan.
//
// Pakai:
//   node scripts/verify-slides-id.mjs              # semua bab
//   node scripts/verify-slides-id.mjs 01 02        # bab tertentu
//   node scripts/verify-slides-id.mjs --verbose 01 # tampilkan rincian temuan

import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const BASELINE_REF = 'main'
const SLIDE_DIR = 'slides'
const SLIDE_MIN = 34
const SLIDE_MAX = 42

// Istilah lama yang sudah diputuskan diganti bentuk Inggris (REVISI-CASUAL.md §1).
const BANNED_TERMS = [
  'peramban', 'pranala', 'tautan', 'berkas', 'situs',
  'ponsel', 'tata letak', 'selektor', 'galat', 'peladen', 'gawai',
]

// Nada tanpa slang: kontraksi dan partikel percakapan dilarang.
const BANNED_SLANG = [
  'nggak', 'enggak', 'gak', 'udah', 'gimana', 'kayak', 'banget',
  'sih', 'deh', 'nih', 'dong', 'kok', 'wkwk', 'yg', 'tp', 'dgn', 'krn',
]

// Kata Inggris yang menandakan prosa belum diterjemahkan.
const ENGLISH_LEAK = [
  'the', 'and', 'with', 'which', 'this', 'that', 'from', 'into', 'your',
  'you', 'when', 'what', 'why', 'how', 'are', 'was', 'were', 'been',
  'will', 'can', 'not', 'but', 'for', 'each', 'every', 'must', 'should',
]

// Judul meta yang bentuknya sudah baku (bukan frasa nomina kosong).
const CANONICAL_TITLES = [
  'Tujuan Pembelajaran', 'Ringkasan', 'Referensi', 'Kuis Kilat',
  'Kunci Kuis Kilat', 'Praktikum', 'Yang Harus Teramati',
]

const args = process.argv.slice(2)
const verbose = args.includes('--verbose')
const only = args.filter((a) => /^\d{2}$/.test(a))

function gitShow (path) {
  try {
    return execFileSync('git', ['show', `${BASELINE_REF}:${path}`], {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    })
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Penguraian

/** Buang frontmatter, komentar penyaji, dan blok kode dari teks slide. */
function prose (slide) {
  return slide
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
}

/** Buang inline code dan markup, sisakan kata-kata prosa. */
function words (slide) {
  return prose(slide)
    .replace(/`[^`]*`/g, ' ')
    .replace(/[|#>*_\[\]()]/g, ' ')
}

function countWords (text) {
  return (words(text).match(/[A-Za-z][A-Za-z'-]*/g) || []).length
}

function fences (text) {
  return text.match(/```[\s\S]*?```/g) || []
}

function imageLines (text) {
  return (text.match(/^!\[.*$/gm) || []).map((s) => s.trim())
}

function headings (text) {
  return (text.match(/^#{1,2} .*$/gm) || []).map((s) => s.replace(/^#+ /, '').trim())
}

function slides (text) {
  return text
    .replace(/^---[\s\S]*?\n---\n/, '') // frontmatter
    .split(/\n---\n/)
    .filter((s) => s.trim())
}

function frontmatterKeys (text) {
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/)
  if (!fm) return []
  return fm[1]
    .split('\n')
    .filter((l) => /^[a-zA-Z]+:/.test(l))
    .map((l) => l.split(':')[0])
    .sort()
}

function noteBlocks (slide) {
  const blocks = slide.match(/<!--[\s\S]*?-->/g) || []
  return blocks.filter((b) => {
    const inner = b.slice(4, -3).trim()
    if (!inner) return false
    if (/^_[a-z]+:/.test(inner)) return false // direktif Marp
    return /[A-Za-z]{3}/.test(inner)
  })
}

function hits (text, list) {
  const found = []
  for (const term of list) {
    const re = new RegExp(`\\b${term}\\b`, 'gi')
    const n = (text.match(re) || []).length
    if (n) found.push(`${term}×${n}`)
  }
  return found
}

// ---------------------------------------------------------------------------
// Pemeriksaan

function verifyChapter (file) {
  const path = join(SLIDE_DIR, file)
  const baseline = gitShow(path)
  const current = readFileSync(path, 'utf8')
  const id = file.slice(4, 6)
  const label = `bab ${id}`

  if (baseline === null) {
    return { label, file, status: 'no-baseline', findings: ['baseline tidak ada di ' + BASELINE_REF] }
  }

  const unchanged = current === baseline
  if (unchanged) {
    return { label, file, status: 'belum-diterjemahkan', findings: [] }
  }

  const findings = []
  const notes = []

  // 1. Blok kode harus identik dan tetap ada, urutannya dipertahankan.
  const enFences = fences(baseline)
  const idFences = fences(current)
  const missing = enFences.filter((f) => !idFences.includes(f))
  if (missing.length) findings.push(`blok kode hilang/berubah: ${missing.length}/${enFences.length}`)
  const order = idFences.filter((f) => enFences.includes(f))
  if (order.join('\u0000') !== enFences.join('\u0000')) findings.push('urutan blok kode berubah')
  notes.push(`kode ${idFences.length - missing.length}/${enFences.length}`)

  // 2. Baris gambar (diagram) harus identik dan tetap urutan yang sama.
  const enImgs = imageLines(baseline)
  const idImgs = imageLines(current)
  if (enImgs.join('\n') !== idImgs.join('\n')) {
    const lost = enImgs.filter((i) => !idImgs.includes(i))
    findings.push(`baris gambar berubah (hilang ${lost.length}, total ${enImgs.length})`)
  }
  notes.push(`gambar ${idImgs.length}/${enImgs.length}`)

  // 3. Anggaran kata: total bab tidak boleh melebihi versi Inggris.
  const enWords = countWords(baseline)
  const idWords = countWords(current)
  if (idWords > enWords) findings.push(`anggaran kata lewat: ${idWords} > ${enWords}`)
  notes.push(`kata ${idWords}/${enWords}`)

  // 4. Jumlah slide dalam rentang kerangka baku.
  const enSlides = slides(baseline).length
  const idSlides = slides(current).length
  if (idSlides < SLIDE_MIN || idSlides > SLIDE_MAX) {
    findings.push(`jumlah slide ${idSlides} di luar ${SLIDE_MIN}–${SLIDE_MAX}`)
  }
  notes.push(`slide ${idSlides} (asli ${enSlides})`)

  // 5. Istilah lama di prosa.
  const proseText = words(current)
  const termHits = hits(proseText, BANNED_TERMS)
  if (termHits.length) findings.push(`istilah lama: ${termHits.join(', ')}`)
  notes.push(`istilah ${termHits.length}`)

  // 6. Slang di prosa.
  const slangHits = hits(proseText, BANNED_SLANG)
  if (slangHits.length) findings.push(`slang: ${slangHits.join(', ')}`)
  notes.push(`slang ${slangHits.length}`)

  // 7. Sisa kata Inggris di prosa.
  const leakHits = hits(proseText, ENGLISH_LEAK)
  if (leakHits.length) findings.push(`kata Inggris tersisa: ${leakHits.join(', ')}`)
  notes.push(`bocor-EN ${leakHits.length}`)

  // 8. Sapaan.
  const anda = (proseText.match(/\bAnda\b/g) || []).length
  if (anda) findings.push(`sapaan "Anda" muncul ${anda}×`)
  notes.push(`Anda ${anda}`)

  // 9. Judul: tidak boleh berbahasa Inggris, meta-slide memakai nama baku.
  const badHeadings = headings(current).filter((h) => hits(h, ENGLISH_LEAK).length)
  if (badHeadings.length) findings.push(`judul berbahasa Inggris: ${badHeadings.length}`)

  // 10. Setiap slide harus punya catatan penyaji.
  const noNote = slides(current).filter((s) => noteBlocks(s).length === 0).length
  if (noNote) findings.push(`slide tanpa catatan penyaji: ${noNote}`)

  // 11. Kunci frontmatter tetap sama.
  const enKeys = frontmatterKeys(baseline).join(',')
  const idKeys = frontmatterKeys(current).join(',')
  if (enKeys !== idKeys) findings.push(`kunci frontmatter berubah: ${idKeys}`)

  // 12. Line ending dan BOM.
  if (current.includes('\r\n')) findings.push('ada CRLF')
  if (current.charCodeAt(0) === 0xfeff) findings.push('ada BOM')

  // 13. Mojibake.
  const mojibake = (current.match(/Â|â€|\uFFFD/g) || []).length
  if (mojibake) findings.push(`mojibake ${mojibake}×`)

  return { label, file, status: findings.length ? 'gagal' : 'lulus', findings, notes }
}

// ---------------------------------------------------------------------------

const files = readdirSync(SLIDE_DIR)
  .filter((f) => /^bab-\d{2}-.*\.md$/.test(f))
  .filter((f) => !only.length || only.includes(f.slice(4, 6)))
  .sort()

const results = files.map(verifyChapter)

const cols = ['bab', 'status', 'slide', 'kode', 'gambar', 'kata', 'istilah', 'slang', 'bocor-EN', 'Anda']
const rows = results.map((r) => {
  const n = (r.notes || []).map((s) => s.split(' '))
  const get = (k) => {
    const found = (r.notes || []).find((s) => s.startsWith(k + ' '))
    return found ? found.slice(k.length + 1).split(' ')[0] : '-'
  }
  return [
    r.label,
    r.status,
    get('slide'),
    get('kode'),
    get('gambar'),
    get('kata'),
    get('istilah'),
    get('slang'),
    get('bocor-EN'),
    get('Anda'),
  ]
})

const widths = cols.map((c, i) => Math.max(c.length, ...rows.map((r) => String(r[i]).length)))
const line = (r) => r.map((c, i) => String(c).padEnd(widths[i])).join('  ')

console.log(line(cols))
console.log(widths.map((w) => '─'.repeat(w)).join('  '))
for (const r of rows) console.log(line(r))

const failed = results.filter((r) => r.status === 'gagal')
const done = results.filter((r) => r.status === 'lulus')
const todo = results.filter((r) => r.status === 'belum-diterjemahkan')

console.log('')
console.log(`lulus ${done.length} · gagal ${failed.length} · belum diterjemahkan ${todo.length}`)

if (failed.length) {
  console.log('')
  for (const r of failed) {
    console.log(`${r.label} — ${r.file}`)
    for (const f of r.findings) console.log(`   • ${f}`)
  }
}

if (verbose) {
  for (const r of results) {
    if (!r.notes) continue
    console.log('')
    console.log(`${r.label} ${r.notes.join(' · ')}`)
  }
}

process.exit(failed.length ? 1 : 0)
