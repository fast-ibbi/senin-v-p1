#!/usr/bin/env node
/**
 * Tangkapan layar demo Bab 5 lewat Expo Web + Playwright.
 *
 * Dipakai untuk dua hal:
 *   1. bukti bahwa tiap layar benar-benar dirender (bukan hanya "kode sudah ditulis");
 *   2. cadangan kalau demo langsung di kelas gagal — tangkapan layar bisa ditayangkan.
 *
 * Pakai Playwright hanya untuk verifikasi; materinya tetap React Native murni
 * (lihat catatan devDependencies di README).
 *
 * Cara pakai:
 *
 *   cd demo/bab-05
 *   npx expo export --platform web        # menghasilkan folder dist/
 *   npx serve dist -l 8137                # atau: python3 -m http.server 8137 -d dist
 *   node scripts/tangkapan-layar.mjs      # DEMO_URL=http://localhost:8137
 *
 * Hasilnya ditulis ke docs/tangkapan-layar/<nama-viewport>/.
 */
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = process.env.DEMO_URL ?? 'http://localhost:8137';
const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const KELUARAN = join(AKAR, 'docs', 'tangkapan-layar');

// Tiga ukuran: ponsel potret, ponsel lanskap, tablet. Dua yang terakhir
// melewati breakpoint 600, jadi layar 4 dan 6 harus berubah susunan.
const VIEWPORT = [
  { nama: 'ponsel-potret', width: 390, height: 844 },
  { nama: 'ponsel-lanskap', width: 844, height: 390 },
  { nama: 'tablet', width: 834, height: 1112 },
];

// `tunggu` adalah teks yang wajib muncul sebelum tangkapan diambil, supaya
// tidak ada gambar yang tertangkap saat layar belum selesai dirender.
const LAYAR = [
  { id: '1-padanan', buka: /Buka bagian 1:/, tunggu: 'Padanan elemen web dan komponen native' },
  { id: '2-komponen', buka: /Buka bagian 2:/, tunggu: 'Enam komponen inti dan perannya' },
  { id: '3-gaya', buka: /Buka bagian 3:/, tunggu: 'Satu state, tiga wajah tombol' },
  { id: '4-responsif', buka: /Buka bagian 4:/, tunggu: 'Dua panel yang menyesuaikan lebar jendela' },
  {
    id: '5-scroller',
    buka: /Buka bagian 5:/,
    tunggu: 'ScrollView dan FlatList pada daftar yang sama',
    // Layar 5 punya dua mode; keduanya ditangkap karena angkanya berbeda.
    varian: [
      { akhiran: 'a-scrollview', klik: /Tampilkan daftar dengan ScrollView/ },
      { akhiran: 'b-flatlist', klik: /Tampilkan daftar dengan FlatList/ },
    ],
  },
  { id: '6-katalog', buka: /Buka bagian 6:/, tunggu: 'Katalog produk responsif' },
];

async function main() {
  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    console.error(
      'Playwright belum terpasang. Jalankan sekali:\n' +
        '  npm install --save-dev playwright\n' +
        '  npx playwright install chromium\n'
    );
    process.exit(1);
  }

  const peramban = await playwright.chromium.launch();
  const hasil = [];

  try {
    for (const viewport of VIEWPORT) {
      const folder = join(KELUARAN, viewport.nama);
      mkdirSync(folder, { recursive: true });

      const halaman = await peramban.newPage({ viewport });
      const galat = [];
      halaman.on('pageerror', (e) => galat.push(e.message));
      halaman.on('console', (m) => {
        if (m.type() === 'error') galat.push(m.text());
      });

      await halaman.goto(BASE_URL, { waitUntil: 'networkidle' });
      await halaman.getByText('DEMO KELAS · BAB 5').waitFor();
      await halaman.waitForTimeout(300);
      await halaman.screenshot({ path: join(folder, '0-menu.png') });
      hasil.push(`${viewport.nama}/0-menu.png`);

      for (const layar of LAYAR) {
        await halaman.getByRole('button', { name: layar.buka }).click();
        await halaman.getByText(layar.tunggu, { exact: true }).waitFor();
        await halaman.waitForTimeout(300);

        if (layar.varian) {
          for (const varian of layar.varian) {
            await halaman.getByRole('button', { name: varian.klik }).click();
            await halaman.waitForTimeout(600);
            const berkas = `${layar.id}${varian.akhiran}.png`;
            await halaman.screenshot({ path: join(folder, berkas) });
            hasil.push(`${viewport.nama}/${berkas}`);
          }
        } else {
          await halaman.screenshot({ path: join(folder, `${layar.id}.png`) });
          hasil.push(`${viewport.nama}/${layar.id}.png`);
        }

        await halaman.getByRole('button', { name: 'Kembali ke menu demo' }).click();
        await halaman.getByText('DEMO KELAS · BAB 5').waitFor();
      }

      if (galat.length > 0) {
        console.error(`Galat console pada ${viewport.nama}:\n  ` + galat.join('\n  '));
      }

      await halaman.close();
    }
  } finally {
    await peramban.close();
  }

  console.log(`tangkapan-layar: ${hasil.length} berkas ditulis ke docs/tangkapan-layar/`);
  for (const baris of hasil) console.log('  ' + baris);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
