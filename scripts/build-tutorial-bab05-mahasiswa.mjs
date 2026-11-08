#!/usr/bin/env node
/**
 * Menyusun `demo/bab-05-mahasiswa/TUTORIAL.md` dari `TUTORIAL.src.md`.
 *
 * Tutorial itu memuat kode yang harus disalin mahasiswa. Supaya kode di tutorial
 * tidak pernah menyimpang dari project aslinya, setiap blok kode diambil langsung
 * dari berkas di folder project — bukan disalin tangan ke dalam prosa.
 *
 * Di template, tulis satu baris direktif:
 *
 *     <!-- kode: components/LabelStatus.js -->
 *
 * Skrip ini menggantinya dengan judul berkas + blok kode berpagar.
 *
 * Pakai:
 *   node scripts/build-tutorial-bab05-mahasiswa.mjs           # tulis TUTORIAL.md
 *   node scripts/build-tutorial-bab05-mahasiswa.mjs --check   # gagal bila usang
 *
 * Pemeriksaan tambahan: setiap berkas .js/.json di project wajib muncul minimal
 * sekali di tutorial, kecuali yang terdaftar di DIKECUALIKAN. Jadi kalau project
 * bertambah berkas dan tutorial belum menyinggungnya, skrip berhenti dengan galat
 * dan menyebut berkas mana yang belum tercakup.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PROJ = join(ROOT, 'demo', 'bab-05-mahasiswa')
const TEMPLATE = join(PROJ, 'TUTORIAL.src.md')
const OUTPUT = join(PROJ, 'TUTORIAL.md')

const BAHASA = { '.js': 'jsx', '.json': 'json' }

// Folder yang tidak ikut diperiksa cakupannya.
const ABAIKAN_FOLDER = new Set(['node_modules', '.expo', 'dist', 'web-build', '.git'])

// Berkas yang sengaja tidak disisipkan ke tutorial, beserta alasannya.
const DIKECUALIKAN = {
  'index.js': 'dibuat oleh template Expo; tidak perlu disunting',
  'package-lock.json': 'dihasilkan npm install; tidak perlu dibaca',
}

const DIREKTIF = /^<!--\s*kode:\s*(.+?)\s*-->$/

function walk(relatif = '') {
  const hasil = []
  for (const entri of readdirSync(join(PROJ, relatif), { withFileTypes: true })) {
    if (entri.isDirectory()) {
      if (ABAIKAN_FOLDER.has(entri.name)) continue
      hasil.push(...walk(join(relatif, entri.name)))
    } else {
      hasil.push(join(relatif, entri.name))
    }
  }
  return hasil
}

function sisipkan(template) {
  const dipakai = new Set()
  const keluaran = []

  for (const baris of template.split('\n')) {
    const cocok = baris.match(DIREKTIF)
    if (!cocok) {
      keluaran.push(baris)
      continue
    }

    const relatif = cocok[1]
    const penuh = join(PROJ, relatif)
    if (!existsSync(penuh)) {
      throw new Error(`Direktif menunjuk berkas yang tidak ada: ${relatif}`)
    }

    const isi = readFileSync(penuh, 'utf8').replace(/\s+$/, '')
    const bahasa = BAHASA[extname(relatif)] ?? 'text'
    dipakai.add(relatif)

    // Judul berkas ditulis di template (satu baris **`path`** sebelum direktif),
    // jadi di sini hanya blok kodenya yang disisipkan.
    keluaran.push('```' + bahasa, isi, '```', '')
  }

  return { keluaran, dipakai }
}

function periksaCakupan(dipakai) {
  const belum = walk()
    .filter((berkas) => ['.js', '.json'].includes(extname(berkas)))
    .filter((berkas) => !dipakai.has(berkas))
    .filter((berkas) => !(berkas in DIKECUALIKAN))
    .sort()

  if (belum.length > 0) {
    throw new Error(
      'Berkas berikut belum muncul di tutorial (atau tambahkan ke DIKECUALIKAN):\n  ' +
        belum.join('\n  '),
    )
  }
}

function main() {
  const modePeriksa = process.argv.includes('--check')
  const template = readFileSync(TEMPLATE, 'utf8')
  const { keluaran, dipakai } = sisipkan(template)
  periksaCakupan(dipakai)

  const banner =
    '<!-- BERKAS INI DIHASILKAN OTOMATIS dari TUTORIAL.src.md.\n' +
    '     Sunting template-nya, lalu jalankan `npm run build:tutorial`. -->\n\n'
  const hasil = banner + keluaran.join('\n')

  if (modePeriksa) {
    const sekarang = existsSync(OUTPUT) ? readFileSync(OUTPUT, 'utf8') : ''
    if (sekarang !== hasil) {
      const a = sekarang.split('\n')
      const b = hasil.split('\n')
      const nomor = a.findIndex((baris, i) => baris !== b[i])
      console.error(
        `TUTORIAL.md usang (pertama berbeda di baris ${nomor + 1}).\n` +
          'Jalankan: npm run build:tutorial',
      )
      process.exit(1)
    }
    console.log(`TUTORIAL.md mutakhir (${dipakai.size} berkas disisipkan).`)
    return
  }

  writeFileSync(OUTPUT, hasil)
  console.log(`TUTORIAL.md ditulis — ${dipakai.size} berkas disisipkan.`)
}

main()
