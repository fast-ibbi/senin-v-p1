#!/usr/bin/env node
/**
 * Gerbang statis untuk 15 folder praktikum di `kode/`.
 *
 * Yang diperiksa (cepat, tanpa memasang dependensi tiap folder):
 *   1. Struktur folder sesuai daftar bab.
 *   2. `package.json`: nama, versi Expo terkunci, `type`, `main` sesuai era
 *      (template blank sampai bab 6, expo-router sejak bab 7).
 *   3. `app.json`: identitas siakad-mobile, `scheme` sejak bab 7.
 *   4. Setiap `.js`/`.jsx` bisa diparse (esbuild, loader JSX).
 *   5. Setiap import relatif menunjuk berkas yang benar-benar ada.
 *   6. Setiap `href`/`router.push` literal menunjuk rute yang ada di `app/`.
 *   7. Data mata kuliah di aplikasi sama dengan seed backend.
 *   8. Salinan backend identik dengan sumbernya (`sync-backend --check`).
 *
 * Yang TIDAK diperiksa di sini: apakah Metro bisa mem-bundle. Itu tugas CI
 * (`npm install` + `npx expo export`) untuk lima folder sentinel.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { transform } from 'esbuild'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const KODE = join(ROOT, 'kode')

const BAB = [
  'bab-01-pengantar-pemrograman-mobile',
  'bab-02-persiapan-lingkungan-pengembangan',
  'bab-03-javascript-modern-untuk-react-native',
  'bab-04-dasar-react',
  'bab-05-dasar-react-native',
  'bab-06-membangun-user-interface-mobile',
  'bab-07-navigasi-aplikasi',
  'bab-08-form-input-dan-validasi',
  'bab-09-state-management',
  'bab-10-rest-api-dan-backend-integration',
  'bab-11-penyimpanan-data-lokal',
  'bab-12-mengakses-fitur-perangkat',
  'bab-13-autentikasi-dan-keamanan-aplikasi',
  'bab-14-debugging-testing-dan-quality-assurance',
  'bab-15-build-dan-deployment',
]

const BAB_RINGKAS = (nama) => Number(nama.slice(4, 6))
const EKSTENSI = ['', '.js', '.jsx', '.json', '.mjs', '/index.js', '/index.jsx']
const LEWATI = new Set(['node_modules', '.expo', 'dist', '.git', 'android', 'ios'])

const gagal = []
const periksa = (kondisi, pesan) => {
  if (!kondisi) gagal.push(pesan)
  return kondisi
}

/** Semua berkas di bawah sebuah folder, melewati node_modules dan hasil build. */
function semuaBerkas(folder, hasil = []) {
  for (const nama of readdirSync(folder)) {
    if (LEWATI.has(nama)) continue
    const penuh = join(folder, nama)
    const info = statSync(penuh)
    if (info.isDirectory()) semuaBerkas(penuh, hasil)
    else if (info.isFile()) hasil.push(penuh)
  }
  return hasil
}

/** Menyelesaikan import relatif dengan daftar ekstensi yang Metro dukung. */
function selesaikanImport(dari, target) {
  const dasar = resolve(dirname(dari), target)
  return EKSTENSI.some((ekstensi) => existsSync(dasar + ekstensi))
}

/**
 * Rute yang tersedia dari pohon `app/`.
 * Grup `(tabs)` tidak menambah segmen alamat, jadi dua bentuk didaftarkan.
 */
function ruteAplikasi(folderApp) {
  const rute = new Set()
  if (!existsSync(folderApp)) return rute

  const daftarBerkas = semuaBerkas(folderApp).filter((f) => /\.(js|jsx)$/.test(f))

  for (const berkas of daftarBerkas) {
    let relatif = relative(folderApp, berkas).replace(/\.(js|jsx)$/, '').replace(/\\/g, '/')
    if (relatif === '_layout' || relatif.endsWith('/_layout')) continue
    if (relatif.endsWith('/index')) relatif = relatif.slice(0, -'/index'.length)
    if (relatif === 'index') relatif = ''

    const segmen = relatif.split('/').filter(Boolean)
    const denganGrup = `/${segmen.join('/')}`
    const tanpaGrup = `/${segmen.filter((s) => !s.startsWith('(')).join('/')}`

    rute.add(denganGrup)
    rute.add(tanpaGrup)
    rute.add(denganGrup.replace(/\/\[[^\]]+\]/g, '/:dinamis'))
    rute.add(tanpaGrup.replace(/\/\[[^\]]+\]/g, '/:dinamis'))
  }

  return rute
}

/** Mencocokkan alamat literal ke rute yang terdaftar. */
function alamatCocok(rute, alamat) {
  const bersih = alamat.split('?')[0].replace(/\/$/, '') || '/'
  if (rute.has(bersih)) return true

  const segmen = bersih.split('/').filter(Boolean)
  const kandidat = [`/${segmen.map((s) => s.replace(/^\[[^\]]+\]$/, ':dinamis')).join('/')}`]
  kunciKandidat: for (const pola of ['/', `/${segmen.filter((s) => !s.startsWith('(')).join('/')}`]) {
    const segmenPola = pola.split('/').filter(Boolean)
    if (segmenPola.length !== segmen.length) continue
    for (let i = 0; i < segmenPola.length; i += 1) {
      const p = segmenPola[i]
      if (p === ':dinamis' || p.startsWith('[')) continue
      if (!segmen.includes(p)) continue kunciKandidat
    }
    kandidat.push(pola)
  }

  return kandidat.some((k) => rute.has(k) || rute.has(k.replace(/\/[^/]+$/, '/:dinamis')))
}

function bacaJson(berkas) {
  try {
    return JSON.parse(readFileSync(berkas, 'utf8'))
  } catch (err) {
    gagal.push(`${relative(ROOT, berkas)}: JSON tidak valid — ${err.message}`)
    return null
  }
}

const IMPORT_RE = /(?:from\s+|import\s*\(\s*|require\s*\(\s*)['"](\.[^'"]+)['"]/g
const HREF_RE = /(?:href=|router\.(?:push|replace)\()\s*(?:\{\s*)?[`'"]([^`'"]+)[`'"]/g

let totalBerkas = 0
let totalImport = 0
let totalRute = 0

for (const namaBab of BAB) {
  const folder = join(KODE, namaBab)
  if (!periksa(existsSync(folder), `folder hilang: kode/${namaBab}`)) continue

  const bab = BAB_RINGKAS(namaBab)
  const berkas = semuaBerkas(folder)
  totalBerkas += berkas.length

  // README wajib ada dan punya bagian penilaian.
  const readme = join(folder, 'README.md')
  if (periksa(existsSync(readme), `${namaBab}: README.md tidak ada`)) {
    const isi = readFileSync(readme, 'utf8')
    for (const bagian of ['## Checkpoint', '## Troubleshooting']) {
      periksa(isi.includes(bagian), `${namaBab}: README tanpa bagian "${bagian}"`)
    }
  }

  const jsonFiles = [
    join(folder, 'app.json'),
    join(folder, 'eas.json'),
    join(folder, 'tsconfig.json'),
    join(folder, '.vscode', 'settings.json'),
  ].filter((f) => existsSync(f))
  for (const berkasJson of jsonFiles) bacaJson(berkasJson)

  // --- 1. package.json
  const pkgPath = join(folder, 'package.json')
  if (existsSync(pkgPath)) {
    const pkg = bacaJson(pkgPath)
    if (pkg) {
      periksa(pkg.name === 'siakad-mobile', `${namaBab}: package.json name harus siakad-mobile`)
      periksa(pkg.type === 'module', `${namaBab}: package.json harus "type": "module"`)
      periksa(
        typeof pkg.dependencies?.expo === 'string' && pkg.dependencies.expo.startsWith('~57.'),
        `${namaBab}: expo harus dikunci ke ~57.x (sekarang ${pkg.dependencies?.expo})`,
      )
      if (bab >= 2) {
        const main = bab >= 7 ? 'expo-router/entry' : 'index.js'
        periksa(pkg.main === main, `${namaBab}: package.json main harus "${main}"`)
      }
      if (bab >= 10) {
        periksa(Boolean(pkg.scripts?.api), `${namaBab}: skrip "api" tidak ada`)
        periksa(Boolean(pkg.dependencies?.express), `${namaBab}: express tidak dideklarasikan`)
      }
      if (bab >= 13) {
        periksa(
          Boolean(pkg.dependencies?.['expo-secure-store']),
          `${namaBab}: expo-secure-store tidak dideklarasikan`,
        )
        periksa(
          Boolean(pkg.dependencies?.jsonwebtoken),
          `${namaBab}: jsonwebtoken tidak dideklarasikan`,
        )
      }
      if (bab >= 14) {
        periksa(
          pkg.scripts?.test?.includes('node --test'),
          `${namaBab}: skrip test harus memakai node --test`,
        )
      }
    }
  } else {
    periksa(bab <= 1, `${namaBab}: package.json tidak ada`)
  }

  // --- 2. app.json
  const appJsonPath = join(folder, 'app.json')
  if (existsSync(appJsonPath)) {
    const cfg = bacaJson(appJsonPath)
    const expo = cfg?.expo
    if (expo) {
      periksa(expo.name === 'siakad-mobile', `${namaBab}: app.json expo.name harus siakad-mobile`)
      periksa(expo.slug === 'siakad-mobile', `${namaBab}: app.json expo.slug harus siakad-mobile`)
      if (bab >= 7) {
        periksa(expo.scheme === 'siakad-mobile', `${namaBab}: app.json butuh scheme siakad-mobile`)
      }
      if (bab >= 15) {
        periksa(
          expo.android?.package === 'ac.id.ibbi.siakad',
          `${namaBab}: application ID harus ac.id.ibbi.siakad`,
        )
        periksa(
          expo.ios?.bundleIdentifier === 'ac.id.ibbi.siakad',
          `${namaBab}: bundleIdentifier harus ac.id.ibbi.siakad`,
        )
      }
    }
  }

  // --- 3. backend sesuai varian
  const backend = join(folder, 'backend')
  if (bab >= 10) {
    periksa(existsSync(join(backend, 'server.js')), `${namaBab}: backend/server.js tidak ada`)
    const adaAuth = existsSync(join(backend, 'routes', 'auth.js'))
    periksa(
      bab >= 13 ? adaAuth : !adaAuth,
      `${namaBab}: varian backend salah (auth ${adaAuth ? 'ada' : 'tidak ada'})`,
    )
  } else {
    periksa(!existsSync(backend), `${namaBab}: tidak boleh punya backend`)
  }

  // --- 4. parse + 5. import relatif + 6. rute
  const rute = bab >= 7 ? ruteAplikasi(join(folder, 'app')) : new Set()

  for (const berkasSatu of berkas) {
    if (!/\.(js|jsx)$/.test(berkasSatu)) continue
    const isi = readFileSync(berkasSatu, 'utf8')
    const relatifBerkas = relative(ROOT, berkasSatu)

    try {
      transform(isi, { loader: 'jsx', format: 'esm' })
    } catch (err) {
      const baris = err.errors?.[0]?.location?.line
      gagal.push(`${relatifBerkas}: gagal diparse${baris ? ` (baris ${baris})` : ''} — ${err.errors?.[0]?.text ?? err.message}`)
      continue
    }

    for (const cocok of isi.matchAll(IMPORT_RE)) {
      totalImport += 1
      const target = cocok[1]
      if (!selesaikanImport(berkasSatu, target)) {
        gagal.push(`${relatifBerkas}: import "${target}" tidak menunjuk berkas yang ada`)
      }
    }

    if (rute.size > 0) {
      for (const cocok of isi.matchAll(HREF_RE)) {
        const alamat = cocok[1]
        if (!alamat.startsWith('/')) continue
        if (alamat.includes('${')) continue
        totalRute += 1
        if (!alamatCocok(rute, alamat)) {
          gagal.push(`${relatifBerkas}: tautan "${alamat}" tidak cocok dengan rute mana pun`)
        }
      }
    }
  }

  // --- 7. data aplikasi == seed backend
  if (bab >= 3 && bab <= 9) {
    const dataMk = join(folder, 'data', 'matakuliah.js')
    const seed = join(KODE, '_backend', 'shared', 'data', 'db.seed.json')
    if (existsSync(dataMk) && existsSync(seed)) {
      const isiSeed = JSON.parse(readFileSync(seed, 'utf8')).matakuliah.map((mk) => `${mk.kode}:${mk.sks}:${mk.semester}`)
      const modul = await import(`file://${dataMk}`)
      const isiData = modul.matakuliah.map((mk) => `${mk.kode}:${mk.sks}:${mk.semester}`)
      periksa(
        isiSeed.slice().sort().join('|') === isiData.slice().sort().join('|'),
        `${namaBab}: data/matakuliah.js menyimpang dari seed backend`,
      )
    }
  }
}

// --- 8. salinan backend
const sync = spawnSync(process.execPath, [join(ROOT, 'scripts', 'sync-backend.mjs'), '--check'], {
  encoding: 'utf8',
})
if (sync.status !== 0) {
  gagal.push(`salinan backend menyimpang:\n${(sync.stderr || sync.stdout).trim()}`)
}

// --- laporan
const jumlahFolder = BAB.filter((nama) => existsSync(join(KODE, nama))).length
console.log(
  `verify-kode: ${jumlahFolder}/${BAB.length} folder · ${totalBerkas} berkas · ` +
    `${totalImport} import relatif · ${totalRute} tautan rute`,
)

if (gagal.length === 0) {
  console.log('verify-kode: semua pemeriksaan lulus.')
  process.exit(0)
}

console.error(`\nverify-kode: ${gagal.length} masalah\n`)
for (const pesan of gagal) console.error(`  ✗ ${pesan}`)
process.exit(1)
