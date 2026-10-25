import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Pembungkus AsyncStorage: satu tempat untuk kunci, bentuk data, dan masa berlaku.
 *
 * Bentuk yang disimpan selalu sama:
 *   { data: <isi>, disimpanPada: <ISO string> }
 *
 * Menyimpan timestamp bukan kemewahan: tanpa itu aplikasi tidak bisa membedakan
 * "data kemarin" dari "data sekarang", dan tidak bisa memutuskan kapan harus
 * meminta ulang ke server.
 */
export const KUNCI = {
  nilai: 'siakad:nilai:v1',
  drafKrs: 'siakad:draf-krs:v1',
  profil: 'siakad:profil:v1',
};

/** Umur snapshot. Lewat dari ini, data dianggap usang dan hanya dipakai sebagai cadangan. */
export const TTL_MS = 6 * 60 * 60 * 1000; // 6 jam

export async function simpanSnapshot(kunci, data) {
  const bungkus = { data, disimpanPada: new Date().toISOString() };
  await AsyncStorage.setItem(kunci, JSON.stringify(bungkus));
  return bungkus;
}

/**
 * Membaca snapshot.
 *
 * Mengembalikan objek dengan tiga informasi, bukan langsung datanya:
 *   { data, disimpanPada, umurMs, kedaluwarsa }
 *
 * Pemanggil yang memutuskan: tetap tampilkan (kedaluwarsa = true) atau buang.
 * Membuang secara diam-diam di sini akan membuat layar kosong tanpa penjelasan.
 */
export async function bacaSnapshot(kunci, { ttl = TTL_MS } = {}) {
  const mentah = await AsyncStorage.getItem(kunci);
  if (!mentah) return null;

  try {
    const { data, disimpanPada } = JSON.parse(mentah);
    const umurMs = Date.now() - new Date(disimpanPada).getTime();
    return { data, disimpanPada, umurMs, kedaluwarsa: umurMs > ttl };
  } catch {
    // Isi rusak (mis. versi format lama): buang supaya tidak error berulang.
    await AsyncStorage.removeItem(kunci);
    return null;
  }
}

export async function hapusSnapshot(kunci) {
  await AsyncStorage.removeItem(kunci);
}

/** Dipanggil saat logout: tidak boleh ada data akademik tertinggal di perangkat. */
export async function hapusSemuaSnapshot() {
  await AsyncStorage.multiRemove(Object.values(KUNCI));
}

// `umurTerbaca` dipindahkan ke utils/waktu.js di bab 14: berkas ini mengimpor
// AsyncStorage (modul native) sehingga tidak bisa dijalankan `node --test`.
// Memisahkan fungsi murni dari lapisan I/O adalah langkah pertama agar bisa diuji.
export { umurTerbaca } from './waktu.js';
