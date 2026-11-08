#!/usr/bin/env node
/**
 * Migrasi halaman demo web bab-05 lama → pohon konten SPA baru.
 *
 * Satu kali pakai: mengambil isi <main class="isi-utama"> dari tiap halaman
 * demo/web/bab-05/*.html, membuang nav "langkah" (kini disediakan kerangka SPA),
 * lalu menulis hasilnya sebagai fragmen konten di
 * demo/web/konten/bab-05-dasar-react-native/.
 *
 * Chrome halaman (head, header nav, kendali lebar, footer, script prism/halaman.js)
 * tidak ikut: semuanya sudah digantikan kerangka React.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SUMBER = join(ROOT, 'demo', 'web', 'bab-05')
const TUJUAN = join(ROOT, 'demo', 'web', 'konten', 'bab-05-dasar-react-native')

const BERKAS = [
  'index.html',
  'bagian-1.html',
  'bagian-2.html',
  'bagian-3.html',
  'bagian-4.html',
  'bagian-5.html',
  'praktikum.html',
]

mkdirSync(TUJUAN, { recursive: true })

for (const nama of BERKAS) {
  const sumber = readFileSync(join(SUMBER, nama), 'utf8')
  const pembuka = '<main class="isi-utama" id="isi">'
  const penutup = '</main>'
  const mulai = sumber.indexOf(pembuka)
  const selesai = sumber.indexOf(penutup, mulai)

  if (mulai === -1 || selesai === -1) {
    throw new Error(`Tidak menemukan <main class="isi-utama"> di ${nama}`)
  }

  let isi = sumber.slice(mulai + pembuka.length, selesai)

  // Buang nav "langkah" (Sebelumnya/Berikutnya) — kini disediakan kerangka SPA.
  isi = isi.replace(/<nav class="langkah"[\s\S]*?<\/nav>\s*/g, '')

  writeFileSync(join(TUJUAN, nama), isi.trim() + '\n')
  console.log(`migrasi: ${nama} (${(isi.length / 1024).toFixed(1)} KB)`)
}
