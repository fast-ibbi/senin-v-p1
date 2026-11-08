#!/usr/bin/env node
/**
 * Sinkronkan manifest demo web (demo/web/src/data/bab.js) dengan isi folder
 * demo/web/konten/.
 *
 * Aturan:
 *   - Folder konten/<slug>/ yang punya index.html dianggap 'lengkap'.
 *   - Berkas diurutkan: index.html dulu, lalu bagian-N.html (urut angka), lalu
 *     berkas lain (praktikum.html dsb.) sesuai alfabet.
 *   - Judul tiap berkas diambil dari <h1> pertama di dalamnya, kecuali index.html
 *     yang memakai label "Ikhtisar".
 *   - Seluruh entri ditulis ulang dari disk setiap kali dijalankan; jangan
 *     mengedit blok `berkas:` di bab.js dengan tangan.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const KONTEN = join(ROOT, 'demo', 'web', 'konten')
const MANIFES = join(ROOT, 'demo', 'web', 'src', 'data', 'bab.js')

function ambilJudul(file) {
  const isi = readFileSync(file, 'utf8')
  const cocok = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(isi)
  if (!cocok) return null
  return cocok[1]
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&mdash;/g, '—')
    .replace(/\s+/g, ' ')
    .trim()
}

function peringkatUrut(nama) {
  if (nama === 'index.html') return [0, 0, '']
  const bagian = /^bagian-(\d+)\.html$/.exec(nama)
  if (bagian) return [1, Number(bagian[1]), '']
  return [2, 0, nama]
}

function urutBerkas(a, b) {
  const pa = peringkatUrut(a)
  const pb = peringkatUrut(b)
  if (pa[0] !== pb[0]) return pa[0] - pb[0]
  if (pa[1] !== pb[1]) return pa[1] - pb[1]
  return pa[2] < pb[2] ? -1 : pa[2] > pb[2] ? 1 : 0
}

const folderBab = readdirSync(KONTEN, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()

const barisBab = readFileSync(MANIFES, 'utf8').split('\n')
const laporan = []

for (const slug of folderBab) {
  const dir = join(KONTEN, slug)
  const berkas = readdirSync(dir).filter((f) => f.endsWith('.html')).sort(urutBerkas)

  const mulai = barisBab.findIndex((b) => b.includes(`slug: '${slug}'`))
  if (mulai === -1) {
    laporan.push(`${slug}: tidak ada di bab.js — dilewati`)
    continue
  }
  const sampai = barisBab.findIndex((b, i) => i > mulai && b.trim() === '},')
  if (sampai === -1) {
    laporan.push(`${slug}: entri tidak utuh — dilewati`)
    continue
  }

  const barisBerkas = barisBab.findIndex(
    (b, i) => i >= mulai && i <= sampai && b.trim().startsWith('berkas:')
  )
  const barisStatus = barisBab.findIndex(
    (b, i) => i >= mulai && i <= sampai && b.trim().startsWith('status:')
  )
  if (barisBerkas === -1 || barisStatus === -1) {
    laporan.push(`${slug}: berkas:/status: tidak ditemukan — dilewati`)
    continue
  }

  const satuBaris = barisBab[barisBerkas].trim() === 'berkas: [],'
  const akhirBerkas = satuBaris
    ? barisBerkas
    : barisBab.findIndex((b, i) => i > barisBerkas && i <= sampai && b.trim() === '],')
  if (akhirBerkas === -1) {
    laporan.push(`${slug}: penutup berkas: tidak ditemukan — dilewati`)
    continue
  }

  // Seluruh entri diturunkan ulang dari disk supaya manifest tidak pernah basi.

  const entri = berkas.map((nama) => {
    // Entri index memakai label "Ikhtisar" agar navigasi tidak mengulang judul bab.
    const judul = nama === 'index.html'
      ? 'Ikhtisar'
      : (ambilJudul(join(dir, nama)) ?? nama).replace(/'/g, "\\'")
    return `      { file: '${nama}', judul: '${judul}' },`
  })
  const blokBaru = entri.length ? ['    berkas: [', ...entri, '    ],'] : ['    berkas: [],']

  barisBab.splice(barisBerkas, akhirBerkas - barisBerkas + 1, ...blokBaru)

  const statusBaru = barisBab.findIndex(
    (b, i) => i >= mulai && b.trim().startsWith('status:')
  )
  // Bab dianggap 'lengkap' hanya bila punya ikhtisar DAN halaman praktikum.
  // Bab yang masih setengah jadi tetap bisa dibuka halamannya, tetapi ditandai
  // 'ditunda' supaya halaman muka tidak menjanjikan lebih dari yang ada.
  const lengkap = berkas.includes('index.html') && berkas.includes('praktikum.html')
  barisBab[statusBaru] = lengkap ? "    status: 'lengkap'," : "    status: 'ditunda',"

  laporan.push(
    `${slug}: ${berkas.length} berkas → ${lengkap ? 'lengkap' : 'ditunda (belum ada praktikum)'}`
  )
}

writeFileSync(MANIFES, barisBab.join('\n'))
console.log(`update-manifest-demo: ${laporan.length} folder konten diperiksa`)
for (const baris of laporan) console.log(`  ${baris}`)
