import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import BarisMahasiswa from '../components/BarisMahasiswa';
import KotakPencarian from '../components/KotakPencarian';
import { DAFTAR_MAHASISWA } from '../data/mahasiswa';
import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Daftar mahasiswa — pencarian, pengurutan, dan FlatList.
//
// Rujukan slide Bab 5:
//   • subbab 2.9 & 5.2 — `FlatList` dengan tiga properti wajib: `data`,
//     `renderItem`, dan `keyExtractor`. `keyExtractor` memakai `item.id`, bukan
//     indeks array, karena indeks bergeser saat data difilter.
//   • subbab 2.7 — `TextInput` pencarian adalah controlled component; hasil
//     pencarian adalah nilai turunan, jadi tidak perlu state kedua.
//   • subbab 3.3 — tombol urut memakai array style untuk keadaan aktif.
//   • subbab 5.2 — `ListHeaderComponent`, `ListEmptyComponent`,
//     `ItemSeparatorComponent`, dan `ListFooterComponent` dipakai apa adanya.
export default function MahasiswaScreen({ onBukaDetail }) {
  const [kataKunci, setKataKunci] = useState('');
  const [urutIpk, setUrutIpk] = useState(false);

  const kunci = kataKunci.trim().toLowerCase();

  // Nilai turunan: dihitung saat render, bukan disimpan di state. Kalau daftar
  // sumber berubah, hasil pencarian ikut berubah tanpa sinkronisasi manual.
  const tersaring = DAFTAR_MAHASISWA.filter((m) => {
    if (kunci === '') return true;
    return (
      m.nama.toLowerCase().includes(kunci) ||
      m.nim.includes(kunci) ||
      m.prodi.toLowerCase().includes(kunci)
    );
  });

  // Salinan baru sebelum diurutkan: `sort` mengubah array aslinya.
  const urut = [...tersaring].sort((a, b) =>
    urutIpk ? b.ipk - a.ipk : a.nama.localeCompare(b.nama),
  );

  return (
    <FlatList
      style={styles.layar}
      contentContainerStyle={styles.isi}
      data={urut}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <BarisMahasiswa mahasiswa={item} onPress={() => onBukaDetail(item.id)} />
      )}
      ItemSeparatorComponent={() => <View style={styles.pemisah} />}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.kepala}>
          <Text style={styles.judul}>Data mahasiswa</Text>
          <Text style={styles.subJudul}>
            Cari berdasarkan nama, NIM, atau program studi.
          </Text>

          <KotakPencarian
            nilai={kataKunci}
            onUbah={setKataKunci}
            placeholder="Cari mahasiswa…"
          />

          <View style={styles.barisAlat}>
            <Text style={styles.jumlah}>
              {urut.length} dari {DAFTAR_MAHASISWA.length} mahasiswa
            </Text>
            <Pressable
              onPress={() => setUrutIpk((sebelumnya) => !sebelumnya)}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Ubah urutan daftar"
              style={({ pressed }) => [
                styles.tombolUrut,
                urutIpk && styles.tombolUrutAktif,
                pressed && styles.tombolUrutDitekan,
              ]}
            >
              <Text style={[styles.teksUrut, urutIpk && styles.teksUrutAktif]}>
                {urutIpk ? 'IPK tertinggi' : 'Nama A–Z'}
              </Text>
            </Pressable>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.kosong}>
          <Text style={styles.ikonKosong}>⌕</Text>
          <Text style={styles.judulKosong}>Tidak ada mahasiswa yang cocok</Text>
          <Text style={styles.teksKosong}>
            Kata kunci “{kataKunci}” tidak ditemukan pada nama, NIM, maupun program studi.
            Hapus pencarian untuk melihat seluruh daftar.
          </Text>
        </View>
      }
      ListFooterComponent={
        <Text style={styles.catatanKaki}>
          Daftar ini dirender bertahap oleh FlatList: hanya item di sekitar layar yang
          dibuat. Itu sebabnya daftar panjang tetap ringan, dan sebabnya FlatList tidak
          boleh dibungkus ScrollView searah.
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
    marginBottom: JARAK.xs,
  },
  barisAlat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: JARAK.sm,
    marginTop: JARAK.xs,
  },
  jumlah: {
    flexShrink: 1,
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  tombolUrut: {
    paddingVertical: 4,
    paddingHorizontal: JARAK.sm,
    borderRadius: RADIUS.bulat,
    borderWidth: 1,
    borderColor: WARNA.garis,
    backgroundColor: WARNA.permukaan,
  },
  tombolUrutAktif: {
    borderColor: WARNA.utama,
    backgroundColor: WARNA.utamaMuda,
  },
  tombolUrutDitekan: {
    opacity: 0.85,
  },
  teksUrut: {
    fontSize: TEKS.mungil,
    fontWeight: '600',
    color: WARNA.tintaRedup,
  },
  teksUrutAktif: {
    color: WARNA.utama,
  },
  pemisah: {
    height: JARAK.sm,
  },
  kosong: {
    alignItems: 'center',
    gap: JARAK.xs,
    paddingVertical: JARAK.xxl,
    paddingHorizontal: JARAK.lg,
  },
  ikonKosong: {
    fontSize: 28,
    color: WARNA.tintaRedup,
  },
  judulKosong: {
    fontSize: TEKS.isi,
    fontWeight: '700',
    color: WARNA.tinta,
    textAlign: 'center',
  },
  teksKosong: {
    fontSize: TEKS.kecil,
    lineHeight: 18,
    color: WARNA.tintaRedup,
    textAlign: 'center',
  },
  catatanKaki: {
    marginTop: JARAK.lg,
    fontSize: TEKS.mungil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
});
