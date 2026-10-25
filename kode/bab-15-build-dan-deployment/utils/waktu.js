/**
 * "3 menit lalu" — lebih jujur daripada jam, karena pengguna tidak menghitung.
 *
 * Berkas ini sengaja terpisah dari `cache.js`. Bedanya penting untuk pengujian:
 * `cache.js` mengimpor AsyncStorage (modul native), sehingga tidak bisa dimuat
 * `node --test`. Fungsi murni seperti ini bisa diuji tanpa perangkat, tanpa
 * emulator, dan tanpa React.
 */
export function umurTerbaca(umurMs) {
  if (!Number.isFinite(umurMs) || umurMs < 0) return 'baru saja';
  const menit = Math.floor(umurMs / 60000);
  if (menit < 1) return 'baru saja';
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  return `${Math.floor(jam / 24)} hari lalu`;
}
