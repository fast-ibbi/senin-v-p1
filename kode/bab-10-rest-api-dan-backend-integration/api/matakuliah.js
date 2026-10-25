import { permintaan } from './client.js';

/**
 * Katalog mata kuliah.
 *
 * Perhatikan bahwa berkas ini tidak tahu apa pun tentang React: tidak ada
 * `useState`, tidak ada `useEffect`. Yang ada hanya "cara berbicara dengan
 * server". Layar bebas memutuskan kapan memanggilnya.
 */

export async function ambilMatakuliah({ semester, q, sinyal } = {}) {
  const params = new URLSearchParams();
  if (semester !== undefined) params.set('semester', String(semester));
  if (q) params.set('q', q);

  const jalur = `/api/matakuliah${params.toString() ? `?${params}` : ''}`;
  const hasil = await permintaan(jalur, { sinyal });
  return hasil.data;
}

export async function ambilMatakuliahSatu(kode, { sinyal } = {}) {
  const hasil = await permintaan(`/api/matakuliah/${kode}`, { sinyal });
  return hasil.data;
}
