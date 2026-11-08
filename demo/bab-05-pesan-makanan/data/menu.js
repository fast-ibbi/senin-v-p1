// data/menu.js — dua belas masakan dari empat warung.
//
// Perhatikan `gambar`: memakai `require()` karena berkasnya ada di dalam project
// (Bab 5 subbab 2.3). Kalau memakai `{ uri: 'https://…' }`, lebar dan tinggi
// WAJIB ditulis eksplisit, kalau tidak kartu akan melompat saat gambar selesai
// dimuat.

export const menu = [
  {
    id: 'm01',
    nama: 'Nasi Ayam Geprek',
    warung: 'Dapur Bu Tini',
    kategori: 'Makanan',
    harga: 15000,
    gambar: require('../assets/produk/m01.jpg'),
  },
  {
    id: 'm02',
    nama: 'Nasi Rendang Padang',
    warung: 'Dapur Bu Tini',
    kategori: 'Makanan',
    harga: 22000,
    gambar: require('../assets/produk/m02.jpg'),
  },
  {
    id: 'm03',
    nama: 'Mie Ayam Bakso',
    warung: 'Dapur Bu Tini',
    kategori: 'Makanan',
    harga: 13000,
    gambar: require('../assets/produk/m03.jpg'),
  },
  {
    id: 'm04',
    nama: 'Soto Bandung',
    warung: 'Warung Sunda Ibu Euis',
    kategori: 'Makanan',
    harga: 17000,
    gambar: require('../assets/produk/m04.jpg'),
  },
  {
    id: 'm05',
    nama: 'Lotek Bandung',
    warung: 'Warung Sunda Ibu Euis',
    kategori: 'Makanan',
    harga: 14000,
    gambar: require('../assets/produk/m05.jpg'),
  },
  {
    id: 'm06',
    nama: 'Nasi Timbel Komplit',
    warung: 'Warung Sunda Ibu Euis',
    kategori: 'Paket',
    harga: 25000,
    gambar: require('../assets/produk/m06.jpg'),
  },
  {
    id: 'm07',
    nama: 'Paket Geprek + Es Teh',
    warung: 'Dapur Bu Tini',
    kategori: 'Paket',
    harga: 19000,
    gambar: require('../assets/produk/m07.jpg'),
  },
  {
    id: 'm08',
    nama: 'Es Kopi Susu Gula Aren',
    warung: 'Kedai Kopi Senja',
    kategori: 'Minuman',
    harga: 18000,
    gambar: require('../assets/produk/m08.jpg'),
  },
  {
    id: 'm09',
    nama: 'Es Teh Manis',
    warung: 'Kedai Kopi Senja',
    kategori: 'Minuman',
    harga: 6000,
    gambar: require('../assets/produk/m09.jpg'),
  },
  {
    id: 'm10',
    nama: 'Jus Alpukat',
    warung: 'Kedai Kopi Senja',
    kategori: 'Minuman',
    harga: 15000,
    gambar: require('../assets/produk/m10.jpg'),
  },
  {
    id: 'm11',
    nama: 'Pisang Goreng Keju',
    warung: 'Gorengan Pak Slamet',
    kategori: 'Camilan',
    harga: 10000,
    gambar: require('../assets/produk/m11.jpg'),
  },
  {
    id: 'm12',
    nama: 'Cireng Bumbu Rujak',
    warung: 'Gorengan Pak Slamet',
    kategori: 'Camilan',
    harga: 8000,
    gambar: require('../assets/produk/m12.jpg'),
  },
];

// "Semua" selalu ada supaya pengguna bisa membatalkan pilihan kategori.
export const daftarKategori = ['Semua', 'Makanan', 'Paket', 'Minuman', 'Camilan'];

// Ongkir tetap. Di aplikasi sungguhan ini dihitung dari jarak — di sini cukup
// satu angka supaya baris "ongkir" pada ringkasan punya isi.
export const ONGKIR = 8000;
