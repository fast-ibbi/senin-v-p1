// theme/warna.js — satu tempat untuk warna, jarak, radius, huruf, dan breakpoint.
// Bab 5 subbab 3.2: kalau sebuah angka dipakai di dua layar, angkat ke sini.
export const warna = {
  latar: '#fff8f1', // krem hangat, bukan putih — aplikasi makan butuh suasana hangat
  permukaan: '#ffffff',
  teks: '#241a12',
  teksRedup: '#7a6a5c',
  utama: '#e2650d', // oranye, warna utama aplikasi pesan-antar
  utamaMuda: '#ffe6cf',
  utamaTua: '#a84708',
  sukses: '#1c7a4a',
  suksesMuda: '#dcf5e7',
  bahaya: '#b42318',
  garis: '#f2e2d2',
};

export const jarak = { kecil: 8, sedang: 16, besar: 24 };
export const radius = { kecil: 8, sedang: 12, besar: 20, bulat: 999 };

export const huruf = { kecil: 12, isi: 14, judul: 18, besar: 26 };

// Dua breakpoint, bukan satu: di bawah 700 kartu mendatar (satu kolom),
// 700–1099 dua kolom, 1100 ke atas tiga kolom. Lihat screens/KatalogScreen.js.
export const breakpoint = { duaKolom: 700, tigaKolom: 1100 };
