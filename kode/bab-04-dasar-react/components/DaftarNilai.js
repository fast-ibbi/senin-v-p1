import { StyleSheet, Text, View } from 'react-native';

/**
 * List rendering dengan `map`, plus conditional rendering untuk data kosong.
 *
 * Perhatikan `key`: dipasang pada elemen yang dihasilkan `map`, bukan di dalam
 * komponen anak. React memakai `key` untuk mengenali baris mana yang berubah —
 * tanpa key, React menganggap seluruh daftar baru dan membuang state tiap baris.
 */
export function DaftarNilai({ daftar = [], onPilih }) {
  if (daftar.length === 0) {
    return (
      <View style={styles.kosong}>
        <Text style={styles.teksKosong}>Belum ada nilai pada semester ini.</Text>
      </View>
    );
  }

  return (
    <View style={styles.daftar}>
      {daftar.map((baris) => (
        <View key={baris.kode} style={styles.baris}>
          <View style={styles.kiri}>
            <Text style={styles.nama}>{baris.nama}</Text>
            <Text style={styles.meta}>
              {baris.kode} · {baris.sks} SKS · semester {baris.semester}
            </Text>
          </View>

          <Text style={[styles.huruf, warnaNilai(baris.nilaiHuruf)]}>{baris.nilaiHuruf}</Text>
        </View>
      ))}
    </View>
  );
}

/** Style bersyarat: satu fungsi, dipanggil per baris. */
function warnaNilai(huruf) {
  if (huruf.startsWith('A')) return { color: '#34d399' };
  if (huruf.startsWith('B')) return { color: '#7dd3fc' };
  if (huruf.startsWith('C')) return { color: '#fbbf24' };
  return { color: '#f87171' };
}

const styles = StyleSheet.create({
  daftar: { gap: 8 },
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  kiri: { flex: 1 },
  nama: { color: '#e2e8f0', fontSize: 14, fontWeight: '600' },
  meta: { color: '#64748b', fontSize: 11, marginTop: 2 },
  huruf: { fontSize: 16, fontWeight: '700', minWidth: 28, textAlign: 'right' },
  kosong: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#334155',
    borderRadius: 10,
    padding: 16,
  },
  teksKosong: { color: '#64748b', fontSize: 12, textAlign: 'center' },
});
