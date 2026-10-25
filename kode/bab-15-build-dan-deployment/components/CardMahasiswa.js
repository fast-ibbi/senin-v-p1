import { Pressable, StyleSheet, Text, View } from 'react-native';

import { bayangan, radius, spasi, teks, warna } from '../tema/desain.js';

/**
 * Satu kartu = satu entitas = satu mahasiswa.
 *
 * Anatomi kartu mengikuti sistem token: latar permukaan, radius 10, padding 16,
 * jarak antar kartu 8. Kartu tidak mengimpor data sendiri — semuanya lewat props,
 * sehingga bisa dipakai di layar mana pun (daftar, detail, bahkan Beranda nanti).
 */
export function CardMahasiswa({ mhs, onPress, terpilih = false }) {
  const { nama, nim, prodi, angkatan, ipk } = mhs;

  const isi = (
    <View style={[styles.kartu, terpilih && styles.kartuTerpilih]}>
      <View style={styles.avatar}>
        <Text style={styles.inisial}>{inisial(nama)}</Text>
      </View>

      <View style={styles.tengah}>
        <Text style={styles.nama} numberOfLines={1}>
          {nama}
        </Text>
        <View style={styles.barisLencana}>
          <Text style={styles.lencana}>{prodi}</Text>
          <Text style={styles.meta}>Angkatan {angkatan}</Text>
        </View>
        <Text style={styles.nim}>NIM {nim}</Text>
      </View>

      <View style={styles.kanan}>
        <Text style={styles.ipk}>{ipk.toFixed(2)}</Text>
        <Text style={styles.labelIpk}>IPK</Text>
      </View>
    </View>
  );

  // Tanpa onPress, kartu hanya tampilan — tidak perlu bisa ditekan sama sekali.
  if (!onPress) {
    return isi;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Buka detail ${nama}`}
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.ditekan]}
    >
      {isi}
    </Pressable>
  );
}

function inisial(nama) {
  return nama
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((kata) => kata[0].toUpperCase())
    .join('');
}

const styles = StyleSheet.create({
  kartu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spasi.md,
    backgroundColor: warna.permukaan,
    borderRadius: radius.md,
    padding: spasi.lg,
    ...bayangan,
  },
  kartuTerpilih: { borderWidth: 1, borderColor: warna.utama },
  ditekan: { opacity: 0.85 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pil,
    backgroundColor: warna.utama,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inisial: { color: warna.teks, ...teks.isi, fontWeight: '700' },
  tengah: { flex: 1, gap: 2 },
  nama: { color: warna.teks, ...teks.subjudul },
  barisLencana: { flexDirection: 'row', alignItems: 'center', gap: spasi.sm },
  lencana: {
    color: warna.utamaRedup,
    ...teks.mikro,
    backgroundColor: 'rgba(14,165,233,0.12)',
    borderRadius: radius.sm,
    paddingHorizontal: spasi.sm,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  meta: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
  nim: { color: warna.teksRedup, ...teks.kecil },
  kanan: { alignItems: 'flex-end' },
  ipk: { color: warna.utamaRedup, ...teks.subjudul },
  labelIpk: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
});
