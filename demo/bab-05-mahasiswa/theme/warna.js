// Token tampilan SIAKAD Mobile, dipakai bersama seluruh layar.
//
// Rujukan slide Bab 5: Bagian 3, subbab 3.4 — "warna dan ukuran disimpan sebagai
// konstanta agar konsisten". Semua layar mengimpor dari sini, jadi satu perubahan
// desain cukup disunting sekali.
//
// Tidak ada file CSS di project ini: gaya tetap ditulis sebagai objek JavaScript
// lewat StyleSheet.create() di masing-masing komponen (subbab 3.1).

export const WARNA = {
  latar: '#f1f5f9',
  permukaan: '#ffffff',
  permukaanRedup: '#e8eef6',
  garis: '#dbe3ec',

  tinta: '#0f172a',
  tintaRedup: '#5a6b85',

  utama: '#1d4ed8',
  utamaMuda: '#e4ecfe',
  utamaTua: '#173aa8',

  sukses: '#15803d',
  suksesMuda: '#dcfce7',

  peringatan: '#b45309',
  peringatanMuda: '#fef3c7',

  bahaya: '#b91c1c',
  bahayaMuda: '#fee2e2',

  netral: '#475569',
  netralMuda: '#e2e8f0',
};

export const JARAK = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 18,
  bulat: 999,
};

export const TEKS = {
  judulLayar: 22,
  judul: 17,
  isi: 14,
  kecil: 12,
  mungil: 11,
};

// Satu-satunya breakpoint project ini.
// Rujukan slide: Bagian 4, subbab 4.9 — "ambang seperti 600 dipakai untuk memilih
// susunan, bukan menamai perangkat".
export const BREAKPOINT_LEBAR = 600;
