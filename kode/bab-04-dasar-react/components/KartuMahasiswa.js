import { StyleSheet, Text, View } from 'react-native';

/**
 * Kartu identitas mahasiswa.
 *
 * Komponen ini tidak menyimpan state: semua yang ditampilkan datang dari props.
 * Itulah yang membuatnya bisa dipakai di layar mana pun — Beranda nanti memakai
 * komponen yang sama dengan ukuran berbeda.
 */
export function KartuMahasiswa({
  nama = 'Tanpa Nama',
  nim = '-',
  prodi = '-',
  semester = 1,
  ipk = null,
  ringkas = false,
}) {
  return (
    <View style={[styles.kartu, ringkas && styles.kartuRingkas]}>
      <View style={styles.avatar}>
        {/* Inisial diambil dari huruf pertama setiap kata nama. */}
        <Text style={styles.inisial}>{inisialDari(nama)}</Text>
      </View>

      <View style={styles.teks}>
        <Text style={styles.nama} numberOfLines={1}>
          {nama}
        </Text>
        <Text style={styles.meta}>
          {nim} · {prodi}
        </Text>
        <Text style={styles.meta}>Semester {semester}</Text>

        {ipk !== null && (
          <View style={styles.barisIpk}>
            <Text style={styles.ipk}>{ipk.toFixed(2)}</Text>
            <Text style={styles.labelIpk}>IPK</Text>
            <Text style={styles.predikat}>{predikatSingkat(ipk)}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

/** "Nadia Putri Ramadhani" → "NP" (maksimal dua huruf). */
function inisialDari(nama) {
  return nama
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((kata) => kata[0].toUpperCase())
    .join('');
}

/** Label pendek supaya kartu tidak penuh; aturan lengkapnya ada di utils/akademik.js. */
function predikatSingkat(ipk) {
  if (ipk >= 3.5) return 'Pujian';
  if (ipk >= 3.0) return 'Sangat Memuaskan';
  if (ipk >= 2.5) return 'Memuaskan';
  return 'Cukup';
}

const styles = StyleSheet.create({
  kartu: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
  },
  kartuRingkas: {
    paddingVertical: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inisial: { color: '#f8fafc', fontSize: 18, fontWeight: '700' },
  teks: { flex: 1, justifyContent: 'center' },
  nama: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
  meta: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  barisIpk: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 8 },
  ipk: { color: '#7dd3fc', fontSize: 20, fontWeight: '700' },
  labelIpk: { color: '#64748b', fontSize: 11, marginBottom: 3 },
  predikat: {
    color: '#a7f3d0',
    fontSize: 11,
    marginBottom: 3,
    marginLeft: 'auto',
  },
});
