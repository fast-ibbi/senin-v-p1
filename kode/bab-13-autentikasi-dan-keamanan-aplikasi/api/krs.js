import { permintaan } from './client.js';

/**
 * KRS — subjek CRUD utama di bab 10.
 *
 * Empat fungsi, empat metode HTTP:
 *   ambilKrs      GET     /api/krs?nim=...      → daftar yang sudah tersimpan
 *   simpanKrs     POST    /api/krs              → ambil satu mata kuliah
 *   ubahKelasKrs  PATCH   /api/krs/:id          → ubah kelas / status
 *   batalkanKrs   DELETE  /api/krs/:id          → batalkan pengambilan
 *
 * Semua fungsi menerima `nim` (varian bab 10 belum memakai token). Di bab 13,
 * `token` ditambahkan dan `nim` tidak lagi dikirim dari aplikasi — server
 * membacanya dari token.
 */

export async function ambilKrs(nim, { token, sinyal } = {}) {
  const hasil = await permintaan(`/api/krs?nim=${encodeURIComponent(nim)}`, { token, sinyal });
  return { daftar: hasil.data, totalSks: hasil.totalSks };
}

export async function simpanKrs({ nim, kode, kelas = 'A' }, { token } = {}) {
  const hasil = await permintaan('/api/krs', {
    metode: 'POST',
    data: { nim, kode, kelas },
    token,
  });
  return hasil.data;
}

export async function ubahKelasKrs(id, kelas, { token } = {}) {
  const hasil = await permintaan(`/api/krs/${id}`, {
    metode: 'PATCH',
    data: { kelas },
    token,
  });
  return hasil.data;
}

export async function batalkanKrs(id, { token } = {}) {
  return permintaan(`/api/krs/${id}`, { metode: 'DELETE', token });
}
