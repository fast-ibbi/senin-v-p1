import test from 'node:test';
import assert from 'node:assert/strict';

import {
  kekuatanPassword,
  labelKekuatan,
  MIN_PANJANG_PASSWORD,
  validasiEmail,
  validasiKonfirmasi,
  validasiLogin,
  validasiNama,
  validasiNim,
  validasiPassword,
  validasiProdi,
  validasiRegistrasi,
} from '../utils/validators.js';

/**
 * Unit test untuk aturan validasi.
 *
 * Ciri unit test yang baik: tidak butuh jaringan, tidak butuh emulator, selesai
 * dalam milidetik, dan gagal dengan pesan yang menunjuk penyebabnya.
 *
 * Jalankan: npm test
 */

test('validasiNim menolak kosong dan bukan 8 angka', () => {
  assert.equal(validasiNim('').sah, false);
  assert.equal(validasiNim('   ').sah, false);
  assert.equal(validasiNim('1234567').sah, false);
  assert.equal(validasiNim('123456789').sah, false);
  assert.equal(validasiNim('20AB0001').sah, false);
});

test('validasiNim menerima tepat 8 angka, termasuk yang berspasi di tepi', () => {
  assert.equal(validasiNim('20230001').sah, true);
  assert.equal(validasiNim(' 20230001 ').sah, true);
});

test('validasiNama menuntut minimal 3 karakter', () => {
  assert.equal(validasiNama('').sah, false);
  assert.equal(validasiNama('Ab').sah, false);
  assert.equal(validasiNama('Nadia').sah, true);
});

test('validasiEmail menolak format tanpa domain dan tanpa @', () => {
  assert.equal(validasiEmail('nadia@').sah, false);
  assert.equal(validasiEmail('nadia.student.ibbi.ac.id').sah, false);
  assert.equal(validasiEmail('nadia@student').sah, false);
  assert.equal(validasiEmail('nadia.putri@student.ibbi.ac.id').sah, true);
});

test('validasiPassword memakai batas MIN_PANJANG_PASSWORD', () => {
  assert.equal(validasiPassword('').sah, false);
  assert.equal(validasiPassword('a'.repeat(MIN_PANJANG_PASSWORD - 1)).sah, false);
  assert.equal(validasiPassword('a'.repeat(MIN_PANJANG_PASSWORD)).sah, true);
});

test('validasiKonfirmasi membedakan "belum diisi" dan "tidak sama"', () => {
  assert.equal(validasiKonfirmasi('rahasia123', '').pesan, 'Ulangi password terlebih dahulu.');
  assert.equal(validasiKonfirmasi('rahasia123', 'rahasia124').pesan, 'Password tidak sama.');
  assert.equal(validasiKonfirmasi('rahasia123', 'rahasia123').sah, true);
});

test('validasiProdi hanya menerima dua program studi', () => {
  assert.equal(validasiProdi('Sistem Informasi').sah, true);
  assert.equal(validasiProdi('Teknik Informatika').sah, true);
  assert.equal(validasiProdi('Manajemen').sah, false);
  assert.equal(validasiProdi('').sah, false);
});

test('validasiLogin mengumpulkan galat per field', () => {
  const kosong = validasiLogin({});
  assert.equal(kosong.sah, false);
  assert.ok(kosong.errors.nim);
  assert.ok(kosong.errors.password);

  const hanyaNim = validasiLogin({ nim: '20230001', password: '' });
  assert.equal(hanyaNim.errors.nim, undefined);
  assert.ok(hanyaNim.errors.password);

  assert.equal(validasiLogin({ nim: '20230001', password: 'rahasia123' }).sah, true);
});

test('validasiRegistrasi menandai semua field yang salah sekaligus', () => {
  const hasil = validasiRegistrasi({
    nim: '123',
    nama: 'Ab',
    email: 'bukan-email',
    prodi: 'Manajemen',
    password: 'pendek',
    konfirmasi: 'beda',
  });

  assert.equal(hasil.sah, false);
  assert.deepEqual(Object.keys(hasil.errors).sort(), [
    'email',
    'konfirmasi',
    'nama',
    'nim',
    'password',
    'prodi',
  ]);
});

test('validasiRegistrasi menerima isian lengkap yang benar', () => {
  const hasil = validasiRegistrasi({
    nim: '20250001',
    nama: 'Uji Coba',
    email: 'uji@student.ibbi.ac.id',
    prodi: 'Sistem Informasi',
    password: 'rahasia123',
    konfirmasi: 'rahasia123',
  });
  assert.equal(hasil.sah, true);
  assert.deepEqual(hasil.errors, {});
});

test('kekuatanPassword memberi skor 0 sampai 4', () => {
  assert.equal(kekuatanPassword(''), 0);
  assert.equal(kekuatanPassword('pendek'), 0, 'kurang dari 8 karakter');
  assert.equal(kekuatanPassword('rahasia123'), 2, 'panjang + angka');
  assert.equal(kekuatanPassword('Rahasia123'), 3, 'panjang + huruf besar + angka');
  assert.equal(kekuatanPassword('Rahasia123!'), 4, 'ditambah simbol');
  assert.equal(labelKekuatan[kekuatanPassword('Rahasia123!')], 'Sangat kuat');
});
