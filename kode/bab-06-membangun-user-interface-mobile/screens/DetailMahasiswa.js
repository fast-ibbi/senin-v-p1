import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Tombol } from '../components/Tombol.js';
import { radius, spasi, teks, warna } from '../tema/desain.js';

/**
 * Detail satu mahasiswa: profil di atas, pasangan label–nilai di tengah,
 * tindakan di bawah.
 *
 * Pasangan label–nilai adalah pola yang dipakai berulang di aplikasi ini
 * (detail mata kuliah, rincian KRS, halaman profil), jadi dibuat satu komponen
 * kecil di dalam berkas ini.
 */
export function DetailMahasiswa({ mhs, onKembali }) {
  if (!mhs) {
    return (
      <View style={styles.layar}>
        <Text style={styles.kosong}>Pilih satu mahasiswa dari daftar terlebih dahulu.</Text>
      </View>
    );
  }

  const { nama, nim, prodi, angkatan, semester, ipk, email, telepon, alamat } = mhs;

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <Pressable onPress={onKembali} accessibilityRole="button" style={styles.kembali}>
        <Text style={styles.kembaliTeks}>‹ Daftar mahasiswa</Text>
      </Pressable>

      <View style={styles.profil}>
        <View style={styles.avatar}>
          <Text style={styles.inisial}>{nama.charAt(0)}</Text>
        </View>
        <Text style={styles.nama}>{nama}</Text>
        <Text style={styles.meta}>
          {nim} · {prodi}
        </Text>
        <View style={styles.lencana}>
          <Text style={styles.lencanaTeks}>IPK {ipk.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>Identitas</Text>
        <Pasangan label="Program studi" nilai={prodi} />
        <Pasangan label="Angkatan" nilai={String(angkatan)} />
        <Pasangan label="Semester" nilai={String(semester)} />
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>Kontak</Text>
        <Pasangan label="Email" nilai={email} />
        <Pasangan label="Telepon" nilai={telepon} />
        <Pasangan label="Alamat" nilai={alamat} />
      </View>

      <View style={styles.tindakan}>
        <Tombol judul="Ubah data" varian="utama" penuh onPress={() => {}} />
        <Tombol judul="Hapus" varian="garis" penuh onPress={() => {}} />
        <Text style={styles.catatan}>
          Di latihan ini kedua tombol belum melakukan apa pun. Tindakan sesungguhnya
          dipasang di bab 10 (REST) dan bab 13 (hak akses).
        </Text>
      </View>
    </ScrollView>
  );
}

/** Satu baris label–nilai; label lebar tetap supaya semua nilai rata kiri. */
function Pasangan({ label, nilai }) {
  return (
    <View style={styles.pasangan}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.nilai}>{nilai}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: spasi.lg, paddingBottom: spasi.xxxl, gap: spasi.md },
  kembali: { alignSelf: 'flex-start' },
  kembaliTeks: { color: warna.utamaRedup, ...teks.kecil },
  profil: { alignItems: 'center', gap: spasi.xs, paddingVertical: spasi.md },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.pil,
    backgroundColor: warna.utama,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spasi.sm,
  },
  inisial: { color: warna.teks, fontSize: 28, fontWeight: '700' },
  nama: { color: warna.teks, ...teks.judul },
  meta: { color: warna.teksRedup, ...teks.kecil },
  lencana: {
    marginTop: spasi.sm,
    backgroundColor: 'rgba(14,165,233,0.12)',
    borderRadius: radius.pil,
    paddingHorizontal: spasi.md,
    paddingVertical: spasi.xs,
  },
  lencanaTeks: { color: warna.utamaRedup, ...teks.mikro },
  kartu: {
    backgroundColor: warna.permukaan,
    borderRadius: radius.md,
    padding: spasi.lg,
    gap: spasi.sm,
  },
  judulKartu: { color: warna.utamaRedup, ...teks.mikro, marginBottom: spasi.xs },
  pasangan: { flexDirection: 'row', gap: spasi.md },
  label: { color: warna.teksMati, ...teks.kecil, width: 110 },
  nilai: { color: warna.teks, ...teks.kecil, flex: 1 },
  tindakan: { gap: spasi.sm, marginTop: spasi.sm },
  catatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', lineHeight: 16 },
  kosong: { color: warna.teksMati, ...teks.isi, padding: spasi.xl, textAlign: 'center' },
});
