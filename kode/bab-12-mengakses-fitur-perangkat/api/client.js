import { Platform } from 'react-native';

/**
 * Satu-satunya tempat alamat server ditentukan.
 *
 * Mengapa tidak `localhost` saja? Emulator Android menjalankan aplikasi di dalam
 * mesin virtual; `localhost` di sana menunjuk emulator itu sendiri, bukan laptop
 * kamu. `10.0.2.2` adalah alamat khusus yang diteruskan ke host.
 *
 * Perangkat fisik (Expo Go di ponsel) tidak bisa memakai keduanya: isi
 * `EXPO_PUBLIC_API_URL` di berkas `.env` dengan IP laptop, misalnya
 * EXPO_PUBLIC_API_URL=http://192.168.1.10:3000
 */
const OTOMATIS = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
});

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? OTOMATIS;

/** Batas waktu satu permintaan; tanpa ini, fetch bisa menggantung selamanya. */
const BATAS_MS = 8000;

/**
 * Kesalahan dari lapisan ini selalu berbentuk objek yang sama:
 *   { kode, pesan, status }
 *
 * Layar tidak perlu tahu apakah kegagalan datang dari jaringan, dari status 4xx,
 * atau dari server yang mengirim teks bukan JSON. Semua diseragamkan di sini.
 */
export class KesalahanApi extends Error {
  constructor(pesan, { kode = 'GALAT_TAK_DIKENAL', status = 0 } = {}) {
    super(pesan);
    this.name = 'KesalahanApi';
    this.kode = kode;
    this.status = status;
  }
}

export async function permintaan(jalur, { metode = 'GET', data, token, sinyal } = {}) {
  const pengendali = new AbortController();
  const pembatal = setTimeout(() => pengendali.abort(), BATAS_MS);

  // Kalau layar dibongkar di tengah permintaan, pemanggil bisa membatalkannya.
  if (sinyal) {
    sinyal.addEventListener('abort', () => pengendali.abort(), { once: true });
  }

  try {
    const respons = await fetch(`${BASE_URL}${jalur}`, {
      method: metode,
      signal: pengendali.signal,
      headers: {
        Accept: 'application/json',
        ...(data ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    // Server yang mati atau salah alamat bisa mengembalikan HTML, bukan JSON.
    const teks = await respons.text();
    let isi = null;
    try {
      isi = teks ? JSON.parse(teks) : null;
    } catch {
      throw new KesalahanApi('Server mengirim jawaban yang bukan JSON.', {
        kode: 'JAWABAN_BUKAN_JSON',
        status: respons.status,
      });
    }

    if (!respons.ok) {
      throw new KesalahanApi(isi?.pesan ?? `Permintaan gagal (${respons.status}).`, {
        kode: isi?.kode ?? `HTTP_${respons.status}`,
        status: respons.status,
      });
    }

    return isi;
  } catch (err) {
    if (err instanceof KesalahanApi) throw err;

    if (err.name === 'AbortError') {
      throw new KesalahanApi(
        `Server tidak menjawab dalam ${BATAS_MS / 1000} detik. Cek apakah "npm run api" sudah jalan.`,
        { kode: 'BATAS_WAKTU' },
      );
    }

    throw new KesalahanApi(
      `Tidak bisa menghubungi ${BASE_URL}. Pastikan API berjalan dan alamatnya benar.`,
      { kode: 'JARINGAN' },
    );
  } finally {
    clearTimeout(pembatal);
  }
}
