import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { ambilProfil, simpanProfil } from '../../../api/mahasiswa.js';
import { FormField } from '../../../components/FormField.js';
import { Tombol } from '../../../components/Tombol.js';
import { useAuth } from '../../../context/AuthContext.js';
import { mahasiswa as dataLokal } from '../../../data/mahasiswa.js';
import { useMuat } from '../../../hooks/useMuat.js';
import { spasi, teks, warna } from '../../../tema/desain.js';
import { validasiEmail } from '../../../utils/validators.js';
import { bukaPengaturan, pastikanIzin } from '../../../utils/polaIzin.js';

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
  const { keluar, token } = useAuth();
  const profil = useMuat(
    useCallback(({ sinyal }) => ambilProfil(dataLokal.nim, { token, sinyal }), [token]),
  );

  const [telepon, setTelepon] = useState('');
  const [alamat, setAlamat] = useState('');
  const [galat, setGalat] = useState({});
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState(null);
  const [sekali, setSekali] = useState(false);
  const [foto, setFoto] = useState(null);
  const [sibukFoto, setSibukFoto] = useState(false);
  const [pesanFoto, setPesanFoto] = useState(null);
  const [izinDiblokir, setIzinDiblokir] = useState(false);

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
      await simpanProfil(dataLokal.nim, { telepon, alamat }, { token });
      setPesan({ jenis: 'sukses', teks: 'Profil tersimpan di server.' });
      await profil.muatUlang();
    } catch (err) {
      setPesan({ jenis: 'galat', teks: err.message });
    } finally {
      setMenyimpan(false);
    }
  };

  /**
   * Mengambil foto profil dari kamera atau galeri.
   *
   * `base64: true` dipakai supaya gambar bisa langsung dikirim sebagai data URI
   * ke server praktikum ini (tanpa layanan penyimpanan berkas). Untuk aplikasi
   * sungguhan, unggah berkasnya dan simpan URL-nya — JSON berisi base64 membuat
   * respons cepat membengkak.
   */
  const pilihFoto = async (sumber) => {
    setPesanFoto(null);
    setIzinDiblokir(false);

    const modulIzin =
      sumber === 'kamera'
        ? {
            jenis: 'kamera',
            statusSekarang: (await ImagePicker.getCameraPermissionsAsync()).status,
            minta: () => ImagePicker.requestCameraPermissionsAsync(),
          }
        : {
            jenis: 'kamera',
            statusSekarang: (await ImagePicker.getMediaLibraryPermissionsAsync()).status,
            minta: () => ImagePicker.requestMediaLibraryPermissionsAsync(),
          };

    const izin = await pastikanIzin(modulIzin);
    if (!izin.diizinkan) {
      setPesanFoto(izin.pesan);
      setIzinDiblokir(izin.perluPengaturan);
      return;
    }

    setSibukFoto(true);
    try {
      const hasil =
        sumber === 'kamera'
          ? await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.4,
              base64: true,
            })
          : await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.4,
              base64: true,
            });

      if (hasil.canceled) {
        setPesanFoto('Pengambilan foto dibatalkan.');
        return;
      }

      const aset = hasil.assets[0];
      const dataUri = `data:${aset.mimeType ?? 'image/jpeg'};base64,${aset.base64}`;
      setFoto(dataUri);

      await simpanProfil(dataLokal.nim, { foto: dataUri }, { token });
      setPesanFoto({ jenis: 'sukses', teks: 'Foto profil tersimpan di server.' });
      await profil.muatUlang();
    } catch (err) {
      setPesanFoto({ jenis: 'galat', teks: err.message });
    } finally {
      setSibukFoto(false);
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
        {foto ?? data.foto ? (
          <Image source={{ uri: foto ?? data.foto }} style={styles.foto} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.inisial}>{data.nama?.charAt(0) ?? '?'}</Text>
          </View>
        )}

        <Text style={styles.nama}>{data.nama}</Text>
        <Text style={styles.meta}>
          {data.nim} · {data.prodi}
        </Text>

        <View style={styles.barisFoto}>
          <Tombol
            judul="Kamera"
            ukuran="sm"
            varian="sekunder"
            memuat={sibukFoto}
            onPress={() => pilihFoto('kamera')}
          />
          <Tombol
            judul="Galeri"
            ukuran="sm"
            varian="garis"
            nonaktif={sibukFoto}
            onPress={() => pilihFoto('galeri')}
          />
        </View>

        {pesanFoto && (
          <Text style={[styles.pesan, typeof pesanFoto === 'string' || pesanFoto.jenis === 'galat' ? styles.pesanGalat : styles.pesanOk]}>
            {typeof pesanFoto === 'string' ? pesanFoto : pesanFoto.teks}
          </Text>
        )}

        {izinDiblokir && (
          <Tombol judul="Buka pengaturan izin" varian="teks" onPress={bukaPengaturan} />
        )}
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
  foto: { width: 72, height: 72, borderRadius: 999, marginBottom: spasi.sm, backgroundColor: warna.permukaan },
  barisFoto: { flexDirection: 'row', gap: spasi.sm, marginTop: spasi.sm },
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
