import test from 'node:test';
import assert from 'node:assert/strict';

import { nilai } from '../data/mahasiswa.js';
import { matakuliah } from '../data/matakuliah.js';
import {
  cariMatakuliah,
  filterSemester,
  hitungIpk,
  kelompokkanPerSemester,
  ringkas,
  sisaKuota,
  tentukanPredikat,
  totalSks,
  totalSksAktif,
  urutkanJadwal,
} from '../utils/akademik.js';

/**
 * Unit test untuk perhitungan akademik.
 *
 * Perhatikan tiga jenis pemeriksaan yang berbeda tujuannya:
 *   - nilai yang benar (happy path)
 *   - batas (3,50 tepat di ambang "Dengan Pujian")
 *   - sifat fungsi (sort tidak boleh mengubah array asli)
 */

test('totalSks menjumlahkan sks dan aman untuk array kosong', () => {
  assert.equal(totalSks([]), 0);
  assert.equal(totalSks([{ sks: 3 }, { sks: 2 }]), 5);
  assert.equal(totalSks(matakuliah.filter((mk) => mk.semester === 5)), 22);
});

test('filterSemester tidak mengubah array asli', () => {
  const sebelum = matakuliah.length;
  const semester3 = filterSemester(matakuliah, 3);
  assert.equal(semester3.length, 3);
  assert.equal(matakuliah.length, sebelum);
  assert.ok(semester3.every((mk) => mk.semester === 3));
});

test('cariMatakuliah mengembalikan undefined untuk kode yang tidak ada', () => {
  assert.equal(cariMatakuliah(matakuliah, 'SI501').nama, 'Pemrograman Mobile');
  assert.equal(cariMatakuliah(matakuliah, 'ZZ999'), undefined);
});

test('hitungIpk menghasilkan 3,70 untuk data contoh', () => {
  assert.equal(hitungIpk(nilai), 3.7);
});

test('hitungIpk mengembalikan 0 untuk data kosong (bukan NaN)', () => {
  assert.equal(hitungIpk([]), 0);
});

test('hitungIpk membulatkan ke dua desimal', () => {
  const hasil = hitungIpk([
    { sks: 3, nilaiHuruf: 'A' },
    { sks: 3, nilaiHuruf: 'B' },
  ]);
  assert.equal(hasil, 3.5);
});

test('tentukanPredikat tepat di batas', () => {
  assert.equal(tentukanPredikat(3.5), 'Dengan Pujian');
  assert.equal(tentukanPredikat(3.49), 'Sangat Memuaskan');
  assert.equal(tentukanPredikat(3.0), 'Sangat Memuaskan');
  assert.equal(tentukanPredikat(2.99), 'Memuaskan');
  assert.equal(tentukanPredikat(2.5), 'Memuaskan');
  assert.equal(tentukanPredikat(2.0), 'Cukup');
  assert.equal(tentukanPredikat(1.99), 'Perlu Perbaikan');
});

test('urutkanJadwal mengurutkan hari lalu jam tanpa mengubah array asli', () => {
  const asli = [...matakuliah];
  const urut = urutkanJadwal(matakuliah);

  assert.equal(urut[0].hari, 'Senin');
  assert.equal(urut[0].jam, '08.00-10.30');
  assert.deepEqual(matakuliah, asli, 'array asli tidak boleh berubah');
  assert.notEqual(urut, matakuliah, 'hasilnya array baru');
});

test('kelompokkanPerSemester menghitung jumlah per semester', () => {
  const kelompok = kelompokkanPerSemester(matakuliah);
  assert.equal(kelompok[3].length, 3);
  assert.equal(kelompok[5].length, 8);
});

test('sisaKuota tidak pernah negatif dan nol saat penuh', () => {
  assert.equal(sisaKuota({ kuota: 40, terisi: 34 }), 6);
  assert.equal(sisaKuota({ kuota: 40, terisi: 40 }), 0);
  assert.equal(sisaKuota({ kuota: 40, terisi: 45 }), 0, 'data berlebih pun tidak negatif');
});

test('ringkas memakai format yang stabil', () => {
  assert.equal(
    ringkas({ kode: 'SI501', nama: 'Pemrograman Mobile', sks: 3 }),
    'SI501 · Pemrograman Mobile · 3 SKS',
  );
});

test('totalSksAktif mengabaikan baris yang dibatalkan', () => {
  assert.equal(
    totalSksAktif([
      { sks: 3, status: 'terdaftar' },
      { sks: 3, status: 'dibatalkan' },
      { sks: 2, status: 'terdaftar' },
    ]),
    5,
  );
});
