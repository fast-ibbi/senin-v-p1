// Data produk katalog — satu sumber untuk seluruh layar demo.
// Rujukan slide: Bagian 2 (komponen daftar) dan Bagian 5 (Praktikum 5: daftar produk).
//
// Tujuh produk memakai gambar yang di-bundle (require) supaya demo tetap jalan tanpa
// internet; satu produk memakai URL untuk memperlihatkan perbedaan `require` vs `uri`
// (rujukan: Bagian 2, subbab 2.3).

export const DAFTAR_PRODUK = [
  {
    id: '1',
    nama: 'Laptop Prakom 14 inci',
    kategori: 'Laptop',
    harga: 8750000,
    stok: 12,
    gambar: require('../assets/produk/laptop.png'),
  },
  {
    id: '2',
    nama: 'Tablet Belajar 10 inci',
    kategori: 'Tablet',
    harga: 3450000,
    stok: 0, // habis — memicu gaya kondisional di layar 3 dan 6
    gambar: require('../assets/produk/tablet.png'),
  },
  {
    id: '3',
    nama: 'Headphone Kampus',
    kategori: 'Audio',
    harga: 725000,
    stok: 34,
    gambar: require('../assets/produk/headphone.png'),
  },
  {
    id: '4',
    nama: 'Smartwatch Mahasiswa',
    kategori: 'Wearable',
    harga: 1290000,
    stok: 4, // stok menipis — memicu gaya kondisional
    gambar: require('../assets/produk/smartwatch.png'),
  },
  {
    id: '5',
    nama: 'Keyboard Mekanik Ringkas',
    kategori: 'Aksesori',
    harga: 640000,
    stok: 21,
    gambar: require('../assets/produk/keyboard.png'),
  },
  {
    id: '6',
    nama: 'Mouse Nirkabel',
    kategori: 'Aksesori',
    harga: 185000,
    stok: 60,
    gambar: require('../assets/produk/mouse.png'),
  },
  {
    id: '7',
    nama: 'Monitor 24 inci',
    kategori: 'Display',
    harga: 2150000,
    stok: 3, // stok menipis
    gambar: require('../assets/produk/monitor.png'),
  },
  {
    id: '8',
    nama: 'Kamera Web Kuliah',
    kategori: 'Aksesori',
    harga: 415000,
    stok: 9,
    // Satu-satunya gambar dari URL: butuh internet. Kalau jaringan mati,
    // gambarnya kosong — itulah alasan gambar katalog sebaiknya di-bundle.
    gambarUri: 'https://reactnative.dev/img/tiny_logo.png',
  },
];

// Status stok diturunkan dari data, bukan disimpan terpisah.
// Rujukan slide: Bagian 3, subbab 3.3 ("gaya mengikuti props atau state").
export function statusStok(produk) {
  if (produk.stok === 0) return { label: 'Stok habis', jenis: 'habis' };
  if (produk.stok <= 5) return { label: 'Stok menipis', jenis: 'menipis' };
  return { label: 'Tersedia', jenis: 'tersedia' };
}

// Format rupiah tanpa Intl, supaya hasilnya sama di semua platform dan aman di web.
export function formatRupiah(angka) {
  const digit = String(Math.round(angka)).split('').reverse();
  const kelompok = [];
  for (let i = 0; i < digit.length; i += 3) {
    kelompok.push(digit.slice(i, i + 3).reverse().join(''));
  }
  return 'Rp ' + kelompok.reverse().join('.');
}

// Daftar panjang khusus layar 5, supaya virtualisasi FlatList terlihat.
// Sengaja dibuat di sini dan hanya dipakai satu layar.
export function buatDaftarPanjang(jumlah = 500) {
  return Array.from({ length: jumlah }, (_, i) => {
    const dasar = DAFTAR_PRODUK[i % DAFTAR_PRODUK.length];
    return {
      id: 'panjang-' + (i + 1),
      nama: dasar.nama + ' #' + (i + 1),
      kategori: dasar.kategori,
      harga: dasar.harga,
      stok: dasar.stok,
      gambar: dasar.gambar,
    };
  });
}
