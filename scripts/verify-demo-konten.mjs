#!/usr/bin/env node
/**
 * Verifikasi struktur konten demo web tanpa browser:
 *   - tiap folder konten/<slug>/ punya index.html
 *   - tiap berkas: <h1> ada, tag seimbang (perkiraan), section.subbab punya id
 *     unik, div.banding punya ≥2 anak, figure.kode punya pre>code, tidak ada
 *     <html>/<head> bocor, tidak ada "Anda " (kontrak bahasa kasar).
 *
 * Keluar 0 bila semua lolos; 1 bila ada temuan (rinciannya dicetak).
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const KONTEN = join(ROOT, 'demo', 'web', 'konten')

const folder = readdirSync(KONTEN, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()

let galat = 0
const catat = (pesan) => {
  galat += 1
  console.log(`  ✗ ${pesan}`)
}

for (const slug of folder) {
  const dir = join(KONTEN, slug)
  const berkas = readdirSync(dir).filter((f) => f.endsWith('.html'))
  if (!berkas.includes('index.html')) catat(`${slug}: tidak ada index.html`)
  if (berkas.length === 0) catat(`${slug}: tidak ada berkas konten`)

  for (const nama of berkas) {
    const isi = readFileSync(join(dir, nama), 'utf8')
    const jejak = `${slug}/${nama}`

    if (/<!DOCTYPE|<html|<head/i.test(isi)) catat(`${jejak}: masih ada dokumen penuh (<html>/<head>)`)

    const h1 = /<h1[^>]*>/.test(isi)
    if (!h1) catat(`${jejak}: tidak ada <h1>`)

    // Keseimbangan tag kasar (tag void diabaikan: tidak berpasangan).
    const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])
    const tagBuka = isi.match(/<(?!\/|!)[a-zA-Z][^>]*>/g) ?? []
    const buka = tagBuka.filter((t) => !VOID.has(/^<([a-zA-Z]+)/.exec(t)[1].toLowerCase()) && !t.endsWith('/>')).length
    const tutup = (isi.match(/<\/[a-zA-Z][^>]*>/g) ?? []).length
    if (buka !== tutup) {
      catat(`${jejak}: tag tidak seimbang (buka ${buka}, tutup ${tutup})`)
    }

    // Id subbab unik.
    const idSubbab = [...isi.matchAll(/<section class="subbab"[^>]*id="([^"]+)"/g)].map((m) => m[1])
    if (idSubbab.length > 0 && new Set(idSubbab).size !== idSubbab.length) {
      catat(`${jejak}: id subbab duplikat`)
    }

    // banding: dua anak figure.kode.
    for (const [i, blok] of [...isi.matchAll(/<div class="banding"[\s\S]*?(?=<\/div>\s*(?:<div class="banding"|<\/section>|<section|<h[12]>|$))/g)].entries()) {
      const jumlahKode = (blok[0].match(/<figure class="kode"/g) ?? []).length
      if (jumlahKode < 2) catat(`${jejak}: banding #${i + 1} hanya punya ${jumlahKode} figure.kode`)
    }

    // figure.kode wajib pre + code.
    for (const [i, blok] of [...isi.matchAll(/<figure class="kode"[\s\S]*?<\/figure>/g)].entries()) {
      if (!/<pre[\s>]/.test(blok[0]) || !/<code[\s>]/.test(blok[0])) {
        catat(`${jejak}: figure.kode #${i + 1} tanpa pre/code`)
      }
    }

    // Kontrak bahasa kasar (bab-05 dimigrasi dari situs lama pra-kontrak — dikecualikan).
    if (!slug.startsWith('bab-05')) {
      if (/\bAnda\b/.test(isi)) catat(`${jejak}: memakai kata "Anda" (kontrak melarang)`)
      if (/\b(nggak|enggak|gak|udah|gimana|kayak|banget)\b/.test(isi)) catat(`${jejak}: slang ditemukan`)
      if (/\b(sih|deh|nih|dong|kok)\b/.test(isi)) catat(`${jejak}: partikel ditemukan`)
    }

    const subbab = (isi.match(/class="subbab"/g) ?? []).length
    const kode = (isi.match(/<figure class="kode"/g) ?? []).length
    const banding = (isi.match(/<div class="banding"/g) ?? []).length
    console.log(`  ✓ ${jejak}: ${(isi.length / 1024).toFixed(1)} KB · ${subbab} subbab · ${kode} kode · ${banding} banding`)
  }
}

console.log(galat === 0 ? '\nverify-demo-konten: SEMUA LOLOS' : `\nverify-demo-konten: ${galat} temuan`)
process.exit(galat === 0 ? 0 : 1)
