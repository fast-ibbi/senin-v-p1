#!/usr/bin/env node
/**
 * Membuktikan angka, bukan mengklaimnya.
 *
 * Halaman demo web Bab 5 menyebut beberapa hal tentang hasil rendernya: bingkai
 * 390px berarti layar 390px, `View` selalu kolom, tiap blok kode disorot, dan
 * tidak ada halaman yang melebar ke samping. Skrip ini membuka setiap halaman
 * dengan Chromium sungguhan lewat `file://` (bukan server), mengukur semuanya,
 * lalu menyimpan tangkapan layar ke `demo/web/bab-05/docs/tangkapan-layar/`.
 *
 * Keluaran tabelnya berbentuk markdown supaya bisa ditempel apa adanya ke README
 * — angka di README tidak boleh diketik ulang dengan tangan.
 *
 * Pakai:
 *   node scripts/screenshot-demo-web.mjs              # semua halaman
 *   node scripts/screenshot-demo-web.mjs bagian-4     # satu halaman
 *
 * Playwright tidak wajib ada di akar repo: skrip ini mencari `playwright` di akar,
 * lalu di `demo/bab-05/node_modules` (tempat alat tangkapan layar demo Expo).
 */

import { mkdirSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(ROOT, 'demo', 'web', 'bab-05')
const KELUARAN = join(DIR, 'docs', 'tangkapan-layar')

// Tiga ukuran yang sama dengan tangkapan layar demo Expo, supaya perbandingan
// antarkeduanya bisa dilakukan tanpa mengubah skala apa pun.
const UKURAN = [
  { nama: 'ponsel-potret', lebar: 390, tinggi: 844 },
  { nama: 'ponsel-lanskap', lebar: 844, tinggi: 390 },
  { nama: 'tablet', lebar: 834, tinggi: 1112 },
]

// Kelas yang wajib ada di halaman tertentu. Dipakai untuk menjaga kontrak antar
// halaman (mis. Bagian 4 wajib memperagakan breakpoint 600 px lewat .rn-600).
const WAJIB = {
  'bagian-4.html': ['.rn-600'],
}

async function muatPlaywright() {
  const calon = ['playwright', join(ROOT, 'demo/bab-05/node_modules/playwright/index.mjs')]
  for (const jalur of calon) {
    try {
      const url = jalur.startsWith('/') ? pathToFileURL(jalur).href : jalur
      const mod = await import(url)
      return mod.chromium ? mod : mod.default
    } catch {
      /* coba calon berikutnya */
    }
  }
  return null
}

const playwright = await muatPlaywright()
if (!playwright) {
  console.error(
    'screenshot-demo-web: Playwright tidak ditemukan.\n' +
      'Pasang sekali di dalam demo/bab-05 (tempat alat ini dipakai demo Expo):\n' +
      '  cd demo/bab-05 && npm install --no-save playwright && npx playwright install chromium'
  )
  process.exitCode = 1
  process.exit()
}

const saring = process.argv.slice(2).find((a) => !a.startsWith('-')) || ''
const halaman = readdirSync(DIR)
  .filter((f) => f.endsWith('.html'))
  .filter((f) => f.startsWith(saring))
  .sort()

if (halaman.length === 0) {
  console.error(`screenshot-demo-web: tidak ada halaman .html yang cocok dengan "${saring}"`)
  process.exitCode = 1
  process.exit()
}

const peramban = await playwright.chromium.launch()
const baris = []
let gagal = 0
let dilewati = 0

function uji(halamanNama, asersi, hasil, harap) {
  const lulus = hasil === harap
  if (!lulus) gagal += 1
  baris.push({ halaman: halamanNama, asersi, hasil: String(hasil), harap: String(harap), status: lulus ? 'lulus' : 'GAGAL' })
}

function lewati(halamanNama, asersi, sebab) {
  dilewati += 1
  baris.push({ halaman: halamanNama, asersi, hasil: sebab, harap: '—', status: 'lewat' })
}

for (const berkas of halaman) {
  const url = pathToFileURL(join(DIR, berkas)).href
  const konteks = await peramban.newContext({ viewport: { width: 1280, height: 900 } })
  const tab = await konteks.newPage()

  const galatConsole = []
  tab.on('console', (m) => {
    if (m.type() === 'error' && !/favicon/.test(m.text())) galatConsole.push(m.text())
  })
  tab.on('pageerror', (e) => galatConsole.push(String(e)))

  await tab.goto(url)
  await tab.waitForLoadState('load')

  // --- 1. Invarianta yang berlaku di semua halaman.
  const dasar = await tab.evaluate(() => {
    const pertama = document.querySelector('.bingkai-layar')
    const rn = document.querySelector('.rn')
    const kartuWeb = document.querySelector('.contoh-web .kartu')
    return {
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      figures: document.querySelectorAll('figure.kode').length,
      kode: document.querySelectorAll('pre code').length,
      tokens: document.querySelectorAll('span.token').length,
      ariaCurrent: document.querySelectorAll('[aria-current="page"]').length,
      frames: [...document.querySelectorAll('.bingkai-layar')].map((e) => Math.round(e.getBoundingClientRect().width)),
      layarPertama: pertama ? Math.round(pertama.getBoundingClientRect().width) : null,
      rnFlex: rn ? getComputedStyle(rn).flexDirection : null,
      webFlex: kartuWeb ? getComputedStyle(kartuWeb).flexDirection : null,
      kendali: Boolean(document.querySelector('[data-kendali-lebar]')),
      details: document.querySelectorAll('details').length,
      subbabTanpaKeluaran: [...document.querySelectorAll('section.subbab')].filter(
        (s) => !s.querySelector('.keluaran') && !s.querySelector('.bagan') && !s.hasAttribute('data-tanpa-output')
      ).length,
      // Tiga invarianta tiruan: teks tanpa `style` harus 14px (bawaan React Native),
      // gambar harus punya ukuran atau ditandai kosong, dan tidak boleh ada teks
      // yang ditaruh langsung di dalam wadah (kesalahan yang diajarkan bab ini).
      teksSalahUkuran: [...document.querySelectorAll('.rn-text')].filter((e) => {
        const sebaris = e.getAttribute('style') || ''
        if (/font-size/i.test(sebaris)) return false
        return parseFloat(getComputedStyle(e).fontSize) !== 14
      }).length,
      gambarNol: [...document.querySelectorAll('.rn-image')].filter((e) => {
        const r = e.getBoundingClientRect()
        return (r.width < 1 || r.height < 1) && !e.classList.contains('rn-image-kosong')
      }).length,
      teksDiWadah: [...document.querySelectorAll('.rn-view, .rn-pressable')].filter((e) =>
        [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0)
      ).length,
    }
  })

  uji(berkas, 'tidak ada gulir mendatar pada 1280px', dasar.overflowX, 0)
  uji(berkas, 'setiap figure kode berisi tepat satu blok kode', dasar.kode, dasar.figures)
  uji(berkas, 'hanya satu tautan ditandai aria-current', dasar.ariaCurrent, 1)
  uji(berkas, 'tiap subbab punya keluaran atau alasan', dasar.subbabTanpaKeluaran, 0)

  if (dasar.kode > 0) uji(berkas, 'Prism menyorot sintaks (ada span.token)', dasar.tokens > 0, true)
  else lewati(berkas, 'Prism menyorot sintaks', 'halaman tanpa blok kode')

  if (dasar.frames.length > 0) uji(berkas, 'layar bingkai pertama 390px (bawaan penggeser)', dasar.layarPertama, 390)
  else lewati(berkas, 'layar bingkai pertama 390px', 'halaman tanpa bingkai ponsel')

  if (dasar.rnFlex) {
    uji(berkas, 'akar tiruan React Native → kolom', dasar.rnFlex, 'column')
    uji(berkas, 'teks tanpa style berukuran 14px (bawaan)', dasar.teksSalahUkuran, 0)
    uji(berkas, 'tidak ada gambar yang runtuh jadi 0×0 tanpa penanda', dasar.gambarNol, 0)
    uji(berkas, 'tidak ada teks ditaruh langsung di dalam wadah', dasar.teksDiWadah, 0)
  } else {
    lewati(berkas, 'akar tiruan React Native → kolom', 'halaman tanpa tiruan native')
  }

  if (dasar.webFlex) uji(berkas, 'kartu web dengan display:flex → baris', dasar.webFlex, 'row')
  else lewati(berkas, 'kartu web dengan display:flex → baris', 'halaman tanpa kolom web')

  for (const kelas of WAJIB[berkas] || []) {
    const ada = await tab.evaluate((sel) => Boolean(document.querySelector(sel)), kelas)
    uji(berkas, `elemen wajib ${kelas} ada`, ada, true)
  }

  // --- 2. Breakpoint 600 px di dalam bingkai (Bagian 4).
  const adaBreakpoint = await tab.evaluate(() => Boolean(document.querySelector('.rn-600')))
  if (adaBreakpoint) {
    const ukurArah = () =>
      tab.evaluate(() => {
        const el = document.querySelector('.rn-600')
        return { arah: getComputedStyle(el).flexDirection }
      })
    const sempit = await ukurArah()
    uji(berkas, 'susunan .rn-600 pada bingkai 390px', sempit.arah, 'column')

    await tab.evaluate(() => {
      const s = document.querySelector('[data-kendali-lebar]')
      if (!s) return
      s.value = '700'
      s.dispatchEvent(new Event('input', { bubbles: true }))
    })
    await tab.waitForTimeout(120)
    const lebar = await ukurArah()
    uji(berkas, 'susunan .rn-600 pada bingkai 700px', lebar.arah, 'row')

    await tab.evaluate(() => {
      const s = document.querySelector('[data-kendali-lebar]')
      if (!s) return
      s.value = '390'
      s.dispatchEvent(new Event('input', { bubbles: true }))
    })
    await tab.waitForTimeout(80)
  } else if (berkas === 'bagian-4.html') {
    uji(berkas, 'elemen wajib .rn-600 ada', false, true)
  }

  // --- 3. Galat konsol.
  uji(berkas, 'tidak ada galat di konsol', galatConsole.length, 0)

  // --- 4. Tangkapan layar pada tiga ukuran, sekaligus memeriksa gulir mendatar.
  for (const ukuran of UKURAN) {
    await tab.setViewportSize({ width: ukuran.lebar, height: ukuran.tinggi })
    await tab.waitForTimeout(120)
    const melintang = await tab.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    uji(berkas, `tidak ada gulir mendatar pada ${ukuran.lebar}px`, melintang, 0)

    const folder = join(KELUARAN, ukuran.nama)
    mkdirSync(folder, { recursive: true })
    await tab.screenshot({ path: join(folder, berkas.replace(/\.html$/, '.png')), fullPage: true })
  }

  await konteks.close()
}

await peramban.close()

console.log('| Yang diuji | Hasil | Harap | Status |')
console.log('|---|---|---|---|')
for (const b of baris) {
  console.log(`| ${b.halaman.replace('.html', '')} · ${b.asersi} | \`${b.hasil}\` | \`${b.harap}\` | ${b.status} |`)
}

const lulus = baris.filter((b) => b.status === 'lulus').length
console.log(
  `\nscreenshot-demo-web: ${lulus}/${baris.length} asersi lulus, ${gagal} gagal, ${dilewati} dilewati`
)
console.log(`tangkapan layar: ${KELUARAN.replace(ROOT + '/', '')}/{ponsel-potret,ponsel-lanskap,tablet}/`)
if (gagal > 0) process.exitCode = 1
