#!/usr/bin/env node
/**
 * Menyalin backend kanonik dari kode/_backend ke dalam folder bab.
 *
 * Satu sumber, enam salinan:
 *   kode/_backend/shared/  + kode/_backend/pre-auth/ → bab 10, 11, 12
 *   kode/_backend/shared/  + kode/_backend/jwt/      → bab 13, 14, 15
 *
 * Pemakaian:
 *   node scripts/sync-backend.mjs           tulis ulang salinan
 *   node scripts/sync-backend.mjs --check   gagal bila salinan menyimpang (CI)
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const KODE = join(ROOT, 'kode')
const SUMBER = join(KODE, '_backend')
const CHECK = process.argv.includes('--check')

const BAB = {
  'pre-auth': [
    'bab-10-rest-api-dan-backend-integration',
    'bab-11-penyimpanan-data-lokal',
    'bab-12-mengakses-fitur-perangkat',
  ],
  jwt: [
    'bab-13-autentikasi-dan-keamanan-aplikasi',
    'bab-14-debugging-testing-dan-quality-assurance',
    'bab-15-build-dan-deployment',
  ],
}

const CATATAN = `# Backend SIAKAD (salinan)

Folder ini dihasilkan oleh \`node scripts/sync-backend.mjs\` dari \`kode/_backend/\`.
Jangan diedit di sini — ubah sumbernya lalu jalankan ulang skrip tersebut.

Jalankan dari folder bab induk, bukan dari folder ini:

\`\`\`bash
npm run api          # http://localhost:3000
npm run api:reset    # kembalikan data seed
\`\`\`
`

/** Semua berkas di bawah sebuah folder, sebagai path relatif. */
function daftarBerkas(folder) {
  if (!existsSync(folder)) return []
  return readdirSync(folder).flatMap((nama) => {
    const penuh = join(folder, nama)
    return statSync(penuh).isDirectory()
      ? daftarBerkas(penuh).map((anak) => join(nama, anak))
      : [nama]
  })
}

/** Berkas yang membentuk satu varian, relatif terhadap folder backend tujuan. */
function berkasVarian(varian) {
  const dariShared = daftarBerkas(join(SUMBER, 'shared')).map((berkas) => ({
    tujuan: berkas,
    sumber: join(SUMBER, 'shared', berkas),
  }))
  const dariVarian = daftarBerkas(join(SUMBER, varian)).map((berkas) => ({
    tujuan: berkas,
    sumber: join(SUMBER, varian, berkas),
  }))
  return [...dariShared, ...dariVarian]
}

/** Tulis (atau periksa) satu salinan backend untuk satu folder bab. */
function kerjakanBab(bab, varian) {
  const folderBab = join(KODE, bab)
  if (!existsSync(folderBab)) {
    // Folder bab belum dibuat (urutan pengerjaan repo ini bertahap).
    console.warn(`  lewat  ${bab} (folder belum ada)`)
    return null
  }

  const tujuan = join(folderBab, 'backend')
  const berkas = berkasVarian(varian)
  const beda = []

  if (!CHECK) mkdirSync(tujuan, { recursive: true })

  for (const { tujuan: relatif, sumber } of berkas) {
    const target = join(tujuan, relatif)

    if (CHECK) {
      if (!existsSync(target)) {
        beda.push(`${relatif} (belum ada)`)
      } else if (readFileSync(target, 'utf8') !== readFileSync(sumber, 'utf8')) {
        beda.push(relatif)
      }
      continue
    }

    mkdirSync(dirname(target), { recursive: true })
    cpSync(sumber, target)
  }

  if (!CHECK) {
    // db.json adalah salinan kerja: dibuat sekali, tidak ditimpa agar isian
    // praktikum sebelumnya tidak hilang saat skrip dijalankan ulang.
    const dataKerja = join(tujuan, 'data', 'db.json')
    const dataSeed = join(tujuan, 'data', 'db.seed.json')
    if (!existsSync(dataKerja)) {
      mkdirSync(dirname(dataKerja), { recursive: true })
      cpSync(dataSeed, dataKerja)
    }
    writeFileSync(join(tujuan, 'README.md'), CATATAN, 'utf8')
  }

  return beda
}

let gagal = false
for (const [varian, daftarBab] of Object.entries(BAB)) {
  console.log(`${CHECK ? 'memeriksa' : 'menyalin'} varian ${varian}`)
  for (const bab of daftarBab) {
    const beda = kerjakanBab(bab, varian)
    if (beda === null) continue
    if (beda.length > 0) {
      gagal = true
      console.error(`  beda   ${relative(ROOT, join(KODE, bab))}/backend: ${beda.join(', ')}`)
    } else if (!CHECK) {
      console.log(`  ok     ${bab}`)
    }
  }
}

if (CHECK && gagal) {
  console.error('\nSalinan backend menyimpang dari sumber. Jalankan: node scripts/sync-backend.mjs')
  process.exit(1)
}

console.log(CHECK ? '\nSemua salinan backend sesuai sumber.' : '\nSelesai.')
