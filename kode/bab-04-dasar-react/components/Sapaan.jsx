import { Text } from 'react-native';

/**
 * Komponen terkecil di buku ini: satu fungsi yang mengembalikan JSX.
 *
 * Slide bab 4 menulis contohnya dengan `<p>` karena React lahir di web. Di React
 * Native tidak ada `<p>`; padanannya `Text`. Pemetaan lengkapnya ada di README.
 *
 * `nama` dan `prodi` punya nilai default, jadi `<Sapaan />` tetap sah.
 */
export function Sapaan({ nama = 'Mahasiswa', prodi = 'Sistem Informasi' }) {
  // Di dalam komponen boleh ada JavaScript biasa: perhitungan, variabel, percabangan.
  const jam = new Date().getHours();
  const waktu = jam < 11 ? 'pagi' : jam < 15 ? 'siang' : jam < 19 ? 'sore' : 'malam';

  return (
    <Text style={{ color: '#e2e8f0', fontSize: 13 }}>
      Selamat {waktu}, {nama} ({prodi}).
    </Text>
  );
}
