#!/usr/bin/env node
// Selaraskan field `slide:` di spec diagram dengan judul slide Indonesia.
//
// Diagram tidak dipindahkan: skrip hanya membaca baris `![…](assets/diagrams/X.svg)`,
// mencari judul terdekat di atasnya pada slide yang sama, lalu menuliskan judul itu ke
// `slide: '…'` di spec `diagrams/<slug-bab>/X.mjs`. Geometri dan SVG tidak disentuh.
//
// Pakai:
//   node scripts/sync-diagram-slides.mjs 01        # satu bab
//   node scripts/sync-diagram-slides.mjs           # semua bab
//   node scripts/sync-diagram-slides.mjs 01 --dry  # lihat rencana, tulis nol

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

const SLIDE_DIR = 'slides'
const SPEC_DIR = join(SLIDE_DIR, 'diagrams')
const dry = process.argv.includes('--dry')
const only = process.argv.slice(2).filter((a) => /^\d{2}$/.test(a))

const decks = readdirSync(SLIDE_DIR)
  .filter((f) => /^bab-\d{2}-.*\.md$/.test(f))
  .filter((f) => !only.length || only.includes(f.slice(4, 6)))
  .sort()

let changed = 0
let unmatched = 0

for (const deck of decks) {
  const slug = deck.replace(/\.md$/, '')
  const text = readFileSync(join(SLIDE_DIR, deck), 'utf8')
  const slides = text.replace(/^---[\s\S]*?\n---\n/, '').split(/\n---\n/)

  for (const slide of slides) {
    const img = slide.match(/!\[[^\]]*\]\(([^)]+\.svg)\)/)
    if (!img) continue

    const svg = basename(img[1], '.svg')
    const specPath = join(SPEC_DIR, slug, `${svg}.mjs`)
    if (!existsSync(specPath)) {
      console.warn(`  lewat  ${svg} — spec tidak ada`)
      unmatched++
      continue
    }

    const heading = slide.match(/^#{1,2} +(.+)$/m)
    if (!heading) {
      console.warn(`  lewat  ${svg} — slide tanpa judul`)
      unmatched++
      continue
    }
    const title = heading[1]
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/[*`]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    const spec = readFileSync(specPath, 'utf8')
    const next = spec.replace(/(\n\s*slide:\s*)'(?:[^'\\]|\\.)*'/, (_, p) => `${p}'${title.replace(/'/g, "\\'")}'`)

    if (next === spec) {
      console.log(`  tetap  ${svg} — "${title}"`)
      continue
    }

    const before = (spec.match(/slide:\s*'((?:[^'\\]|\\.)*)'/) || [])[1]
    console.log(`  ubah   ${svg}\n         "${before}"\n      →  "${title}"`)
    if (!dry) writeFileSync(specPath, next)
    changed++
  }
}

console.log('')
console.log(`${dry ? '[dry] ' : ''}diubah ${changed} spec · dilewati ${unmatched}`)
