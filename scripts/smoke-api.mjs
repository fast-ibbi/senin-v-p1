#!/usr/bin/env node
/**
 * Uji asap (smoke test) API SIAKAD.
 *
 * Dipakai CI setelah `npm install` di folder bab 13:
 *   node backend/server.js & node scripts/smoke-api.mjs
 *
 * Yang diperiksa hanya jalur yang paling penting — bukan seluruh perilaku:
 * server hidup, login mengeluarkan token, route terjaga menolak tanpa token,
 * dan menerima dengan token. Rincian tiap aturan ada di unit test bab 14.
 */
const BASE = process.env.SMOKE_BASE ?? 'http://127.0.0.1:3000'
const NIM = process.env.SMOKE_NIM ?? '20230001'
const PASSWORD = process.env.SMOKE_PASSWORD ?? 'rahasia123'

const hasil = []
const catat = (lulus, label, tambahan = '') =>
  hasil.push(`${lulus ? 'PASS' : 'FAIL'}  ${label}${tambahan ? `  (${tambahan})` : ''}`)

async function panggil(jalur, opsi = {}) {
  const respons = await fetch(`${BASE}${jalur}`, opsi)
  let isi = null
  try {
    isi = await respons.json()
  } catch {
    /* jawaban bukan JSON — dibiarkan null */
  }
  return { status: respons.status, isi }
}

async function tungguHidup(percobaan = 30) {
  for (let i = 0; i < percobaan; i += 1) {
    try {
      const { status } = await panggil('/api/health')
      if (status === 200) return true
    } catch {
      /* server belum siap */
    }
    await new Promise((selesai) => setTimeout(selesai, 200))
  }
  return false
}

if (!(await tungguHidup())) {
  console.error(`smoke-api: server tidak menjawab di ${BASE}`)
  process.exit(1)
}

const health = await panggil('/api/health')
catat(health.status === 200, 'GET /api/health')

const tanpaToken = await panggil('/api/krs')
catat(tanpaToken.status === 401, 'GET /api/krs tanpa token → 401', `status ${tanpaToken.status}`)

const publik = await panggil('/api/matakuliah?semester=5')
catat(publik.status === 200 && Array.isArray(publik.isi?.data), 'GET /api/matakuliah publik')

const salah = await panggil('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nim: NIM, password: 'password-salah' }),
})
catat(salah.status === 401, 'login password salah → 401', `status ${salah.status}`)

const login = await panggil('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nim: NIM, password: PASSWORD }),
})
catat(login.status === 200 && typeof login.isi?.token === 'string', 'login benar → token')

const headers = { Authorization: `Bearer ${login.isi?.token}` }
const krs = await panggil('/api/krs', { headers })
catat(krs.status === 200 && Array.isArray(krs.isi?.data), 'GET /api/krs dengan token')

const nilai = await panggil('/api/nilai', { headers })
catat(typeof nilai.isi?.ipk === 'number', 'GET /api/nilai menghitung IPK', `ipk ${nilai.isi?.ipk}`)

const rusak = await panggil('/api/krs', { headers: { Authorization: 'Bearer aaa.bbb.ccc' } })
catat(rusak.status === 401, 'token rusak → 401', `status ${rusak.status}`)

console.log(hasil.join('\n'))
const gagal = hasil.filter((baris) => baris.startsWith('FAIL')).length
console.log(`\nsmoke-api: ${hasil.length - gagal}/${hasil.length} lulus`)
process.exit(gagal === 0 ? 0 : 1)
