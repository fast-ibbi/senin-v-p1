import * as SecureStore from 'expo-secure-store';

/**
 * Penyimpanan token.
 *
 * Mengapa SecureStore, bukan AsyncStorage?
 * AsyncStorage menulis ke penyimpanan biasa aplikasi: pada perangkat yang sudah
 * di-root atau lewat backup, isinya bisa dibaca. SecureStore memakai Keychain
 * (iOS) dan Keystore (Android) — dienkripsi oleh sistem, tidak ikut backup biasa.
 *
 * Batasannya penting untuk diketahui: ukuran nilai dibatasi (~2 KB di Android),
 * jadi yang disimpan hanya token, bukan data pengguna.
 */
const KUNCI_TOKEN = 'siakad.token';

export async function simpanToken(token) {
  await SecureStore.setItemAsync(KUNCI_TOKEN, token, {
    // Hanya bisa dibaca setelah perangkat dibuka sekali; tidak pernah ikut backup.
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function bacaToken() {
  try {
    return await SecureStore.getItemAsync(KUNCI_TOKEN);
  } catch {
    // SecureStore bisa gagal di perangkat tanpa kunci layar; perlakukan sebagai "tidak ada".
    return null;
  }
}

export async function hapusToken() {
  try {
    await SecureStore.deleteItemAsync(KUNCI_TOKEN);
  } catch {
    // Tidak ada yang bisa dilakukan; sesi di memori tetap dihapus oleh pemanggil.
  }
}
