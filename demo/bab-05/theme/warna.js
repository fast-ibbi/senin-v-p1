// Konstanta tampilan — dipakai bersama seluruh layar demo.
// Rujukan slide: Bagian 3, subbab 3.4 ("warna dan ukuran disimpan sebagai konstanta").
//
// Semua layar mengimpor dari sini supaya satu perubahan desain cukup disunting sekali.

export const WARNA = {
  latar: '#f1f5f9',
  permukaan: '#ffffff',
  garis: '#dbe3ec',

  tinta: '#0f172a',
  tintaRedup: '#5a6b85',

  utama: '#1d4ed8',
  utamaMuda: '#e4ecfe',

  sukses: '#15803d',
  suksesMuda: '#dcfce7',

  peringatan: '#b45309',
  peringatanMuda: '#fef3c7',

  bahaya: '#b91c1c',
  bahayaMuda: '#fee2e2',
};

export const JARAK = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 18,
  bulat: 999,
};

export const TEKS = {
  judulLayar: 20,
  judul: 17,
  isi: 14,
  kecil: 12,
  mungil: 11,
};

// Satu-satunya breakpoint demo: dipakai layar 4 dan layar 6.
// Rujukan slide: Bagian 4, subbab 4.9 ("ambang seperti 600 dipakai untuk memilih susunan").
export const BREAKPOINT_LEBAR = 600;
