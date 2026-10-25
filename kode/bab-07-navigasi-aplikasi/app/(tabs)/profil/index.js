import { Stack, router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Tombol } from '../../../components/Tombol.js';
import { useAuth } from '../../../context/AuthContext.js';
import { mahasiswa, nilai } from '../../../data/mahasiswa.js';
import { hitungIpk } from '../../../utils/akademik.js';
import { spasi, teks, warna } from '../../../tema/desain.js';

/**
 * Tab Profil.
 *
 * Perhatikan `keluar()`: ia hanya menghapus sesi, lalu layar ini digantikan oleh
 * pengalihan di `(tabs)/_layout.js`. Tidak ada `router.replace('/login')` di sini —
 * satu titik kendali sudah cukup, dan itulah gunanya menaruh penjagaan di layout.
 */
export default function Profil() {
  const { pengguna, keluar } = useAuth();
  const ipk = hitungIpk(nilai);

  return (
    <>
      <Stack.Screen options={{ title: 'Profil' }} />
      <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
        <View style={styles.kepala}>
          <View style={styles.avatar}>
            <Text style={styles.inisial}>{mahasiswa.nama.charAt(0)}</Text>
          </View>
          <Text style={styles.nama}>{mahasiswa.nama}</Text>
          <Text style={styles.meta}>
            {mahasiswa.nim} · {mahasiswa.prodi}
          </Text>
        </View>

        <View style={styles.kartu}>
          <Pasangan label="Studi" nilai={`${mahasiswa.prodi} · semester ${mahasiswa.semester}`} />
          <Pasangan label="Kelas" nilai={mahasiswa.kelas} />
          <Pasangan label="Email" nilai={mahasiswa.email} />
          <Pasangan label="Telepon" nilai={mahasiswa.telepon} />
          <Pasangan label="IPK" nilai={ipk.toFixed(2)} />
          <Pasangan
            label="Sesi"
            nilai={pengguna ? `Masuk sejak ${new Date(pengguna.masukPada).toLocaleTimeString('id-ID')}` : '—'}
          />
        </View>

        <Tombol judul="Ubah profil" varian="sekunder" penuh onPress={() => {}} />
        <Tombol judul="Keluar" varian="garis" penuh onPress={keluar} />

        <Text style={styles.catatan}>
          Foto profil dan presensi berbasis lokasi ditambahkan di bab 12. Ubah profil
          tersambung ke server di bab 10.
        </Text>

        <Tombol
          judul="Buka halaman login (uji penjagaan)"
          varian="teks"
          onPress={() => router.push('/login')}
        />
      </ScrollView>
    </>
  );
}

function Pasangan({ label, nilai: isi }) {
  return (
    <View style={styles.pasangan}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.nilai}>{isi}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: spasi.lg, paddingBottom: spasi.xxxl, gap: spasi.md },
  kepala: { alignItems: 'center', gap: spasi.xs, paddingVertical: spasi.md },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: warna.utama,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spasi.sm,
  },
  inisial: { color: warna.teks, fontSize: 28, fontWeight: '700' },
  nama: { color: warna.teks, ...teks.judul },
  meta: { color: warna.teksRedup, ...teks.kecil },
  kartu: { backgroundColor: warna.permukaan, borderRadius: 12, padding: spasi.lg, gap: spasi.sm },
  pasangan: { flexDirection: 'row', gap: spasi.md },
  label: { color: warna.teksMati, ...teks.kecil, width: 80 },
  nilai: { color: warna.teks, ...teks.kecil, flex: 1 },
  catatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', lineHeight: 16 },
});
