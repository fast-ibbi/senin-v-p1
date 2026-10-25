import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { mahasiswa } from '../../../data/mahasiswa.js';
import { matakuliah } from '../../../data/matakuliah.js';
import { filterSemester, sisaKuota, totalSks, urutkanJadwal } from '../../../utils/akademik.js';
import { spasi, teks, warna } from '../../../tema/desain.js';

/**
 * Layar jadwal di dalam stack tab Beranda.
 *
 * Ini rute statis (`/beranda/jadwal`). Setiap baris menautkan rute dinamis
 * `/beranda/matakuliah/[kode]` lewat `<Link>` — alamatnya disusun sebagai string
 * biasa, dan nilai `[kode]` diganti kode mata kuliah.
 */
const JADWAL = urutkanJadwal(filterSemester(matakuliah, mahasiswa.semester));

export default function Jadwal() {
  return (
    <View style={styles.layar}>
      <FlatList
        data={JADWAL}
        keyExtractor={(mk) => mk.kode}
        contentContainerStyle={styles.isi}
        ListHeaderComponent={
          <Text style={styles.ringkasan}>
            {JADWAL.length} mata kuliah · {totalSks(JADWAL)} SKS · semester {mahasiswa.semester}
          </Text>
        }
        ListEmptyComponent={<Text style={styles.kosong}>Tidak ada jadwal.</Text>}
        renderItem={({ item }) => (
          <Link href={`/(tabs)/beranda/matakuliah/${item.kode}`} asChild>
            <View style={styles.baris}>
              <View style={styles.kolomHari}>
                <Text style={styles.hari}>{item.hari}</Text>
                <Text style={styles.jam}>{item.jam}</Text>
              </View>
              <View style={styles.kolomInfo}>
                <Text style={styles.nama}>{item.nama}</Text>
                <Text style={styles.meta}>
                  {item.ruang} · {sisaKuota(item)} kursi tersisa
                </Text>
              </View>
              <Text style={styles.panah}>›</Text>
            </View>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: spasi.lg, paddingBottom: spasi.xxxl, gap: spasi.sm },
  ringkasan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', marginBottom: spasi.sm },
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spasi.md,
    backgroundColor: warna.permukaan,
    borderRadius: 10,
    padding: spasi.md,
  },
  kolomHari: { width: 76, gap: 2 },
  hari: { color: warna.utamaRedup, ...teks.kecil, fontWeight: '700' },
  jam: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
  kolomInfo: { flex: 1, gap: 2 },
  nama: { color: warna.teks, ...teks.isi, fontWeight: '600' },
  meta: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
  panah: { color: warna.teksMati, fontSize: 20 },
  kosong: { color: warna.teksMati, ...teks.isi, textAlign: 'center', padding: spasi.xl },
});
