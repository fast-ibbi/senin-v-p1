#!/usr/bin/env node
/**
 * Gerbang halaman demo web Bab 5.
 *
 * Halaman di `demo/web/bab-05/` menampilkan blok kode yang diklaim disalin dari
 * deck, buku, atau praktikum. Skrip ini membuktikan klaim itu, bukan mempercayainya.
 *
 * Yang diperiksa:
 *   1. Setiap `<pre><code>` harus cocok (setelah spasi dinormalkan) dengan salah satu
 *      BLOK KODE di berkas sumber yang ditunjuk label `.kode-sumber`. Cocok dengan
 *      prosa saja tidak cukup: sumbernya harus benar-benar blok kode.
 *   2. Blok yang ditulis khusus halaman wajib terdaftar di PENGECUALIAN berikut
 *      alasannya, supaya penyimpangan selalu terlihat.
 *   3. Setiap `.subbab` harus punya blok kode atau atribut `data-tanpa-kode` beralasan,
 *      dan punya `.keluaran` atau atribut `data-tanpa-output` beralasan.
 *   4. Setiap tautan dan aset relatif harus menunjuk berkas yang ada — syarat supaya
 *      halaman tetap utuh saat dibuka lewat `file://`.
 *
 * Pakai:
 *   node scripts/verify-demo-web.mjs                 # semua halaman yang ada
 *   node scripts/verify-demo-web.mjs bagian-2        # hanya halaman yang namanya diawali bagian-2
 *   node scripts/verify-demo-web.mjs --verbose
 *
 * Halaman yang ada di disk selalu diperiksa, termasuk yang belum terdaftar di
 * HALAMAN — supaya halaman baru langsung tervalidasi tanpa menunggu skrip ini
 * disunting lebih dulu.
 *
 * Kode keluar 1 bila ada temuan.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(ROOT, 'demo', 'web', 'bab-05')

// Berkas sumber yang boleh dikutip, beserta awalan label di halaman.
const SUMBER = {
  deck: 'slides/bab-05-dasar-react-native.md',
  buku: 'buku/bab-05-dasar-react-native.md',
  soal: 'praktikum/bab-05-soal-praktikum.md',
  kunci: 'praktikum/bab-05-kunci-jawaban.md',
}

// Halaman yang direncanakan. Yang belum ada hanya diberi peringatan, bukan galat,
// supaya halaman bisa dibuat satu per satu.
const HALAMAN = {
  'index.html': true,
  'bagian-1.html': true,
  'bagian-2.html': true,
  'bagian-3.html': true,
  'bagian-4.html': true,
  'bagian-5.html': true,
  'praktikum.html': true,
}

// Blok kode yang boleh ditulis khusus halaman (tidak ada di sumber mana pun).
// Setiap entri wajib punya alasan yang bisa dibaca manusia.
const PENGECUALIAN = [
  // Contoh bentuk:
  // {
  //   halaman: 'bagian-3.html',
  //   cuplikan: 'const [status, setStatus] = useState("utama")',
  //   alasan: 'Contoh tiga keadaan tombol ditulis khusus karena perlu satu tabel keadaan yang tidak ada di sumber.',
  // },
]

const verbose = process.argv.includes('--verbose')
const saring = process.argv.slice(2).find((a) => !a.startsWith('-')) || ''
const masalah = []
const peringatan = []
const lulus = []

// ------------------------------------------------------------------ utilitas

function norm(teks) {
  return teks.replace(/\s+/g, ' ').trim()
}

function decodeEntitas(teks) {
  return teks
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
}

/** Isi semua blok kode (antara ``` dan ```) pada satu berkas markdown. */
function blokKodeMarkdown(teks) {
  const hasil = []
  for (const m of teks.matchAll(/```[^\n]*\n([\s\S]*?)```/g)) hasil.push(norm(m[1]))
  return hasil
}

const blokSumber = {}
function blokDari(kunci) {
  if (!blokSumber[kunci]) {
    const berkas = SUMBER[kunci]
    if (!berkas) return null
    blokSumber[kunci] = blokKodeMarkdown(readFileSync(join(ROOT, berkas), 'utf8'))
  }
  return blokSumber[kunci]
}

/** Atribut data-* pada satu tag pembuka. */
function atribut(tag, nama) {
  const m = tag.match(new RegExp(`${nama}="([^"]*)"`))
  return m ? m[1] : null
}

// -------------------------------------------------------------- pemeriksaan

function periksaHalaman(nama) {
  const jalur = join(DIR, nama)
  if (!existsSync(jalur)) {
    if (HALAMAN[nama]) masalah.push(`${nama}: dinyatakan ada tetapi berkasnya tidak ditemukan`)
    else peringatan.push(`${nama}: belum dibuat`)
    return
  }
  if (!HALAMAN[nama]) {
    peringatan.push(`${nama}: berkas ada, tetapi belum terdaftar di HALAMAN skrip ini`)
  }

  const html = readFileSync(jalur, 'utf8')

  if (!/<html lang="id"/.test(html)) {
    masalah.push(`${nama}: atribut lang="id" tidak ditemukan pada <html>`)
  }

  // 1 dan 2 — blok kode.
  const figure = [...html.matchAll(/<figure class="kode">([\s\S]*?)<\/figure>/g)]
  let nomor = 0
  for (const f of figure) {
    nomor += 1
    const isi = f[1]
    const label = isi.match(/<span class="kode-sumber">([^<]*)<\/span>/)
    const kode = isi.match(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/)

    if (!kode) {
      masalah.push(`${nama}: blok kode #${nomor} tidak memakai pola <pre><code>`)
      continue
    }
    const teks = norm(decodeEntitas(kode[1]))

    if (!label) {
      masalah.push(`${nama}: blok kode #${nomor} tidak punya label .kode-sumber`)
      continue
    }

    const awalan = label[1].split('·')[0].trim()
    const blok = blokDari(awalan)

    if (blok && blok.includes(teks)) {
      if (verbose) lulus.push(`${nama}: blok kode #${nomor} cocok dengan ${SUMBER[awalan]}`)
      continue
    }

    const sah = PENGECUALIAN.find(
      (p) => p.halaman === nama && teks.includes(norm(p.cuplikan)) && String(p.alasan || '').length >= 20
    )
    if (sah) {
      if (verbose) lulus.push(`${nama}: blok kode #${nomor} terdaftar di PENGECUALIAN (${sah.alasan.slice(0, 40)}…)`)
      continue
    }

    if (!blok) {
      masalah.push(
        `${nama}: blok kode #${nomor} berlabel "${label[1]}", tetapi awalannya bukan salah satu dari ${Object.keys(SUMBER).join(' / ')}`
      )
    } else {
      masalah.push(
        `${nama}: blok kode #${nomor} tidak ada di blok kode mana pun pada ${SUMBER[awalan]} — ` +
          `salin verbatim, atau daftarkan di PENGECUALIAN. Cuplikan: "${teks.slice(0, 60)}…"`
      )
    }
  }

  // 3 — setiap subbab wajib punya kode atau alasan, dan keluaran atau alasan.
  const subbab = [...html.matchAll(/<section class="subbab"([^>]*)>/g)]
  for (let i = 0; i < subbab.length; i += 1) {
    const attrs = subbab[i][1]
    const mulai = subbab[i].index + subbab[i][0].length
    const akhir = i + 1 < subbab.length ? subbab[i + 1].index : html.indexOf('</main>')
    const isi = html.slice(mulai, akhir)

    const id = atribut(attrs, 'id') || `#${i + 1}`
    const punyaKode = /<pre><code/.test(isi)
    const alasanKode = atribut(attrs, 'data-tanpa-kode')
    if (!punyaKode && !(alasanKode && alasanKode.length >= 20)) {
      masalah.push(`${nama}: subbab ${id} tidak punya blok kode dan tidak memberi alasan (data-tanpa-kode)`)
    }

    const punyaKeluaran = /class="keluaran"/.test(isi) || /class="bagan"/.test(isi)
    const alasanKeluaran = atribut(attrs, 'data-tanpa-output')
    if (!punyaKeluaran && !(alasanKeluaran && alasanKeluaran.length >= 20)) {
      masalah.push(`${nama}: subbab ${id} tidak punya keluaran dan tidak memberi alasan (data-tanpa-output)`)
    }
    if (verbose && punyaKode) lulus.push(`${nama}: subbab ${id} punya kode dan keluaran`)
  }

  // 4 — tautan dan aset relatif harus ada (syarat file://).
  const rujukan = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1])
  for (const t of new Set(rujukan)) {
    if (/^(https?:|mailto:|#|data:)/.test(t)) continue
    const bersih = t.split('#')[0].split('?')[0]
    if (!bersih) continue
    const tujuan = join(DIR, bersih)
    if (existsSync(tujuan)) continue
    if (HALAMAN[bersih] === false) {
      peringatan.push(`${nama}: menautkan ${bersih} yang belum dibuat`)
      continue
    }
    masalah.push(`${nama}: tautan/aset tidak ditemukan: ${bersih}`)
  }
}

function periksaAset() {
  for (const berkas of [
    'aset/akademik.css',
    'aset/halaman.css',
    'aset/tiruan.css',
    'aset/halaman.js',
    'aset/prism/prism.js',
    'aset/prism/prism.css',
    'aset/prism/LICENSE',
  ]) {
    if (!existsSync(join(DIR, berkas))) masalah.push(`aset hilang: ${berkas}`)
  }

  const js = existsSync(join(DIR, 'aset/halaman.js')) ? readFileSync(join(DIR, 'aset/halaman.js'), 'utf8') : ''
  if (/fetch\s*\(/.test(js)) {
    masalah.push('aset/halaman.js: memakai fetch — tidak akan berjalan lewat file://')
  }
  if (/\bimport\s*\(|type="module"/.test(js)) {
    masalah.push('aset/halaman.js: memakai modul ES — tidak akan berjalan lewat file://')
  }
}

// ---------------------------------------------------------------------- jalan

const daftar = [...new Set([
  ...Object.keys(HALAMAN),
  ...readdirSync(DIR)
    .filter((f) => f.endsWith('.html'))
    .map((f) => f),
])]
  .sort()
  .filter((h) => h.startsWith(saring))

if (daftar.length === 0) {
  console.error(`verify-demo-web: tidak ada halaman yang cocok dengan "${saring}"`)
  process.exitCode = 1
  process.exit()
}

for (const halaman of daftar) periksaHalaman(halaman)
periksaAset()

for (const baris of peringatan) console.log(`peringatan  ${baris}`)
if (verbose) for (const baris of lulus) console.log(`lulus       ${baris}`)
for (const baris of masalah) console.log(`GALAT       ${baris}`)

const dibuat = daftar.filter((h) => existsSync(join(DIR, h))).length
console.log(
  `\nverify-demo-web: ${dibuat}/${daftar.length} halaman diperiksa, ` +
    `${masalah.length} galat, ${peringatan.length} peringatan`
)
if (masalah.length > 0) process.exitCode = 1
