import { StyleSheet, Text, View } from 'react-native';

import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';
import LabelStatus from './LabelStatus';

// Kartu mata kuliah untuk katalog berbentuk grid.
//
// Rujukan slide Bab 5:
//   • subbab 5.2 — kartu ini adalah `renderItem` FlatList dengan `numColumns`,
//     jadi lebarnya ditentukan `flex: 1` di dalam kolom, bukan lebar tetap.
//   • subbab 3.3 — kategori "Pilihan" memakai gaya kondisional pada badge.
export default function KartuMataKuliah({ mataKuliah }) {
  const pilihan = mataKuliah.kategori === 'Pilihan';

  return (
    <View style={styles.kartu}>
      <View style={styles.kepala}>
        <Text style={styles.kode}>{mataKuliah.kode}</Text>
        <LabelStatus
          label={mataKuliah.kategori}
          jenis={pilihan ? 'sedang' : 'netral'}
        />
      </View>

      <Text style={styles.nama} numberOfLines={2}>
        {mataKuliah.nama}
      </Text>

      <View style={styles.kaki}>
        <Text style={styles.meta}>{mataKuliah.sks} SKS</Text>
        <Text style={styles.meta}>Semester {mataKuliah.semester}</Text>
      </View>

      <Text style={styles.dosen} numberOfLines={1}>
        {mataKuliah.dosen}
      </Text>
      <Text style={styles.ruang} numberOfLines={1}>
        {mataKuliah.ruang}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    flex: 1,
    gap: 6,
    padding: JARAK.md,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  kepala: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: JARAK.sm,
  },
  kode: {
    fontSize: TEKS.mungil,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: WARNA.utama,
  },
  nama: {
    fontSize: TEKS.isi,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  kaki: {
    flexDirection: 'row',
    gap: JARAK.sm,
  },
  meta: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
    backgroundColor: WARNA.permukaanRedup,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  dosen: {
    fontSize: TEKS.kecil,
    color: WARNA.tinta,
  },
  ruang: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
});
