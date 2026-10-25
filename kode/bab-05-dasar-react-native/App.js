import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { BarisJadwal } from './components/BarisJadwal.js';
import { mahasiswa } from './data/mahasiswa.js';
import { matakuliah } from './data/matakuliah.js';
import { filterSemester, totalSks, urutkanJadwal } from './utils/akademik.js';

/**
 * Bab 5 — komponen inti React Native.
 *
 * Yang diperagakan:
 *   - komponen inti: View, Text, Image, Pressable, FlatList
 *   - StyleSheet di luar komponen; array style untuk variasi bersyarat
 *   - Flexbox lewat `flex`, `flexDirection`, `gap`, `alignItems`
 *   - `useWindowDimensions` untuk berubah dari 1 kolom ke 2 kolom
 *   - `FlatList` (bukan `ScrollView`) karena daftarnya panjang dan homogen
 *   - `Platform.OS` untuk jarak yang berbeda di Android
 */

const JADWAL = urutkanJadwal(filterSemester(matakuliah, 5));

export default function App() {
  const { width } = useWindowDimensions();

  // Lebar ≥ 600 dipakai tablet/web: dua kolom. Selain itu satu kolom.
  const kolom = width >= 600 ? 2 : 1;
  const padat = width < 360;

  return (
    <View style={styles.layar}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('./assets/icon.png')} style={styles.logo} />
        <View style={styles.headerTeks}>
          <Text style={styles.headerJudul}>Jadwal Semester 5</Text>
          <Text style={styles.headerMeta}>
            {mahasiswa.nama} · {mahasiswa.nim}
          </Text>
        </View>
        <View style={styles.lencana}>
          <Text style={styles.lencanaAngka}>{JADWAL.length}</Text>
          <Text style={styles.lencanaLabel}>MK</Text>
        </View>
      </View>

      {/* FlatList: hanya baris yang terlihat yang dirender. */}
      <FlatList
        data={JADWAL}
        keyExtractor={(mk) => mk.kode}
        renderItem={({ item }) => <BarisJadwal mk={item} padat={padat} />}
        numColumns={kolom}
        // `key` berubah saat jumlah kolom berubah: FlatList wajib dibuat ulang.
        key={kolom}
        columnWrapperStyle={kolom > 1 ? styles.barisDuaKolom : undefined}
        contentContainerStyle={styles.isiDaftar}
        ListHeaderComponent={
          <View style={styles.ringkasan}>
            <Text style={styles.ringkasanTeks}>
              {totalSks(JADWAL)} SKS · lebar layar {Math.round(width)} dp · {kolom} kolom ·
              padding {Platform.OS === 'android' ? 12 : 16}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.kosong}>Tidak ada jadwal pada semester ini.</Text>
        }
        ListFooterComponent={
          <Pressable
            style={({ pressed }) => [styles.tombol, pressed && styles.tombolDitekan]}
            onPress={() => console.log('[bab-05] tombol lihat KRS ditekan')}
          >
            <Text style={styles.tombolTeks}>Lihat KRS</Text>
          </Pressable>
        }
      />

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  layar: {
    flex: 1,
    backgroundColor: '#0f172a',
    // Padding tepi berbeda per platform: di Android layar lebih sempit karena
    // tombol navigasi sistem, jadi tepinya dibuat lebih kecil.
    paddingTop: Platform.select({ android: 32, ios: 56, default: 24 }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  logo: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#1e293b' },
  headerTeks: { flex: 1 },
  headerJudul: { color: '#f8fafc', fontSize: 18, fontWeight: '700' },
  headerMeta: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  lencana: {
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  lencanaAngka: { color: '#7dd3fc', fontSize: 16, fontWeight: '700' },
  lencanaLabel: { color: '#64748b', fontSize: 10 },
  isiDaftar: { paddingHorizontal: 16, paddingBottom: 32 },
  barisDuaKolom: { gap: 12 },
  ringkasan: { paddingBottom: 10 },
  ringkasanTeks: { color: '#475569', fontSize: 11, lineHeight: 16 },
  kosong: { color: '#64748b', fontSize: 12, textAlign: 'center', padding: 24 },
  tombol: {
    marginTop: 12,
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tombolDitekan: { backgroundColor: '#0284c7' },
  tombolTeks: { color: '#f8fafc', fontSize: 14, fontWeight: '600' },
});
