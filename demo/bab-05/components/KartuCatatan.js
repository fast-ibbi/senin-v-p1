import { StyleSheet, Text, View } from 'react-native';

import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Kartu catatan penyaji: selalu tampil di atas setiap layar, tidak ikut tergulir.
// Isinya 2–3 butir "yang perlu diperhatikan" + rujukan slide, supaya kelas tetap
// tahu apa yang harus dilihat kalau narasi dosen terlewat.
export default function KartuCatatan({ judul, rujukan, poin }) {
  return (
    <View style={styles.kartu}>
      <Text style={styles.label}>YANG PERLU DIPERHATIKAN</Text>
      <Text style={styles.judul}>{judul}</Text>

      {poin.map((butir) => (
        <View key={butir} style={styles.barisButir}>
          <Text style={styles.tandaButir}>•</Text>
          <Text style={styles.butir}>{butir}</Text>
        </View>
      ))}

      <Text style={styles.rujukan}>{rujukan}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: WARNA.utamaMuda,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: WARNA.utama,
    paddingVertical: JARAK.md,
    paddingHorizontal: JARAK.md,
    marginHorizontal: JARAK.lg,
    marginTop: JARAK.md,
    gap: 2,
  },
  label: {
    fontSize: TEKS.mungil,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: WARNA.utama,
    marginBottom: 2,
  },
  judul: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.tinta,
    marginBottom: 2,
  },
  barisButir: {
    flexDirection: 'row',
    gap: JARAK.sm,
  },
  tandaButir: {
    fontSize: TEKS.isi,
    lineHeight: 19,
    color: WARNA.utama,
  },
  butir: {
    flex: 1,
    fontSize: TEKS.isi,
    lineHeight: 19,
    color: WARNA.tinta,
  },
  rujukan: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
    marginTop: JARAK.sm,
  },
});
