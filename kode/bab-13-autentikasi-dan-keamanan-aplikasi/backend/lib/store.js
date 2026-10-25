/**
 * Lapisan penyimpanan paling sederhana yang cukup untuk praktikum:
 * satu berkas JSON di memori, ditulis kembali setiap kali ada perubahan.
 *
 * Digunakan oleh semua route di semua bab. Tidak ada ORM, tidak ada query builder —
 * tujuannya supaya mahasiswa bisa membaca seluruh isinya dalam satu duduk.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BERKAS = join(import.meta.dirname, '..', 'data', 'db.json');

/** @type {any} */
let db = null;

function muat() {
  if (db === null) {
    db = JSON.parse(readFileSync(BERKAS, 'utf8'));
  }
  return db;
}

function simpan() {
  writeFileSync(BERKAS, `${JSON.stringify(db, null, 2)}\n`, 'utf8');
}

/** Id berurutan per koleksi, mis. "krs-7". */
function idBaru(koleksi, prefiks) {
  const data = muat();
  const daftar = data[koleksi] ?? [];
  const nomor = daftar
    .map((baris) => Number(String(baris.id).split('-')[1]))
    .filter((n) => Number.isFinite(n))
    .reduce((maks, n) => Math.max(maks, n), 0);
  return `${prefiks}-${nomor + 1}`;
}

/**
 * Membungkus satu operasi tulis: jalankan `ubah`, simpan, kembalikan hasilnya.
 * Dipakai supaya setiap route tidak perlu memanggil simpan() sendiri.
 */
function tulis(ubah) {
  const data = muat();
  const hasil = ubah(data);
  simpan();
  return hasil;
}

export { muat, simpan, idBaru, tulis };
