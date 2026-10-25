import { Link, Redirect, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FormField } from '../components/FormField.js';
import { Tombol } from '../components/Tombol.js';
import { useAuth } from '../context/AuthContext.js';
import { spasi, teks, warna } from '../tema/desain.js';
import { validasiLogin } from '../utils/validators.js';

/**
 * Form login — versi bab 8.
 *
 * Empat keputusan yang penting di layar ini:
 *
 * 1. **Controlled component.** `nim` dan `password` tinggal di state, bukan di
 *    dalam TextInput. State adalah satu-satunya sumber kebenaran; kalau tidak,
 *    nilai di layar dan nilai di variabel bisa berbeda.
 * 2. **Validasi saat submit, bukan saat mengetik.** Memeriksa setiap ketukan
 *    membuat pengguna melihat galat sebelum selesai menulis.
 * 3. **Tombol tetap aktif.** Menonaktifkan tombol sampai form valid terlihat
 *    rapi, tetapi pengguna tidak tahu apa yang salah. Di sini tombol selalu bisa
 *    ditekan, dan kesalahan dijelaskan per kolom.
 * 4. **KeyboardAvoidingView.** Tanpa ini, kolom bawah tertutup keyboard.
 */
export default function Login() {
  const { masuk, sudahMasuk } = useAuth();

  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [memuat, setMemuat] = useState(false);
  const [galatServer, setGalatServer] = useState(null);

  if (sudahMasuk) {
    return <Redirect href="/(tabs)/beranda" />;
  }

  const kirim = async () => {
    const hasil = validasiLogin({ nim, password });
    setErrors(hasil.errors);
    setGalatServer(null);
    if (!hasil.sah) return;

    setMemuat(true);
    try {
      await masuk(nim, password);
      router.replace('/(tabs)/beranda');
    } catch (err) {
      // 401 dari server: pesannya "NIM atau password salah" — jangan diperhalus.
      setGalatServer(err.message);
    } finally {
      setMemuat(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.layar}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.isi}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.merek}>
          <Text style={styles.judul}>siakad-mobile</Text>
          <Text style={styles.subjudul}>Masuk dengan NIM dan password akademik</Text>
        </View>

        <FormField
          label="NIM"
          nilai={nim}
          onChangeText={setNim}
          galat={errors.nim}
          petunjuk="8 angka, contoh 20230001"
          placeholder="20230001"
          keyboardType="number-pad"
          autoCapitalize="none"
          autoComplete="username"
          maxLength={8}
          editable={!memuat}
        />

        <FormField
          label="Password"
          nilai={password}
          onChangeText={setPassword}
          galat={errors.password}
          petunjuk="Minimal 8 karakter"
          placeholder="••••••••"
          rahasia
          autoCapitalize="none"
          autoComplete="current-password"
          editable={!memuat}
          onSubmitEditing={kirim}
          returnKeyType="go"
        />

        {galatServer && <Text style={styles.galatServer}>{galatServer}</Text>}

        <Tombol judul="Masuk" penuh memuat={memuat} onPress={kirim} />

        <View style={styles.kaki}>
          <Text style={styles.kakiTeks}>Belum punya akun?</Text>
          <Link href="/registrasi" style={styles.tautan}>
            <Text style={styles.tautanTeks}>Daftar sekarang</Text>
          </Link>
        </View>

        <Text style={styles.catatan}>
          Akun demo: NIM 20230001, password rahasia123. Password diverifikasi server
          (`backend/routes/auth.js`); token yang diterima disimpan di SecureStore.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: spasi.xl, paddingTop: spasi.jumbo, gap: spasi.lg, paddingBottom: spasi.xxxl },
  merek: { gap: spasi.xs, marginBottom: spasi.lg },
  judul: { color: warna.teks, ...teks.judulBesar },
  subjudul: { color: warna.teksMati, ...teks.kecil },
  kaki: { flexDirection: 'row', justifyContent: 'center', gap: spasi.sm },
  kakiTeks: { color: warna.teksMati, ...teks.kecil },
  tautan: { paddingVertical: 2 },
  tautanTeks: { color: warna.utamaRedup, ...teks.kecil, fontWeight: '600' },
  galatServer: {
    color: warna.bahaya,
    ...teks.kecil,
    backgroundColor: 'rgba(248,113,113,0.08)',
    borderRadius: 8,
    padding: spasi.md,
  },
  catatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', lineHeight: 16 },
});
