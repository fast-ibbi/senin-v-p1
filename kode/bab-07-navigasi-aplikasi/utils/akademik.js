/**
 * Fungsi-fungsi akademik murni.
 *
 * Semua fungsi di sini: menerima argumen, mengembalikan nilai, tidak menyentuh
 * variabel di luar dirinya. Tidak ada `console.log`, tidak ada state.
 * Sifat itu yang membuatnya mudah diuji — dan di bab 14 fungsi-fungsi inilah
 * yang diuji dengan `node --test`.
 */

/** Bobot mutu tiap huruf, dipakai untuk menghitung IPK. */
export const BOBOT_MUTU = {
  A: 4,
  'A-': 3.7,
  'B+': 3.3,
  B: 3,
  'B-': 2.7,
  'C+': 2.3,
  C: 2,
  D: 1,
  E: 0,
};

/** "SI501 · Pemrograman Mobile · 3 SKS" — satu baris ringkas untuk daftar. */
export const ringkas = ({ kode, nama, sks }) => `${kode} · ${nama} · ${sks} SKS`;

/**
 * Jumlah SKS dari sekumpulan mata kuliah.
 * Perhatikan nilai awal `0` pada reduce: tanpa itu, array kosong melempar TypeError.
 */
export const totalSks = (daftar) => daftar.reduce((jumlah, mk) => jumlah + mk.sks, 0);

/** Menyaring mata kuliah milik satu semester tanpa mengubah array aslinya. */
export const filterSemester = (daftar, semester) =>
  daftar.filter((mk) => mk.semester === semester);

/** Mencari satu mata kuliah; `undefined` bila tidak ada. */
export const cariMatakuliah = (daftar, kode) => daftar.find((mk) => mk.kode === kode);

/** Mengelompokkan mata kuliah menjadi { 3: [...], 5: [...] }. */
export const kelompokkanPerSemester = (daftar) =>
  daftar.reduce((kelompok, mk) => {
    const kunci = mk.semester;
    kelompok[kunci] = [...(kelompok[kunci] ?? []), mk];
    return kelompok;
  }, {});

/**
 * IPK = Σ(sks × bobot) / Σ(sks).
 * Dibulatkan dua desimal supaya cocok dengan tampilan KHS.
 */
export const hitungIpk = (daftarNilai) => {
  const { mutu, sks } = daftarNilai.reduce(
    (akumulasi, baris) => ({
      mutu: akumulasi.mutu + baris.sks * (BOBOT_MUTU[baris.nilaiHuruf] ?? 0),
      sks: akumulasi.sks + baris.sks,
    }),
    { mutu: 0, sks: 0 },
  );

  return sks === 0 ? 0 : Number((mutu / sks).toFixed(2));
};

/** Percabangan berantai: satu-satunya tempat aturan predikat ditulis. */
export const tentukanPredikat = (ipk) => {
  if (ipk >= 3.5) return 'Dengan Pujian';
  if (ipk >= 3.0) return 'Sangat Memuaskan';
  if (ipk >= 2.5) return 'Memuaskan';
  if (ipk >= 2.0) return 'Cukup';
  return 'Perlu Perbaikan';
};

/**
 * Jadwal urut hari lalu jam.
 * `[...daftar]` penting: `sort` mengubah array di tempat, dan data sumber tidak
 * boleh ikut berubah hanya karena layar ingin urutan lain.
 */
export const urutkanJadwal = (daftar) => {
  const urutanHari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return [...daftar].sort(
    (a, b) =>
      urutanHari.indexOf(a.hari) - urutanHari.indexOf(b.hari) || a.jam.localeCompare(b.jam),
  );
};

/** Sisa kuota satu mata kuliah; tidak pernah negatif. */
export const sisaKuota = ({ kuota, terisi }) => Math.max(0, kuota - terisi);

/** Menghitung total SKS hanya untuk baris yang tidak dibatalkan. */
export const totalSksAktif = (daftarKrs) =>
  daftarKrs.filter((baris) => baris.status !== 'dibatalkan').reduce((jumlah, baris) => jumlah + baris.sks, 0);
