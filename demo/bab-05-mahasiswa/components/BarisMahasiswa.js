import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatIPK, predikatAkademik } from '../data/mahasiswa';
import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';
import AvatarPlaceholder from './AvatarPlaceholder';
import LabelStatus from './LabelStatus';

// Satu baris daftar mahasiswa.
//
// Rujukan slide Bab 5:
//   • subbab 2.10 — data masuk lewat props, komponen ini tidak tahu dari mana
//     asalnya.
//   • subbab 3.3 — label predikat memakai gaya kondisional dari hasil
//     predikatAkademik(), bukan state berisi warna.
//   • subbab 5.2 — komponen ini dipakai sebagai `renderItem` FlatList: harus
//     menerima `mahasiswa` dan tidak menyimpan data daftar sendiri.
export default function BarisMahasiswa({ mahasiswa, onPress }) {
  const predikat = predikatAkademik(mahasiswa.ipk);

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: WARNA.permukaanRedup }}
      accessibilityRole="button"
      accessibilityLabel={'Buka detail ' + mahasiswa.nama}
      style={({ pressed }) => [styles.baris, pressed && styles.barisDitekan]}
    >
      <AvatarPlaceholder
        nama={mahasiswa.nama}
        ukuran={44}
        fotoUri={mahasiswa.fotoUri}
      />

      <View style={styles.identitas}>
        <Text style={styles.nama} numberOfLines={1}>
          {mahasiswa.nama}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {mahasiswa.nim} · {mahasiswa.prodi}
        </Text>
        <View style={styles.barisLabel}>
          <LabelStatus label={predikat.label} jenis={predikat.jenis} />
          {mahasiswa.status !== 'Aktif' && (
            <LabelStatus label={mahasiswa.status} jenis="netral" />
          )}
        </View>
      </View>

      <View style={styles.nilai}>
        <Text style={styles.ipk}>{formatIPK(mahasiswa.ipk)}</Text>
        <Text style={styles.ipkLabel}>IPK</Text>
      </View>

      <Text style={styles.panah}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: JARAK.md,
    padding: JARAK.md,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  barisDitekan: {
    backgroundColor: WARNA.permukaanRedup,
  },
  identitas: {
    flex: 1,
    gap: 2,
  },
  nama: {
    fontSize: TEKS.isi,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  meta: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  barisLabel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: JARAK.xs,
    marginTop: 2,
  },
  nilai: {
    alignItems: 'flex-end',
  },
  ipk: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.utama,
  },
  ipkLabel: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  panah: {
    fontSize: 22,
    color: WARNA.tintaRedup,
    marginLeft: -2,
  },
});
