import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { CardMahasiswa } from '../components/CardMahasiswa.js';
import { spasi, teks, warna } from '../tema/desain.js';

/**
 * Header + daftar mahasiswa.
 *
 * Layar tidak memiliki data sendiri: `daftar` datang dari props. Itu sebabnya
 * layar ini bisa dipakai untuk hasil pencarian, hasil filter, atau data dari API
 * (bab 10) tanpa diubah.
 */
export function DaftarMahasiswa({ daftar = [], onPilih, terpilih = null }) {
  const { width } = useWindowDimensions();
  const kolom = width >= 700 ? 2 : 1;

  return (
    <View style={styles.layar}>
      <View style={styles.header}>
        <View>
          <Text style={styles.judul}>Data Mahasiswa</Text>
          <Text style={styles.subjudul}>
            {daftar.length} mahasiswa · {kolom} kolom
          </Text>
        </View>
        <Text style={styles.lencana}>SI · TI</Text>
      </View>

      <FlatList
        data={daftar}
        key={kolom}
        numColumns={kolom}
        keyExtractor={(mhs) => mhs.nim}
        renderItem={({ item }) => (
          <View style={kolom > 1 ? styles.sel : styles.selPenuh}>
            <CardMahasiswa
              mhs={item}
              onPress={onPilih ? () => onPilih(item) : undefined}
              terpilih={terpilih === item.nim}
            />
          </View>
        )}
        columnWrapperStyle={kolom > 1 ? styles.barisDuaKolom : undefined}
        contentContainerStyle={styles.isiDaftar}
        ListEmptyComponent={
          <Text style={styles.kosong}>Belum ada data mahasiswa untuk ditampilkan.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spasi.lg,
    paddingTop: spasi.sm,
    paddingBottom: spasi.lg,
  },
  judul: { color: warna.teks, ...teks.judul },
  subjudul: { color: warna.teksMati, ...teks.kecil, marginTop: 2 },
  lencana: {
    color: warna.utamaRedup,
    ...teks.mikro,
    borderWidth: 1,
    borderColor: warna.garis,
    borderRadius: 999,
    paddingHorizontal: spasi.md,
    paddingVertical: spasi.xs,
  },
  isiDaftar: { paddingHorizontal: spasi.lg, paddingBottom: spasi.xxl },
  barisDuaKolom: { gap: spasi.md },
  sel: { flex: 1, marginBottom: spasi.sm },
  selPenuh: { marginBottom: spasi.sm },
  kosong: { color: warna.teksMati, ...teks.isi, textAlign: 'center', padding: spasi.xl },
});
