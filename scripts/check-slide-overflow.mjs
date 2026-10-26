#!/usr/bin/env node
// Deteksi slide yang isinya menabrak footer, dari PNG hasil render Marp.
//
// Alat bantu pengembangan (macOS): memakai `sips` untuk mengubah PNG ke BMP, lalu
// memindai pita bawah gambar. Baris teks footer tipis dan hanya selebar ~600px,
// sedangkan tabel yang meluber meninggalkan garis mendatar panjang (>200px) atau
// gumpalan gelap selebar hampir seluruh slide.
//
// Pakai:
//   node scripts/check-slide-overflow.mjs /tmp/p05 /tmp/p06 ...
//   (render dulu: npx marp slides/bab-05-*.md --images png --allow-local-files -o /tmp/p05/s.png)
//
// Keluaran: satu baris per slide bermasalah + kode keluar 1 bila ada temuan.

import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Pita tempat teks footer hidup. Isi slide hanya dianggap meluber bila ada piksel
// non-latar di pita ini DI LUAR dua area milik footer sendiri: teks footer (kiri) dan
// nomor halaman (kanan). Kalibrasi: Bab 1-4 yang sudah diperiksa dengan mata = 0 temuan.
const BAND_TOP = 670 // di atas baris ini masih aman (footer mulai ~676)
const MIN_RUN = 40 // ekor teks footer paling panjang ~18px; overflow nyata >=55px
const BAND_BOTTOM = 702
const FOOTER_X = [18, 800] // teks footer, bervariasi panjang per bab
const PAGE_NO_X = [1170, 1275] // nomor halaman
const BG = 245 // ambang latar putih

function toBmp (png, dir, i) {
  const out = join(dir, `p${i}.bmp`)
  execFileSync('sips', ['-s', 'format', 'bmp', png, '--out', out], { stdio: 'ignore' })
  return out
}

function parseBmp (buf) {
  const dataOffset = buf.readUInt32LE(10)
  const headerSize = buf.readUInt32LE(14)
  const width = buf.readInt32LE(18)
  const rawHeight = buf.readInt32LE(22)
  const bpp = buf.readUInt16LE(28)
  const height = Math.abs(rawHeight)
  const bottomUp = rawHeight > 0
  const bytesPerPixel = bpp / 8
  const rowSize = Math.ceil((width * bytesPerPixel) / 4) * 4
  const start = 14 + headerSize + (dataOffset - 14 - headerSize)

  const y = (row) => (bottomUp ? height - 1 - row : row)

  function rowStats (row) {
    const off = start + y(row) * rowSize
    let run = 0
    let best = 0
    for (let x = 0; x < width; x++) {
      const p = off + x * bytesPerPixel
      const b = buf[p]
      const g = buf[p + 1]
      const r = buf[p + 2]
      const inFooter = (x >= FOOTER_X[0] && x <= FOOTER_X[1]) ||
        (x >= PAGE_NO_X[0] && x <= PAGE_NO_X[1])
      const isBg = r >= BG && g >= BG && b >= BG
      if (isBg || inFooter) {
        run = 0
        continue
      }
      run++
      if (run > best) best = run
    }
    return { best }
  }

  return { width, height, rowStats }
}

const dirs = process.argv.slice(2)
if (!dirs.length) {
  console.error('pakai: node scripts/check-slide-overflow.mjs <dir-png> [dir-png ...]')
  process.exit(2)
}

let flagged = 0
let scanned = 0

for (const dir of dirs) {
  const work = mkdtempSync(join(tmpdir(), 'ovf-'))
  const files = readdirSync(dir).filter((f) => f.endsWith('.png')).sort()
  for (const [i, file] of files.entries()) {
    const bmp = toBmp(join(dir, file), work, i)
    const { height, rowStats } = parseBmp(readFileSync(bmp))
    const reasons = []
    for (let row = height - (720 - BAND_TOP); row < BAND_BOTTOM; row++) {
      const s = rowStats(row)
      if (s.best > MIN_RUN) reasons.push(`isi ${s.best}px di y=${row}`)
    }
    scanned++
    if (reasons.length) {
      flagged++
      console.log(`${dir}/${file}: ${reasons.slice(0, 2).join(' · ')}`)
    }
  }
  rmSync(work, { recursive: true, force: true })
}

console.log(`\n${dirs.length} deck · ${scanned} slide diperiksa · ${flagged} ditandai`)
process.exit(flagged ? 1 : 0)
