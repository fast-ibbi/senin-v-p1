import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ambilProfil, simpanProfil } from '../../../api/mahasiswa.js';
import { FormField } from '../../../components/FormField.js';
import { Tombol } from '../../../components/Tombol.js';
import { useAuth } from '../../../context/AuthContext.js';
import { mahasiswa as dataLokal } from '../../../data/mahasiswa.js';
import { useMuat } from '../../../hooks/useMuat.js';
import { spasi, teks, warna } from '../../../tema/desain.js';
import { validasiEmail } from '../../../utils/validators.js';

/**
 * Profil: GET saat dibuka, PUT saat disimpan.
 *
 * Perhatikan urutan yang benar:
 *   1. tampilkan data dari server (`useMuat`)
 *   2. salin ke state form **hanya sekali**, saat data pertama tiba
 *   3. kirim hanya field yang berubah
 *
 * Menyalin data server ke state form di setiap render akan menghapus ketikan
 * pengguna — kesalahan klasik yang sulit dilacak.
 */
export default function Profil() {
  const { keluar } = useAuth();
  const profil = useMuat(useCallback(({ sinyal }) => ambilProfil(dataLokal.nim, { sinyal }), []));

  const [telepon, setTelepon] = useState('');
  const [alamat, setAlamat] = useState('');
  const [galat, setGalat] = useState({});
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState(null);
  const [sekali, setSekali] = useState(false);

  useEffect(() => {
    if (profil.data && !sekali) {
      setTelepon(profil.data.telepon ?? '');
      setAlamat(profil.data.alamat ?? '');
      setSekali(true);
    }
  }, [profil.data, sekali]);

  const simpan = async () => {
    const hasilEmail = validasiEmail(profil.data?.email ?? '');
    const galatBaru = {};
    if (!hasilEmail.sah) galatBaru.email = hasilEmail.pesan;
    if (telepon.trim().length < 8) galatBaru.telepon = 'Nomor telepon minimal 8 karakter.';
    if (alamat.trim().length < 5) galatBaru.alamat = 'Alamat minimal 5 karakter.';
    setGalat(galatBaru);
    if (Object.keys(galatBaru).length > 0) return;

    setMenyimpan(true);
    setPesan(null);
    try {
      await simpanProfil(dataLokal.nim, { telepon, alamat });
      setPesan({ jenis: 'sukses', teks: 'Profil tersimpan di server.' });
      await profil.muatUlang();
    } catch (err) {
      setPesan({ jenis: 'galat', teks: err.message });
    } finally {
      setMenyimpan(false);
    }
  };

  if (profil.memuat && !profil.data) {
    return (
      <View style={styles.tengah}>
        <ActivityIndicator color={warna.utamaRedup} />
        <Text style={styles.statusTeks}>Memuat profil dari server…</Text>
      </View>
    );
  }

  if (profil.galat && !profil.data) {
    return (
      <View style={styles.tengah}>
        <Text style={styles.galatJudul}>Profil tidak bisa dimuat</Text>
        <Text style={styles.galatTeks}>{profil.galat.pesan}</Text>
        <Tombol judul="Coba lagi" varian="garis" onPress={profil.muatUlang} />
      </View>
    );
  }

  const data = profil.data ?? dataLokal;

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <View style={styles.kepala}>
        <View style={styles.avatar}>
          <Text style={styles.inisial}>{data.nama?.charAt(0) ?? '?'}</Text>
        </View>
        <Text style={styles.nama}>{data.nama}</Text>
        <Text style={styles.meta}>
          {data.nim} · {data.prodi}
        </Text>
      </View>

      <View style={styles.kartu}>
        <Pasangan label="Email" nilai={data.email} />
        <Pasangan label="Kelas" nilai={data.kelas ?? '—'} />
        <Pasangan label="Semester" nilai={String(data.semester)} />
      </View>

      <Text style={styles.judulBagian}>Ubah kontak (PUT /api/mahasiswa/:nim)</Text>

      <FormField
        label="Telepon"
        nilai={telepon}
        onChangeText={setTelepon}
        galat={galat.telepon}
        keyboardType="phone-pad"
      />
      <FormField
        label="Alamat"
        nilai={alamat}
        onChangeText={setAlamat}
        galat={galat.alamat}
        multiline
      />

      {pesan && (
        <Text style={[styles.pesan, pesan.jenis === 'galat' ? styles.pesanGalat : styles.pesanOk]}>
          {pesan.teks}
        </Text>
      )}

      <Tombol judul="Simpan profil" penuh memuat={menyimpan} onPress={simpan} />
      <Tombol judul="Keluar" varian="garis" penuh onPress={keluar} />

      <Text style={styles.catatan}>
        Bab 13 menambahkan token: setelah login, permintaan ini membawa header
        Authorization dan server menolak perubahan milik akun lain.
      </Text>
    </ScrollView>
  );
}

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
  tengah: {
    flex: 1,
    backgroundColor: warna.latar,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spasi.xl,
    gap: spasi.md,
  },
  statusTeks: { color: warna.teksMati, ...teks.kecil },
  galatJudul: { color: warna.bahaya, ...teks.subjudul },
  galatTeks: { color: warna.teksRedup, ...teks.kecil, textAlign: 'center' },
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
  judulBagian: { color: warna.utamaRedup, ...teks.mikro, marginTop: spasi.sm },
  pesan: { ...teks.kecil },
  pesanOk: { color: warna.sukses },
  pesanGalat: { color: warna.bahaya },
  catatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', lineHeight: 16 },
});
