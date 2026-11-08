// Sumber data statis aplikasi — sengaja di luar komponen.
//
// Rujukan slide Bab 5: subbab 2.10 (data dikirim ke komponen lewat props) dan
// subbab 3.4 (nilai yang dipakai berulang disimpan di satu tempat).
//
// Semua nilai turunan (predikat, rata-rata IPK, sebaran prodi) dihitung dengan
// fungsi di bawah, bukan disimpan sebagai state. State hanya untuk hal yang
// berubah karena interaksi pengguna.

export const DAFTAR_MAHASISWA = [
  {
    id: '1',
    nama: 'Budi Santoso',
    nim: '22101001',
    prodi: 'Sistem Informasi',
    angkatan: 2022,
    ipk: 3.62,
    sksLulus: 118,
    status: 'Aktif',
    pembimbing: 'Dr. Ratna Kusuma',
    // Foto dari jaringan: `source` menerima objek { uri }. Kalau gagal dimuat,
    // AvatarPlaceholder jatuh ke inisial (lihat components/AvatarPlaceholder.js).
    fotoUri: 'https://i.pravatar.cc/160?img=12',
  },
  {
    id: '2',
    nama: 'Siti Aminah',
    nim: '22101002',
    prodi: 'Informatika',
    angkatan: 2022,
    ipk: 3.18,
    sksLulus: 112,
    status: 'Aktif',
    pembimbing: 'Ir. Hendra Wijaya',
    fotoUri: null,
  },
  {
    id: '3',
    nama: 'Rizky Pratama',
    nim: '22101003',
    prodi: 'Sistem Informasi',
    angkatan: 2022,
    ipk: 2.87,
    sksLulus: 104,
    status: 'Aktif',
    pembimbing: 'Dr. Ratna Kusuma',
    fotoUri: null,
  },
  {
    id: '4',
    nama: 'Dewi Lestari',
    nim: '22101004',
    prodi: 'Informatika',
    angkatan: 2022,
    ipk: 3.91,
    sksLulus: 126,
    status: 'Aktif',
    pembimbing: 'Ir. Hendra Wijaya',
    fotoUri: null,
  },
  {
    id: '5',
    nama: 'Andi Wijaya',
    nim: '22101005',
    prodi: 'Sistem Informasi',
    angkatan: 2023,
    ipk: 3.05,
    sksLulus: 78,
    status: 'Aktif',
    pembimbing: 'Dr. Ratna Kusuma',
    fotoUri: null,
  },
  {
    id: '6',
    nama: 'Nurul Hidayah',
    nim: '22101006',
    prodi: 'Informatika',
    angkatan: 2023,
    ipk: 3.44,
    sksLulus: 82,
    status: 'Aktif',
    pembimbing: 'Ir. Hendra Wijaya',
    fotoUri: null,
  },
  {
    id: '7',
    nama: 'Fajar Nugroho',
    nim: '22101007',
    prodi: 'Sistem Informasi',
    angkatan: 2023,
    ipk: 2.66,
    sksLulus: 74,
    status: 'Cuti',
    pembimbing: 'Dr. Ratna Kusuma',
    fotoUri: null,
  },
  {
    id: '8',
    nama: 'Putri Maharani',
    nim: '22101008',
    prodi: 'Informatika',
    angkatan: 2023,
    ipk: 3.77,
    sksLulus: 86,
    status: 'Aktif',
    pembimbing: 'Ir. Hendra Wijaya',
    fotoUri: null,
  },
];

export const DAFTAR_MATA_KULIAH = [
  {
    id: 'mk-1',
    kode: 'SI3101',
    nama: 'Pemrograman Mobile',
    sks: 3,
    semester: 5,
    dosen: 'Dr. Ratna Kusuma',
    kategori: 'Wajib',
    ruang: 'Lab Komputer 2',
  },
  {
    id: 'mk-2',
    kode: 'SI3102',
    nama: 'Basis Data Lanjut',
    sks: 3,
    semester: 5,
    dosen: 'Ir. Hendra Wijaya',
    kategori: 'Wajib',
    ruang: 'Ruang 2.3',
  },
  {
    id: 'mk-3',
    kode: 'SI3103',
    nama: 'Analisis Proses Bisnis',
    sks: 2,
    semester: 5,
    dosen: 'Dra. Maya Sari',
    kategori: 'Wajib',
    ruang: 'Ruang 1.1',
  },
  {
    id: 'mk-4',
    kode: 'SI3104',
    nama: 'Desain Antarmuka Pengguna',
    sks: 3,
    semester: 5,
    dosen: 'Dra. Maya Sari',
    kategori: 'Pilihan',
    ruang: 'Studio Desain',
  },
  {
    id: 'mk-5',
    kode: 'SI3105',
    nama: 'Rekayasa Perangkat Lunak',
    sks: 3,
    semester: 5,
    dosen: 'Ir. Hendra Wijaya',
    kategori: 'Wajib',
    ruang: 'Ruang 2.1',
  },
  {
    id: 'mk-6',
    kode: 'SI3106',
    nama: 'Keamanan Informasi',
    sks: 2,
    semester: 6,
    dosen: 'Dr. Bagus Prakoso',
    kategori: 'Pilihan',
    ruang: 'Ruang 3.2',
  },
  {
    id: 'mk-7',
    kode: 'SI3107',
    nama: 'Manajemen Proyek TI',
    sks: 3,
    semester: 6,
    dosen: 'Dra. Maya Sari',
    kategori: 'Wajib',
    ruang: 'Ruang 2.2',
  },
];

// ---------------------------------------------------------------------------
// Nilai turunan
// ---------------------------------------------------------------------------

// Format IPK selalu dua angka di belakang koma, termasuk saat nilainya bulat.
export function formatIPK(ipk) {
  return ipk.toFixed(2);
}

// Predikat akademik: satu fungsi, satu sumber kebenaran.
// `jenis` dipakai LabelStatus untuk memilih warna, bukan warna yang disimpan
// di dalam state (rujukan slide: subbab 3.3).
export function predikatAkademik(ipk) {
  if (ipk >= 3.5) return { jenis: 'baik', label: 'Sangat baik' };
  if (ipk >= 3.0) return { jenis: 'sedang', label: 'Baik' };
  return { jenis: 'kurang', label: 'Perlu perhatian' };
}

// Ringkasan dashboard dihitung dari daftar, bukan ditulis ulang sebagai angka
// tetap — supaya tidak ada dua sumber kebenaran.
export function hitungRingkasan(daftar) {
  const total = daftar.length;
  const rataIpk = daftar.reduce((jumlah, m) => jumlah + m.ipk, 0) / total;
  const berprestasi = daftar.filter((m) => m.ipk >= 3.5).length;
  const cuti = daftar.filter((m) => m.status === 'Cuti').length;
  return {
    total,
    rataIpk: Number(rataIpk.toFixed(2)),
    berprestasi,
    cuti,
  };
}

export function sebaranProdi(daftar) {
  const peta = daftar.reduce((hasil, m) => {
    hasil[m.prodi] = (hasil[m.prodi] ?? 0) + 1;
    return hasil;
  }, {});
  const terbanyak = Math.max(...Object.values(peta));
  return Object.entries(peta).map(([prodi, jumlah]) => ({
    prodi,
    jumlah,
    // `porsi` 0–1 dipakai untuk lebar bar di dashboard.
    porsi: jumlah / terbanyak,
  }));
}

export function peringkatIpk(daftar, jumlah = 3) {
  return [...daftar].sort((a, b) => b.ipk - a.ipk).slice(0, jumlah);
}

export function cariMahasiswa(id) {
  return DAFTAR_MAHASISWA.find((m) => m.id === id) ?? null;
}
