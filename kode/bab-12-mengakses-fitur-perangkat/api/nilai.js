import { permintaan } from './client.js';

/**
 * Nilai (KHS) dari server.
 *
 * Bentuk jawabannya: { jumlah, totalSks, ipk, data: [...] } — perhatikan bahwa
 * IPK dihitung di server, bukan di aplikasi. Kalau dihitung di dua tempat, cepat
 * atau lambat keduanya berbeda.
 */
export async function ambilNilai(nim, { token, sinyal } = {}) {
  const hasil = await permintaan(`/api/nilai?nim=${encodeURIComponent(nim)}`, { token, sinyal });
  return {
    daftar: hasil.data,
    totalSks: hasil.totalSks,
    ipk: hasil.ipk,
  };
}
