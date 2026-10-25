import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Tombol } from '../components/Tombol.js';
import { useAuth } from '../context/AuthContext.js';
import { spasi, teks, warna } from '../tema/desain.js';

/**
 * Layar login — versi bab 7.
 *
 * Belum ada TextInput dan belum ada validasi: keduanya datang di bab 8. Yang
 * dilatih di sini adalah **arah aliran**: menekan tombol mengubah sesi, lalu
 * router memindahkan layar. Tidak ada `<Redirect href="/login">` di halaman ini
 * yang menunjuk dirinya sendiri — itu penyebab lingkaran pengalihan yang
 * dibahas di slide.
 */
export default function Login() {
  const { masuk, sudahMasuk } = useAuth();

  // Kalau sudah masuk dan membuka /login langsung, kembalikan ke aplikasi.
  if (sudahMasuk) {
    return <Redirect href="/(tabs)/beranda" />;
  }

  return (
    <View style={styles.layar}>
      <View style={styles.merek}>
        <Text style={styles.judul}>siakad-mobile</Text>
        <Text style={styles.subjudul}>Sistem Informasi Akademik · Universitas IBBI</Text>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.label}>Masuk sebagai mahasiswa demo</Text>
        <Text style={styles.nim}>NIM 20230001 · Nadia Putri Ramadhani</Text>

        <Tombol
          judul="Masuk"
          penuh
          onPress={() => {
            masuk();
            // `replace`, bukan `push`: layar login tidak perlu bisa dikembali.
            router.replace('/(tabs)/beranda');
          }}
        />

        <Text style={styles.catatan}>
          Bab 8 menambahkan kolom NIM dan password beserta validasinya. Bab 13 mengganti
          sesi tiruan ini dengan token dari server.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar, justifyContent: 'center', padding: spasi.xl },
  merek: { alignItems: 'center', marginBottom: spasi.xxl },
  judul: { color: warna.teks, ...teks.judulBesar },
  subjudul: { color: warna.teksMati, ...teks.kecil, marginTop: spasi.sm, textAlign: 'center' },
  kartu: {
    backgroundColor: warna.permukaan,
    borderRadius: 14,
    padding: spasi.xl,
    gap: spasi.md,
  },
  label: { color: warna.teks, ...teks.subjudul },
  nim: { color: warna.teksRedup, ...teks.kecil },
  catatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', lineHeight: 16 },
});
