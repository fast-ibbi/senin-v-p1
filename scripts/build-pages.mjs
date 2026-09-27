#!/usr/bin/env node
/**
 * Post-processing hasil `marp -I slides -o dist`.
 *
 * Marp menulis satu file HTML datar per deck (`dist/<deck>.html`) dengan gambar
 * dirujuk secara relatif. Dua hal perlu dirapikan sebelum deploy ke GitHub Pages:
 *
 *   1. Aset diagram (`assets/diagrams/...`) dirujuk relatif; begitu HTML dipindah
 *      ke dalam folder deck, path itu menunjuk ke tempat yang salah. Jadi diubah
 *      menjadi absolut terhadap base situs.
 *   2. URL deck diinginkan tanpa ekstensi (`/<base>/bab-01-...`), jadi tiap
 *      `dist/<deck>.html` dipindah menjadi `dist/<deck>/index.html`.
 *
 * Satu salinan aset ditaruh di `dist/assets` dan dipakai bersama semua deck.
 * Base situs diambil dari env PAGES_BASE (default: /senin-v-p1 = nama repo).
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = normalizeBase(process.env.PAGES_BASE ?? '/senin-v-p1')
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const ASSETS = join(ROOT, 'slides', 'assets')

function normalizeBase(base) {
  const withLeadingSlash = base.startsWith('/') ? base : `/${base}`
  return withLeadingSlash.replace(/\/+$/, '')
}

const decks = readdirSync(DIST).filter((entry) => entry.endsWith('.html'))
if (decks.length === 0) {
  throw new Error(`Tidak ada file .html di ${DIST}. Jalankan "marp -I slides -o dist" lebih dulu.`)
}

// 1. Aset bersama.
rmSync(join(DIST, 'assets'), { recursive: true, force: true })
cpSync(ASSETS, join(DIST, 'assets'), { recursive: true })

// 2. Tiap deck: path aset absolut + URL tanpa ekstensi.
let refsRewritten = 0
for (const deck of decks) {
  const source = join(DIST, deck)
  const slug = deck.replace(/\.html$/, '')
  const target = join(DIST, slug, 'index.html')

  const html = readFileSync(source, 'utf8').replaceAll('src="assets/', () => {
    refsRewritten += 1
    return `src="${BASE}/assets/`
  })

  // Jaring pengaman: setiap aset yang dirujuk harus benar-benar ada di dist/assets.
  for (const ref of html.matchAll(new RegExp(`src="${BASE}/assets/([^"]+)"`, 'g'))) {
    if (!existsSync(join(DIST, 'assets', ref[1]))) {
      throw new Error(`Aset tidak ditemukan: slides/assets/${ref[1]} (dirujuk oleh ${deck})`)
    }
  }

  mkdirSync(join(DIST, slug), { recursive: true })
  writeFileSync(target, html)
  rmSync(source)
}

console.log(`build-pages: ${decks.length} deck, ${refsRewritten} referensi aset diarahkan ke ${BASE}/assets/`)
