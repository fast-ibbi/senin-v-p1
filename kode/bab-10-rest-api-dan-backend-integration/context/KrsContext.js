import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { sisaKuota, totalSksAktif } from '../utils/akademik.js';

/**
 * Keranjang KRS — state global pertama di aplikasi ini.
 *
 * Mengapa Context, bukan props berantai?
 * Tab KRS dan tab Beranda sama-sama butuh jumlah SKS terpilih. Kalau state
 * ditaruh di tab KRS, Beranda harus menerimanya lewat props — padahal Beranda
 * bukan anak dari KRS. Context memotong rantai itu.
 *
 * Yang disimpan hanya **pilihan** (kode, sks, kelas). Data mata kuliah tetap
 * tinggal di `data/matakuliah.js`; menyimpan objek lengkap di keranjang berarti
 * dua salinan data yang bisa berbeda.
 */
const KrsContext = createContext(null);

export const BATAS_SKS = 24;

export function KrsProvider({ children }) {
  const [pilihan, setPilihan] = useState([]);

  const sudahDipilih = useCallback(
    (kode) => pilihan.some((baris) => baris.kode === kode),
    [pilihan],
  );

  /**
   * Menambah satu mata kuliah.
   * Mengembalikan { ok, pesan } — bukan melempar error — supaya layar bisa
   * menampilkan pesan tanpa try/catch untuk aturan bisnis biasa.
   */
  const tambah = useCallback(
    (mk) => {
      const sekarang = pilihan;

      if (sekarang.some((baris) => baris.kode === mk.kode)) {
        return { ok: false, pesan: `${mk.nama} sudah ada di KRS.` };
      }
      if (sisaKuota(mk) === 0) {
        return { ok: false, pesan: `Kuota ${mk.nama} sudah penuh.` };
      }

      const totalSekarang = totalSksAktif(sekarang);
      if (totalSekarang + mk.sks > BATAS_SKS) {
        return {
          ok: false,
          pesan: `Batas ${BATAS_SKS} SKS terlampaui. Sisa ${BATAS_SKS - totalSekarang} SKS.`,
        };
      }

      // State baru, bukan perubahan pada array lama.
      setPilihan([...sekarang, { kode: mk.kode, sks: mk.sks, kelas: 'A', status: 'terdaftar' }]);
      return { ok: true, pesan: `${mk.nama} ditambahkan.` };
    },
    [pilihan],
  );

  const hapus = useCallback((kode) => {
    setPilihan((lama) => lama.filter((baris) => baris.kode !== kode));
  }, []);

  const ubahKelas = useCallback((kode, kelas) => {
    setPilihan((lama) =>
      lama.map((baris) => (baris.kode === kode ? { ...baris, kelas } : baris)),
    );
  }, []);

  const bersihkan = useCallback(() => setPilihan([]), []);

  const nilai = useMemo(() => {
    const totalSks = totalSksAktif(pilihan);
    return {
      pilihan,
      jumlahMk: pilihan.length,
      totalSks,
      sisaSks: BATAS_SKS - totalSks,
      penuh: totalSks >= BATAS_SKS,
      sudahDipilih,
      tambah,
      hapus,
      ubahKelas,
      bersihkan,
    };
  }, [pilihan, sudahDipilih, tambah, hapus, ubahKelas, bersihkan]);

  return <KrsContext.Provider value={nilai}>{children}</KrsContext.Provider>;
}

/** Nama context tidak perlu diketahui komponen; cukup panggil useKrs(). */
export function useKrs() {
  const konteks = useContext(KrsContext);
  if (konteks === null) {
    throw new Error('useKrs harus dipakai di dalam <KrsProvider>.');
  }
  return konteks;
}
