#!/usr/bin/env node
/**
 * Tangkapan layar + pemeriksaan alur aplikasi pesan-makanan lewat Expo Web.
 *
 * Skrip ini dipakai untuk dua hal:
 *   1. bukti bahwa layar benar-benar dirender dan hitungannya benar (bukan hanya
 *      "kodenya sudah ditulis");
 *   2. cadangan kalau demo langsung di kelas gagal — tangkapan layar bisa
 *      ditayangkan.
 *
 * Playwright hanya dipakai untuk verifikasi. Materi yang diajarkan tetap React
 * Native murni; tidak ada satu baris pun di App.js/components/screens yang
 * bergantung pada Playwright.
 *
 * Cara pakai:
 *
 *   cd demo/bab-05-pesan-makanan
 *   npx expo export --platform web
 *   npx serve dist -l 8139            # atau: python3 -m http.server 8139 -d dist
 *   node scripts/tangkapan-layar.mjs  # DEMO_URL=http://localhost:8139
 *
 * Hasilnya ditulis ke docs/tangkapan-layar/<nama-viewport>/.
 */
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = process.env.DEMO_URL ?? 'http://localhost:8139';
const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const KELUARAN = join(AKAR, 'docs', 'tangkapan-layar');

// Tiga ukuran yang melewati kedua breakpoint di theme/warna.js:
// 390 → 1 kolom (kartu mendatar), 834 → 2 kolom, 1280 → 3 kolom.
const VIEWPORT = [
  { nama: 'ponsel', width: 390, height: 844 },
  { nama: 'tablet', width: 834, height: 1112 },
  { nama: 'lebar', width: 1280, height: 900 },
];

// Harga di data/menu.js: geprek 15.000, es teh 6.000, ongkir 8.000.
const SUBTOTAL = 15000 * 2 + 6000;
const TOTAL = SUBTOTAL + 8000;

function rupiah(nilai) {
  return `Rp${nilai.toLocaleString('id-ID')}`;
}

function gagal(pesan) {
  throw new Error(`Pemeriksaan gagal: ${pesan}`);
}

async function main() {
  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    console.error(
      'Playwright belum terpasang. Jalankan sekali:\n' +
        '  npm install\n' +
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
      await halaman.getByText('Mau makan apa hari ini?').waitFor();
      await halaman.waitForTimeout(300);

      // --- Katalog ---
      const jumlahKartu = await halaman.locator('[aria-label^="Tambah "]').count();
      if (jumlahKartu !== 12) gagal(`${viewport.nama}: kartu menu ${jumlahKartu}, seharusnya 12`);
      await halaman.screenshot({ path: join(folder, '1-katalog.png') });
      hasil.push(`${viewport.nama}/1-katalog.png`);

      // --- Tambah ke keranjang: geprek 2×, es teh 1× ---
      await halaman.locator('[aria-label="Tambah Nasi Ayam Geprek"]').click();
      await halaman.locator('[aria-label="Tambah Nasi Ayam Geprek"]').click();
      await halaman.locator('[aria-label="Tambah Es Teh Manis"]').click();
      await halaman.getByText('3 item').waitFor();

      // --- Keranjang ---
      await halaman.locator('[aria-label="Lihat Keranjang"]').click();
      await halaman.getByText(rupiah(SUBTOTAL)).first().waitFor();
      await halaman.waitForTimeout(300);
      await halaman.screenshot({ path: join(folder, '2-keranjang.png') });
      hasil.push(`${viewport.nama}/2-keranjang.png`);

      // --- Pesan sekarang ---
      await halaman.locator('[aria-label="Pesan sekarang"]').click();
      await halaman.getByText('Pesanan diterima').waitFor();
      await halaman.waitForTimeout(300);
      await halaman.screenshot({ path: join(folder, '3-pesanan.png') });
      hasil.push(`${viewport.nama}/3-pesanan.png`);

      // Hitungan uang harus benar: total yang tertulis = subtotal + ongkir.
      const teks = await halaman.evaluate(() => document.body.innerText);
      if (!teks.includes(rupiah(TOTAL))) {
        gagal(`${viewport.nama}: total ${rupiah(TOTAL)} tidak muncul di layar pesanan`);
      }

      // Keranjang harus kosong lagi setelah "Pesan lagi".
      await halaman.locator('[aria-label="Pesan lagi"]').click();
      await halaman.getByText('Mau makan apa hari ini?').waitFor();
      if ((await halaman.locator('[aria-label="Lihat Keranjang"]').count()) !== 0) {
        gagal(`${viewport.nama}: bilah keranjang masih muncul setelah pesanan selesai`);
      }

      if (galat.length > 0) {
        gagal(`${viewport.nama}: galat console\n  ${galat.join('\n  ')}`);
      }

      await halaman.close();
    }
  } finally {
    await peramban.close();
  }

  console.log(`tangkapan-layar: ${hasil.length} berkas ditulis ke docs/tangkapan-layar/`);
  for (const baris of hasil) console.log('  ' + baris);
  console.log('pemeriksaan alur: lulus');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
