import { permintaan } from './client.js';

/**
 * Presensi berbasis lokasi.
 *
 * Aplikasi mengirim koordinat apa adanya; keputusan "di dalam area atau tidak"
 * diambil server (lihat `backend/routes/presensi.js`, rumus haversine).
 *
 * Itu bukan detail sepele: kalau aplikasi yang memutuskan, siapa pun bisa
 * memalsukan hasilnya cukup dengan mengubah kode di ponselnya sendiri.
 */
export async function kirimPresensi({ nim, kode, latitude, longitude }, { token } = {}) {
  const hasil = await permintaan('/api/presensi', {
    metode: 'POST',
    data: { nim, kode, latitude, longitude },
    token,
  });
  return hasil;
}

export async function ambilPresensi(nim, { token, sinyal } = {}) {
  const hasil = await permintaan(`/api/presensi?nim=${encodeURIComponent(nim)}`, { token, sinyal });
  return hasil.data;
}
