import { Linking } from 'react-native';

/**
 * Satu pola untuk semua izin runtime.
 *
 * Yang mudah dilupakan pemula: izin punya **tiga** keadaan, bukan dua.
 *   granted       → boleh dipakai
 *   denied        → belum diberi, masih boleh ditanya lagi
 *   blocked/ask   → sudah ditolak permanen; meminta lagi tidak memunculkan dialog
 *
 * Kalau keadaan ketiga tidak ditangani, tombol "Ambil foto" terlihat rusak:
 * ditekan berkali-kali, tidak ada apa pun terjadi.
 */
export const ALASAN = {
  kamera: 'Kamera dipakai untuk memotret foto profil. Gambar tidak dikirim ke mana pun selain server kampus.',
  lokasi: 'Lokasi dipakai sekali saat presensi, untuk memastikan kamu berada di area kampus.',
};

/** Status mentah dari expo-* dinormalisasi supaya layar tidak menghafalnya. */
export function normalisasiStatus(status) {
  if (status === 'granted') return 'diberikan';
  if (status === 'undetermined') return 'belum-diminta';
  return 'ditolak';
}

/**
 * Meminta izin bila perlu, lalu memberi vonis yang bisa dipakai layar.
 *
 * @param {object} argumen
 * @param {() => Promise<{status: string, canAskAgain?: boolean}>} argumen.minta
 * @param {string} argumen.statusSekarang  status izin saat ini
 * @param {string} argumen.jenis           'kamera' | 'lokasi'
 */
export async function pastikanIzin({ minta, statusSekarang, jenis }) {
  const keadaan = normalisasiStatus(statusSekarang);

  if (keadaan === 'diberikan') {
    return { diizinkan: true, perluPengaturan: false, pesan: null };
  }

  const hasil = await minta();
  const setelah = normalisasiStatus(hasil.status);

  if (setelah === 'diberikan') {
    return { diizinkan: true, perluPengaturan: false, pesan: null };
  }

  // canAskAgain === false berarti pengguna memilih "Don't ask again".
  const perluPengaturan = hasil.canAskAgain === false;

  return {
    diizinkan: false,
    perluPengaturan,
    pesan: perluPengaturan
      ? `Izin ${jenis} diblokir. Buka pengaturan aplikasi untuk mengizinkannya.`
      : `Izin ${jenis} belum diberikan. ${ALASAN[jenis] ?? ''}`,
  };
}

/** Android dan iOS sama-sama membuka halaman pengaturan aplikasi lewat cara ini. */
export async function bukaPengaturan() {
  try {
    await Linking.openSettings();
    return true;
  } catch {
    return false;
  }
}
