import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FormField } from '../components/FormField.js';
import { Tombol } from '../components/Tombol.js';
import { spasi, teks, warna } from '../tema/desain.js';
import { kekuatanPassword, labelKekuatan, validasiRegistrasi } from '../utils/validators.js';

const PILIHAN_PRODI = ['Sistem Informasi', 'Teknik Informatika'];

/**
 * Form registrasi — enam kolom, satu aturan validasi, satu keputusan.
 *
 * Perhatikan bahwa layar ini tidak tahu *bagaimana* sebuah NIM dinyatakan sah;
 * ia hanya memanggil `validasiRegistrasi`. Kalau aturan berubah (misalnya NIM
 * boleh 9 angka), satu berkas `utils/validators.js` yang diubah, bukan lima form.
 */
export default function Registrasi() {
  const [nilai, setNilai] = useState({
    nim: '',
    nama: '',
    email: '',
    prodi: '',
    password: '',
    konfirmasi: '',
  });
  const [errors, setErrors] = useState({});
  const [memuat, setMemuat] = useState(false);
  const [berhasil, setBerhasil] = useState(false);

  const ubah = (field) => (teksBaru) => setNilai((lama) => ({ ...lama, [field]: teksBaru }));

  const kirim = () => {
    const hasil = validasiRegistrasi(nilai);
    setErrors(hasil.errors);
    if (!hasil.sah) return;

    setMemuat(true);
    // Bab 10 mengubah ini menjadi POST /api/mahasiswa.
    setTimeout(() => {
      setMemuat(false);
      setBerhasil(true);
    }, 400);
  };

  if (berhasil) {
    return (
      <View style={styles.sukses}>
        <Text style={styles.suksesJudul}>Pendaftaran tercatat</Text>
        <Text style={styles.suksesTeks}>
          {nilai.nama} ({nilai.nim}) terdaftar pada program studi {nilai.prodi}.
        </Text>
        <Text style={styles.catatan}>
          Belum ada data yang dikirim ke server. Mulai bab 10 formulir ini menulis ke
          backend, dan bab 13 menambahkan token.
        </Text>
        <Tombol judul="Kembali ke login" penuh onPress={() => router.replace('/login')} />
      </View>
    );
  }

  const skor = kekuatanPassword(nilai.password);

  return (
    <KeyboardAvoidingView
      style={styles.layar}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.isi}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.judul}>Buat akun mahasiswa</Text>
        <Text style={styles.subjudul}>
          Isi semua kolom. Galat muncul di bawah kolom yang bersangkutan.
        </Text>

        <FormField
          label="NIM"
          nilai={nilai.nim}
          onChangeText={ubah('nim')}
          galat={errors.nim}
          petunjuk="8 angka"
          keyboardType="number-pad"
          maxLength={8}
          placeholder="20250001"
        />

        <FormField
          label="Nama lengkap"
          nilai={nilai.nama}
          onChangeText={ubah('nama')}
          galat={errors.nama}
          autoCapitalize="words"
          placeholder="Nama sesuai ijazah"
        />

        <FormField
          label="Email kampus"
          nilai={nilai.email}
          onChangeText={ubah('email')}
          galat={errors.email}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="nama@student.ibbi.ac.id"
        />

        <View style={styles.grup}>
          <Text style={styles.label}>Program studi</Text>
          <View style={styles.pilihan}>
            {PILIHAN_PRODI.map((prodi) => {
              const aktif = nilai.prodi === prodi;
              return (
                <Pressable
                  key={prodi}
                  onPress={() => ubah('prodi')(prodi)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: aktif }}
                  style={[styles.pil, aktif && styles.pilAktif]}
                >
                  <Text style={[styles.pilTeks, aktif && styles.pilTeksAktif]}>{prodi}</Text>
                </Pressable>
              );
            })}
          </View>
          {errors.prodi ? <Text style={styles.galat}>{errors.prodi}</Text> : null}
        </View>

        <FormField
          label="Password"
          nilai={nilai.password}
          onChangeText={ubah('password')}
          galat={errors.password}
          petunjuk="Minimal 8 karakter"
          rahasia
          autoCapitalize="none"
        />

        {nilai.password.length > 0 && (
          <View style={styles.kekuatan}>
            <View style={styles.bilah}>
              {[1, 2, 3, 4].map((tingkat) => (
                <View
                  key={tingkat}
                  style={[
                    styles.potong,
                    { backgroundColor: tingkat <= skor ? warnaKekuatan(skor) : warna.garis },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.labelKekuatan}>{labelKekuatan[skor]}</Text>
          </View>
        )}

        <FormField
          label="Ulangi password"
          nilai={nilai.konfirmasi}
          onChangeText={ubah('konfirmasi')}
          galat={errors.konfirmasi}
          rahasia
          autoCapitalize="none"
        />

        <Tombol judul="Daftar" penuh memuat={memuat} onPress={kirim} />
        <Tombol judul="Batal" varian="teks" penuh onPress={() => router.back()} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function warnaKekuatan(skor) {
  if (skor <= 1) return warna.bahaya;
  if (skor === 2) return warna.peringatan;
  if (skor === 3) return warna.utama;
  return warna.sukses;
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: spasi.xl, gap: spasi.lg, paddingBottom: spasi.jumbo },
  judul: { color: warna.teks, ...teks.judul },
  subjudul: { color: warna.teksMati, ...teks.kecil, marginTop: -spasi.sm },
  grup: { gap: spasi.xs },
  label: { color: warna.teksRedup, ...teks.mikro },
  pilihan: { flexDirection: 'row', gap: spasi.sm },
  pil: {
    flex: 1,
    borderWidth: 1,
    borderColor: warna.garis,
    borderRadius: 10,
    paddingVertical: spasi.md,
    alignItems: 'center',
  },
  pilAktif: { borderColor: warna.utama, backgroundColor: 'rgba(14,165,233,0.12)' },
  pilTeks: { color: warna.teksRedup, ...teks.kecil },
  pilTeksAktif: { color: warna.teks, fontWeight: '600' },
  galat: { color: warna.bahaya, ...teks.mikro, fontWeight: '400' },
  kekuatan: { flexDirection: 'row', alignItems: 'center', gap: spasi.sm, marginTop: -spasi.sm },
  bilah: { flexDirection: 'row', gap: 4, flex: 1 },
  potong: { flex: 1, height: 4, borderRadius: 2 },
  labelKekuatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
  sukses: {
    flex: 1,
    backgroundColor: warna.latar,
    justifyContent: 'center',
    padding: spasi.xl,
    gap: spasi.md,
  },
  suksesJudul: { color: warna.sukses, ...teks.judul },
  suksesTeks: { color: warna.teksRedup, ...teks.isi, lineHeight: 22 },
  catatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', lineHeight: 16 },
});
