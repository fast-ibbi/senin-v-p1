/**
 * Design token — satu tempat untuk semua angka dan warna.
 *
 * Tujuannya bukan keindahan, melainkan kecepatan memutuskan: tim tidak lagi
 * berdebat "16 atau 17 piksel?". Semua nilai di bawah berasal dari sistem 8pt,
 * jadi 4, 8, 16, dan 32 selalu segaris.
 */

/** Jarak. 4 dipakai untuk hal sangat rapat, 64 untuk pemisah antar blok besar. */
export const spasi = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  jumbo: 64,
};

/** Skala tipografi: ukuran, tinggi baris, dan bobot yang berpasangan. */
export const teks = {
  judulBesar: { fontSize: 26, lineHeight: 32, fontWeight: '700' },
  judul: { fontSize: 20, lineHeight: 26, fontWeight: '700' },
  subjudul: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  isi: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  kecil: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  mikro: { fontSize: 11, lineHeight: 14, fontWeight: '600', letterSpacing: 0.4 },
};

/** Palet. Nama peran, bukan nama warna, supaya tema bisa diganti tanpa mengubah layar. */
export const warna = {
  latar: '#0f172a',
  permukaan: '#1e293b',
  permukaanTinggi: '#334155',
  garis: '#334155',
  utama: '#0ea5e9',
  utamaDitekan: '#0284c7',
  utamaRedup: '#7dd3fc',
  sukses: '#34d399',
  peringatan: '#fbbf24',
  bahaya: '#f87171',
  teks: '#f8fafc',
  teksRedup: '#94a3b8',
  teksMati: '#64748b',
};

/** Sudut membulat: 8–12 untuk kartu, 999 untuk bentuk pil. */
export const radius = { sm: 6, md: 10, lg: 14, pil: 999 };

/** Bayangan yang benar di dua platform. */
export const bayangan = {
  elevation: 2,
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
};
