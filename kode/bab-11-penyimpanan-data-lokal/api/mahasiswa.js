import { permintaan } from './client.js';

/**
 * Biodata mahasiswa.
 *
 *   ambilProfil      GET  /api/mahasiswa/:nim
 *   simpanProfil     PUT  /api/mahasiswa/:nim
 *   daftarMahasiswa  POST /api/mahasiswa      → registrasi akun
 *
 * POST di sini bukan "buat mahasiswa oleh admin", melainkan "daftar akun baru" —
 * satu-satunya tempat mahasiswa sendiri menulis data ke koleksi mahasiswa.
 */

export async function ambilProfil(nim, { token, sinyal } = {}) {
  const hasil = await permintaan(`/api/mahasiswa/${nim}`, { token, sinyal });
  return hasil.data;
}

export async function simpanProfil(nim, perubahan, { token } = {}) {
  const hasil = await permintaan(`/api/mahasiswa/${nim}`, {
    metode: 'PUT',
    data: perubahan,
    token,
  });
  return hasil.data;
}

export async function daftarMahasiswa(data, { token } = {}) {
  const hasil = await permintaan('/api/mahasiswa', { metode: 'POST', data, token });
  return hasil.data;
}
