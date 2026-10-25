import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { mahasiswa } from '../../../data/mahasiswa.js';
import { matakuliah } from '../../../data/matakuliah.js';
import { filterSemester, sisaKuota, totalSks } from '../../../utils/akademik.js';
import { spasi, teks, warna } from '../../../tema/desain.js';

/**
 * Tab KRS — masih berupa katalog yang bisa dibaca.
 *
 * Memilih dan menyimpan mata kuliah belum ada di bab ini: state bersama baru
 * dibahas di bab 9 (`context/KrsContext.js`). Yang dilatih di sini hanya dua hal:
 * tab punya alamatnya sendiri, dan tautan ke detail tetap bekerja dari dalam tab.
 */
const DITAWARKAN = filterSemester(matakuliah, mahasiswa.semester);

export default function Krs() {
  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <Text style={styles.judul}>Kartu Rencana Studi</Text>
      <Text style={styles.subjudul}>
        Semester {mahasiswa.semester} · {DITAWARKAN.length} mata kuliah ditawarkan ·{' '}
        {totalSks(DITAWARKAN)} SKS tersedia
      </Text>

      {DITAWARKAN.map((mk) => (
        <View key={mk.kode} style={styles.baris}>
          <View style={styles.info}>
            <Text style={styles.nama}>{mk.nama}</Text>
            <Text style={styles.meta}>
              {mk.kode} · {mk.sks} SKS · {mk.hari} {mk.jam}
            </Text>
          </View>
          <Text style={[styles.kursi, sisaKuota(mk) === 0 && styles.kursiHabis]}>
            {sisaKuota(mk) === 0 ? 'Penuh' : `${sisaKuota(mk)} kursi`}
          </Text>
        </View>
      ))}

      <View style={styles.kartuInfo}>
        <Text style={styles.judulInfo}>Yang datang di bab berikutnya</Text>
        <Text style={styles.isiInfo}>
          Bab 9: keranjang KRS dengan Context dan hook `useKrs`, lengkap dengan batas 24 SKS.
          Bab 10: pilihan itu dikirim ke server lewat `POST /api/krs`.
        </Text>
        <Link href="/(tabs)/beranda/jadwal" style={styles.tautan}>
          <Text style={styles.tautanTeks}>Lihat jadwal lengkap ›</Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: spasi.lg, paddingBottom: spasi.xxxl, gap: spasi.sm },
  judul: { color: warna.teks, ...teks.judul },
  subjudul: { color: warna.teksMati, ...teks.kecil, marginBottom: spasi.sm },
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spasi.md,
    backgroundColor: warna.permukaan,
    borderRadius: 10,
    padding: spasi.md,
  },
  info: { flex: 1, gap: 2 },
  nama: { color: warna.teks, ...teks.isi, fontWeight: '600' },
  meta: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
  kursi: { color: warna.teksRedup, ...teks.mikro, fontWeight: '400' },
  kursiHabis: { color: warna.bahaya },
  kartuInfo: {
    marginTop: spasi.md,
    borderWidth: 1,
    borderColor: warna.garis,
    borderRadius: 12,
    padding: spasi.lg,
    gap: spasi.sm,
  },
  judulInfo: { color: warna.utamaRedup, ...teks.mikro },
  isiInfo: { color: warna.teksRedup, ...teks.kecil, lineHeight: 20 },
  tautan: { marginTop: spasi.sm },
  tautanTeks: { color: warna.utamaRedup, ...teks.kecil },
});
