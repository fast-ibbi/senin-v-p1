import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook pemuat data: satu pola untuk semua layar yang memanggil API.
 *
 * Mengembalikan empat hal yang selalu dibutuhkan layar:
 *   data       → hasil terakhir (null sebelum ada)
 *   memuat     → true selama permintaan berjalan
 *   galat      → objek { kode, pesan } atau null
 *   muatUlang  → fungsi untuk mencoba lagi
 *
 * Tiga jebakan yang ditangani di sini, dan alasan hook ini ada:
 *
 * 1. **Layar dibongkar sebelum jawaban tiba.** `AbortController` membatalkan
 *    permintaan; tanpa itu React memperingatkan "state update on unmounted component".
 * 2. **Jawaban lama menimpa jawaban baru.** Penanda `terakhir` memastikan hanya
 *    permintaan terbaru yang boleh menulis state.
 * 3. **`memuat` tidak pernah kembali false.** Blok `finally` menjamin nilainya
 *    direset, termasuk saat request gagal.
 */
export function useMuat(pemuat, dependencies = []) {
  const [data, setData] = useState(null);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState(null);

  const terakhir = useRef(0);
  const hidup = useRef(true);

  useEffect(() => {
    hidup.current = true;
    return () => {
      hidup.current = false;
    };
  }, []);

  const jalankan = useCallback(async () => {
    const nomor = ++terakhir.current;
    const pengendali = new AbortController();
    setMemuat(true);
    setGalat(null);

    try {
      const hasil = await pemuat({ sinyal: pengendali.signal });
      if (!hidup.current || nomor !== terakhir.current) return;
      setData(hasil);
    } catch (err) {
      if (!hidup.current || nomor !== terakhir.current) return;
      // Kunjungan ulang setelah abort bukan kegagalan yang perlu ditampilkan.
      if (err.kode === 'BATAS_WAKTU' || err.name === 'AbortError' || err.kode === 'JARINGAN') {
        setGalat({ kode: err.kode ?? 'JARINGAN', pesan: err.message });
      } else {
        setGalat({ kode: err.kode ?? 'GALAT', pesan: err.message });
      }
    } finally {
      if (hidup.current && nomor === terakhir.current) setMemuat(false);
    }

    return () => pengendali.abort();
  }, dependencies);

  useEffect(() => {
    jalankan();
  }, [jalankan]);

  return { data, memuat, galat, muatUlang: jalankan };
}
