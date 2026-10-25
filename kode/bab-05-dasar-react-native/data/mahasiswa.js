/**
 * Profil mahasiswa dan nilai contoh untuk bab 3 sampai bab 12.
 *
 * Sama dengan seed backend (`kode/_backend/shared/data/db.seed.json`) untuk
 * mahasiswa NIM 20230001. Nilai IPK-nya 3,7 — angka ini dipakai di beberapa
 * latihan, jadi jangan diubah tanpa mengubah latihannya juga.
 */
export const mahasiswa = {
  nim: '20230001',
  nama: 'Nadia Putri Ramadhani',
  email: 'nadia.putri@student.ibbi.ac.id',
  prodi: 'Sistem Informasi',
  angkatan: 2023,
  semester: 5,
  kelas: 'SI-5A',
  telepon: '0812-3456-7801',
  alamat: 'Jl. Sutomo No. 12, Medan',
};

export const nilai = [
  { kode: 'SI301', nama: 'Struktur Data', semester: 3, sks: 3, nilaiHuruf: 'A' },
  { kode: 'SI302', nama: 'Pemrograman Web', semester: 3, sks: 3, nilaiHuruf: 'A-' },
  { kode: 'SI303', nama: 'Jaringan Komputer', semester: 3, sks: 3, nilaiHuruf: 'B+' },
  { kode: 'SI304', nama: 'Statistika', semester: 3, sks: 2, nilaiHuruf: 'A' },
  { kode: 'SI305', nama: 'Sistem Operasi', semester: 3, sks: 3, nilaiHuruf: 'B' },
  { kode: 'SI306', nama: 'Algoritma', semester: 3, sks: 3, nilaiHuruf: 'A' },
  { kode: 'SI401', nama: 'Basis Data', semester: 4, sks: 3, nilaiHuruf: 'A' },
  { kode: 'SI402', nama: 'Interaksi Manusia Komputer', semester: 4, sks: 2, nilaiHuruf: 'A-' },
];
