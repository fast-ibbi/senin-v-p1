import { Platform, StyleSheet, Text, View } from 'react-native';

import { sisaKuota } from '../utils/akademik.js';

/**
 * Satu baris jadwal — dipakai sebagai baris `FlatList` di bab 5.
 *
 * Tiga hal yang diperagakan:
 *   1. StyleSheet sebagai objek gaya di luar komponen (dibuat sekali).
 *   2. Array style: `[styles.baris, penuh && styles.barisPenuh]`.
 *   3. Platform.select untuk perbedaan nyata antara Android dan iOS.
 */
export function BarisJadwal({ mk, padat = false }) {
  const penuh = sisaKuota(mk) === 0;

  return (
    <View style={[styles.baris, padat && styles.barisPadat, penuh && styles.barisPenuh]}>
      <View style={styles.kiri}>
        <Text style={styles.nama}>{mk.nama}</Text>
        <Text style={styles.meta}>
          {mk.kode} · {mk.sks} SKS · {mk.ruang}
        </Text>
      </View>

      <View style={styles.kanan}>
        <Text style={styles.jam}>{mk.jam}</Text>
        <Text style={[styles.kuota, penuh && styles.kuotaPenuh]}>
          {penuh ? 'Kuota penuh' : `Sisa ${sisaKuota(mk)}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    // Bayangan: nama propertinya memang berbeda di dua platform.
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      default: {},
    }),
  },
  // Baris yang kuotanya penuh tampil lebih rapat dan lebih redup.
  barisPenuh: { opacity: 0.6 },
  barisPadat: { paddingVertical: 8, paddingHorizontal: 12 },
  kiri: { flex: 1, paddingRight: 12 },
  nama: { color: '#e2e8f0', fontSize: 14, fontWeight: '600' },
  meta: { color: '#64748b', fontSize: 11, marginTop: 2 },
  kanan: { alignItems: 'flex-end' },
  jam: { color: '#7dd3fc', fontSize: 12, fontWeight: '600' },
  kuota: { color: '#94a3b8', fontSize: 11, marginTop: 4 },
  kuotaPenuh: { color: '#f87171' },
});
