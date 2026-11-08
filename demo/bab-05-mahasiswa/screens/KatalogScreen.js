import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import KartuMataKuliah from '../components/KartuMataKuliah';
import { DAFTAR_MATA_KULIAH } from '../data/mahasiswa';
import { BREAKPOINT_LEBAR, JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

const PILIHAN_SEMESTER = [
  { kunci: 'semua', label: 'Semua' },
  { kunci: 5, label: 'Semester 5' },
  { kunci: 6, label: 'Semester 6' },
];

// Katalog mata kuliah — grid responsif.
//
// Rujukan slide Bab 5:
//   • subbab 5.2 — `numColumns` pada FlatList, plus satu syarat yang jarang
//     diingat: `key` daftar harus ikut berubah saat `numColumns` berubah, karena
//     jumlah kolom ikut menentukan susunan InternalVirtualizedList.
//   • subbab 4.9 — jumlah kolom dipilih dari lebar jendela, bukan dari nama
//     perangkat.
//   • subbab 3.3 — chip semester memakai array style untuk keadaan aktif.
export default function KatalogScreen() {
  const { width } = useWindowDimensions();
  const lebarLayar = width >= BREAKPOINT_LEBAR;
  const kolom = lebarLayar ? 2 : 1;

  const [semester, setSemester] = useState('semua');

  const tersaring =
    semester === 'semua'
      ? DAFTAR_MATA_KULIAH
      : DAFTAR_MATA_KULIAH.filter((m) => m.semester === semester);

  const totalSks = tersaring.reduce((jumlah, m) => jumlah + m.sks, 0);

  return (
    <FlatList
      // `key` berubah ketika jumlah kolom berubah — tanpa ini, FlatList
      // mempertahankan susunan lama dan kartu tampak berhimpitan.
      key={'katalog-' + kolom}
      style={styles.layar}
      contentContainerStyle={styles.isi}
      data={tersaring}
      numColumns={kolom}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <KartuMataKuliah mataKuliah={item} />}
      columnWrapperStyle={kolom > 1 ? styles.barisKolom : undefined}
      ItemSeparatorComponent={() => <View style={styles.pemisah} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.kepala}>
          <Text style={styles.judul}>Katalog mata kuliah</Text>
          <Text style={styles.subJudul}>
            {tersaring.length} mata kuliah · {totalSks} SKS · {kolom} kolom
          </Text>

          <View style={styles.barisChip}>
            {PILIHAN_SEMESTER.map((pilihan) => {
              const aktif = pilihan.kunci === semester;
              return (
                <Pressable
                  key={String(pilihan.kunci)}
                  onPress={() => setSemester(pilihan.kunci)}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityState={{ selected: aktif }}
                  style={({ pressed }) => [
                    styles.chip,
                    aktif && styles.chipAktif,
                    pressed && styles.chipDitekan,
                  ]}
                >
                  <Text style={[styles.teksChip, aktif && styles.teksChipAktif]}>
                    {pilihan.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.kosong}>
          <Text style={styles.teksKosong}>Belum ada mata kuliah pada semester ini.</Text>
        </View>
      }
      ListFooterComponent={
        <Text style={styles.catatanKaki}>
          Di layar lebar katalog menjadi dua kolom (numColumns), di layar sempit satu kolom.
          Perhatikan juga properti key pada FlatList: nilainya ikut berubah saat jumlah
          kolom berubah, supaya susunan tidak memakai layout lama.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  layar: {
    flex: 1,
    backgroundColor: WARNA.latar,
  },
  isi: {
    padding: JARAK.lg,
    paddingBottom: JARAK.xxl,
  },
  kepala: {
    gap: JARAK.sm,
    marginBottom: JARAK.md,
  },
  judul: {
    fontSize: TEKS.judulLayar,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  subJudul: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  barisChip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: JARAK.sm,
    marginTop: JARAK.xs,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: JARAK.md,
    borderRadius: RADIUS.bulat,
    borderWidth: 1,
    borderColor: WARNA.garis,
    backgroundColor: WARNA.permukaan,
  },
  chipAktif: {
    borderColor: WARNA.utama,
    backgroundColor: WARNA.utamaMuda,
  },
  chipDitekan: {
    opacity: 0.85,
  },
  teksChip: {
    fontSize: TEKS.kecil,
    fontWeight: '600',
    color: WARNA.tintaRedup,
  },
  teksChipAktif: {
    color: WARNA.utama,
  },
  barisKolom: {
    gap: JARAK.md,
  },
  pemisah: {
    height: JARAK.sm,
  },
  kosong: {
    alignItems: 'center',
    paddingVertical: JARAK.xl,
  },
  teksKosong: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  catatanKaki: {
    marginTop: JARAK.lg,
    fontSize: TEKS.mungil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
});
