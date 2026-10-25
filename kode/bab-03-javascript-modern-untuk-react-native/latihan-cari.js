/**
 * Latihan 2 — `find` berdasarkan NIM.
 *
 * Jalankan:
 *   node latihan-cari.js 20230002
 *
 * Yang dilatih: menerima argumen dari `process.argv`, `find` yang mengembalikan
 * satu objek (atau `undefined`), serta menangani kasus "tidak ditemukan"
 * sebelum mencetak properti — kesalahan paling sering pemula.
 */
const daftarMahasiswa = [
  { nim: '20230001', nama: 'Nadia Putri Ramadhani', prodi: 'Sistem Informasi' },
  { nim: '20230002', nama: 'Bagas Prasetyo', prodi: 'Sistem Informasi' },
  { nim: '20240003', nama: 'Salsabila Aulia', prodi: 'Teknik Informatika' },
];

const nimDicari = process.argv[2] ?? '20230001';

const ditemukan = daftarMahasiswa.find((mhs) => mhs.nim === nimDicari);

if (ditemukan === undefined) {
  // Bukan error program: NIM yang tidak ada adalah keadaan normal.
  console.log(`Mahasiswa dengan NIM ${nimDicari} tidak ditemukan.`);
  console.log(`NIM yang tersedia: ${daftarMahasiswa.map((mhs) => mhs.nim).join(', ')}`);
  process.exit(0);
}

const { nim, nama, prodi } = ditemukan; // destructuring
console.log(`NIM     : ${nim}`);
console.log(`Nama    : ${nama}`);
console.log(`Prodi   : ${prodi}`);
