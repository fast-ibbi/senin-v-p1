import { StyleSheet, Text, View } from 'react-native';

import { RADIUS, TEKS, WARNA } from '../theme/warna';

// Label status/predikat.
//
// Rujukan slide Bab 5, subbab 3.3: warna dipilih lewat gaya kondisional dari
// `jenis` yang diberikan induk — bukan disimpan sebagai state berisi gaya.
// Perhatikan bahwa semua variasi warna didefinisikan sekali di StyleSheet,
// lalu dipilih saat render.
//
// `jenis`: 'baik' | 'sedang' | 'kurang' | 'netral'
export default function LabelStatus({ label, jenis = 'netral' }) {
  return (
    <View style={[styles.dasar, GAYA_LATAR[jenis]]}>
      <Text style={[styles.teks, GAYA_TEKS[jenis]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dasar: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.bulat,
  },
  teks: {
    fontSize: TEKS.mungil,
    fontWeight: '700',
  },
});

const GAYA_LATAR = StyleSheet.create({
  baik: { backgroundColor: WARNA.suksesMuda },
  sedang: { backgroundColor: WARNA.peringatanMuda },
  kurang: { backgroundColor: WARNA.bahayaMuda },
  netral: { backgroundColor: WARNA.netralMuda },
});

const GAYA_TEKS = StyleSheet.create({
  baik: { color: WARNA.sukses },
  sedang: { color: WARNA.peringatan },
  kurang: { color: WARNA.bahaya },
  netral: { color: WARNA.netral },
});
