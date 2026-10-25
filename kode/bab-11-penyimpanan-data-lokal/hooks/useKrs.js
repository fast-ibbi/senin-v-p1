/**
 * Pintu masuk tunggal ke keranjang KRS.
 *
 * Berkas ini sengaja tipis. Gunanya:
 *   - komponen tidak perlu tahu nama context-nya
 *   - kalau kelak KRSContext diganti Zustand, semua layar tetap memanggil `useKrs`
 *   - pesan galat "provider belum dipasang" muncul di sini, bukan sebagai
 *     `Cannot read properties of null` di layar yang jauh dari penyebabnya
 *
 * Perhatikan: hook ini adalah *satu-satunya* tempat `useContext(KrsContext)`
 * dipanggil di seluruh aplikasi.
 */
export { useKrs, KrsProvider, BATAS_SKS } from '../context/KrsContext.js';
