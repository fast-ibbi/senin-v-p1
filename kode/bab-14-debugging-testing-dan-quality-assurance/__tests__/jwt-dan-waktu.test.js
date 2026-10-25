import test from 'node:test';
import assert from 'node:assert/strict';

import { bacaPayload, sudahKedaluwarsa, sisaUmurDetik } from '../utils/pemeriksaJwt.js';
import { umurTerbaca } from '../utils/waktu.js';

/**
 * Menguji JWT tanpa server, tanpa library, tanpa waktu nyata.
 *
 * Caranya: membuat token tiruan hanya dengan base64url — karena yang diuji adalah
 * *pembacaan*, bukan verifikasi tanda tangan. Perhatikan bahwa token di bawah
 * tidak sah; dan justru itu pelajarannya: aplikasi tidak boleh mempercayai isi
 * token untuk keputusan keamanan.
 */

/** Membuat token tanpa tanda tangan: header.payload. — cukup untuk menguji pembacaan. */
function tokenTiruan(payload) {
  const keBase64url = (objek) =>
    Buffer.from(JSON.stringify(objek)).toString('base64url');
  return `${keBase64url({ alg: 'HS256', typ: 'JWT' })}.${keBase64url(payload)}.tanda-tangan-palsu`;
}

test('bacaPayload mengembalikan isi payload', () => {
  const token = tokenTiruan({ sub: '20230001', nama: 'Nadia', exp: 2_000_000_000 });
  const payload = bacaPayload(token);
  assert.equal(payload.sub, '20230001');
  assert.equal(payload.nama, 'Nadia');
});

test('bacaPayload menolak bentuk yang bukan tiga bagian', () => {
  assert.equal(bacaPayload('bukan-token'), null);
  assert.equal(bacaPayload('a.b'), null);
  assert.equal(bacaPayload(null), null);
  assert.equal(bacaPayload('a.b.c.d'), null);
});

test('bacaPayload mengembalikan null untuk payload yang bukan JSON', () => {
  assert.equal(bacaPayload('aaaa.bbbb.cccc'), null);
});

test('sudahKedaluwarsa memakai waktu yang diberikan, bukan jam sistem', () => {
  const token = tokenTiruan({ sub: '20230001', exp: 1_700_000_000 });

  assert.equal(sudahKedaluwarsa(token, 1_699_999_999), false, 'masih satu detik');
  assert.equal(sudahKedaluwarsa(token, 1_700_000_000), true, 'exp <= sekarang');
  assert.equal(sudahKedaluwarsa(token, 1_700_000_001), true, 'sudah lewat');
});

test('token tanpa exp dianggap kedaluwarsa', () => {
  assert.equal(sudahKedaluwarsa(tokenTiruan({ sub: '20230001' }), 1), true);
});

test('sisaUmurDetik menghitung sisa dan bisa negatif', () => {
  const token = tokenTiruan({ exp: 1_700_000_600 });
  assert.equal(sisaUmurDetik(token, 1_700_000_000), 600);
  assert.equal(sisaUmurDetik(token, 1_700_001_000), -400);
});

test('umurTerbaca memilih satuan yang masuk akal', () => {
  assert.equal(umurTerbaca(0), 'baru saja');
  assert.equal(umurTerbaca(-5), 'baru saja');
  assert.equal(umurTerbaca(59_000), 'baru saja');
  assert.equal(umurTerbaca(60_000), '1 menit lalu');
  assert.equal(umurTerbaca(59 * 60_000), '59 menit lalu');
  assert.equal(umurTerbaca(60 * 60_000), '1 jam lalu');
  assert.equal(umurTerbaca(23 * 3_600_000), '23 jam lalu');
  assert.equal(umurTerbaca(24 * 3_600_000), '1 hari lalu');
  assert.equal(umurTerbaca(Number.NaN), 'baru saja');
});
