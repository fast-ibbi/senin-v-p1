import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import AvatarPlaceholder from '../components/AvatarPlaceholder';
import BarisInfo from '../components/BarisInfo';
import LabelStatus from '../components/LabelStatus';
import TombolAksi from '../components/TombolAksi';
import {
  DAFTAR_MATA_KULIAH,
  cariMahasiswa,
  formatIPK,
  predikatAkademik,
} from '../data/mahasiswa';
import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

const BATAS_CATATAN = 200;

// Detail mahasiswa — tempat paling banyak komponen inti bertemu.
//
// Rujukan slide Bab 5:
//   • subbab 2.3 — `Image` (lewat AvatarPlaceholder) dengan ukuran eksplisit.
//   • subbab 2.7 — `TextInput` catatan sebagai controlled component; penghitung
//     karakter adalah nilai turunan, bukan state tambahan.
//   • subbab 3.2 — array style dipakai untuk keadaan tombol dan label.
//   • subbab 5.1 — `ScrollView` dipakai karena isinya konten statis satu
//     mahasiswa (bukan daftar panjang), dengan `contentContainerStyle` untuk
//     jarak di dalam area gulir.
//   • subbab 5.5 — `keyboardShouldPersistTaps` supaya tombol Simpan langsung
//     merespons saat papan ketik terbuka.
export default function DetailMahasiswaScreen({ mahasiswaId, onKembali }) {
  const mahasiswa = cariMahasiswa(mahasiswaId);

  const [catatan, setCatatan] = useState('');
  const [tersimpan, setTersimpan] = useState(false);

  if (!mahasiswa) {
    return (
      <View style={styles.tidakDitemukan}>
        <Text style={styles.judul}>Mahasiswa tidak ditemukan</Text>
        <TombolAksi label="Kembali" onPress={onKembali} jenis="kedua" />
      </View>
    );
  }

  const predikat = predikatAkademik(mahasiswa.ipk);
  const sisaKarakter = BATAS_CATATAN - catatan.length;

  const simpanCatatan = () => {
    if (catatan.trim() === '') return;
    setTersimpan(true);
  };

  return (
    <ScrollView
      style={styles.layar}
      contentContainerStyle={styles.isi}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={onKembali}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Kembali ke daftar mahasiswa"
        style={({ pressed }) => [styles.kembali, pressed && styles.kembaliDitekan]}
      >
        <Text style={styles.teksKembali}>‹ Kembali</Text>
      </Pressable>

      <View style={styles.kartuProfil}>
        <AvatarPlaceholder
          nama={mahasiswa.nama}
          ukuran={72}
          fotoUri={mahasiswa.fotoUri}
        />

        <View style={styles.identitas}>
          <Text style={styles.nama}>{mahasiswa.nama}</Text>
          <Text style={styles.meta}>
            {mahasiswa.nim} · {mahasiswa.prodi}
          </Text>
          <View style={styles.barisLabel}>
            <LabelStatus label={predikat.label} jenis={predikat.jenis} />
            <LabelStatus
              label={mahasiswa.status}
              jenis={mahasiswa.status === 'Aktif' ? 'baik' : 'netral'}
            />
          </View>
        </View>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>Ringkasan akademik</Text>
        <BarisInfo label="IPK" nilai={formatIPK(mahasiswa.ipk)} />
        <BarisInfo label="SKS lulus" nilai={mahasiswa.sksLulus + ' SKS'} />
        <BarisInfo label="Angkatan" nilai={String(mahasiswa.angkatan)} />
        <BarisInfo label="Pembimbing akademik" nilai={mahasiswa.pembimbing} />
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>Mata kuliah semester ini</Text>
        {DAFTAR_MATA_KULIAH.map((mataKuliah) => (
          <View key={mataKuliah.id} style={styles.barisMk}>
            <View style={styles.teksMk}>
              <Text style={styles.namaMk} numberOfLines={1}>
                {mataKuliah.nama}
              </Text>
              <Text style={styles.metaMk}>
                {mataKuliah.kode} · {mataKuliah.dosen}
              </Text>
            </View>
            <LabelStatus label={mataKuliah.sks + ' SKS'} jenis="netral" />
          </View>
        ))}
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>Catatan bimbingan</Text>
        <Text style={styles.petunjuk}>
          Ketik catatan untuk mahasiswa ini. Teks di kotak dipegang state, bukan oleh
          komponen input itu sendiri.
        </Text>

        <TextInput
          style={styles.catatan}
          value={catatan}
          onChangeText={(teks) => {
            setCatatan(teks);
            setTersimpan(false);
          }}
          placeholder="Contoh: siapkan proposal skripsi sebelum bimbingan berikutnya."
          placeholderTextColor={WARNA.tintaRedup}
          multiline
          maxLength={BATAS_CATATAN}
          textAlignVertical="top"
          accessibilityLabel="Catatan bimbingan"
        />

        <View style={styles.kakiCatatan}>
          {/* Nilai turunan: dihitung dari panjang teks, tanpa state terpisah. */}
          <Text style={[styles.penghitung, sisaKarakter <= 20 && styles.penghitungBahaya]}>
            {catatan.length}/{BATAS_CATATAN}
          </Text>
          <TombolAksi
            label="Simpan catatan"
            onPress={simpanCatatan}
            jenis={catatan.trim() === '' ? 'kedua' : 'utama'}
          />
        </View>

        {tersimpan && (
          <View style={styles.konfirmasi}>
            <Text style={styles.teksKonfirmasi}>
              Catatan tersimpan di layar ini ({catatan.length} karakter). Project ini belum
              memakai penyimpanan permanen — itu bahan Bab 11.
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.catatanKaki}>
        Layar ini memakai ScrollView, bukan FlatList: isinya satu profil dengan jumlah
        komponen tetap, jadi seluruh anak boleh dirender sekaligus.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: {
    flex: 1,
    backgroundColor: WARNA.latar,
  },
  isi: {
    padding: JARAK.lg,
    paddingBottom: JARAK.xxl,
    gap: JARAK.md,
  },
  tidakDitemukan: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: JARAK.md,
    padding: JARAK.xl,
    backgroundColor: WARNA.latar,
  },
  kembali: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  kembaliDitekan: {
    opacity: 0.6,
  },
  teksKembali: {
    fontSize: TEKS.isi,
    fontWeight: '600',
    color: WARNA.utama,
  },
  kartuProfil: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: JARAK.lg,
    padding: JARAK.lg,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  identitas: {
    flex: 1,
    gap: 3,
  },
  nama: {
    fontSize: TEKS.judulLayar,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  meta: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  barisLabel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: JARAK.xs,
    marginTop: 2,
  },
  kartu: {
    gap: JARAK.xs,
    padding: JARAK.lg,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  judulKartu: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.tinta,
    marginBottom: JARAK.xs,
  },
  barisMk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: JARAK.sm,
    paddingVertical: 6,
  },
  teksMk: {
    flex: 1,
    gap: 1,
  },
  namaMk: {
    fontSize: TEKS.isi,
    fontWeight: '600',
    color: WARNA.tinta,
  },
  metaMk: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  petunjuk: {
    fontSize: TEKS.kecil,
    lineHeight: 18,
    color: WARNA.tintaRedup,
    marginBottom: JARAK.xs,
  },
  catatan: {
    minHeight: 88,
    padding: JARAK.md,
    fontSize: TEKS.isi,
    lineHeight: 20,
    color: WARNA.tinta,
    backgroundColor: WARNA.latar,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  kakiCatatan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: JARAK.sm,
  },
  penghitung: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  penghitungBahaya: {
    color: WARNA.bahaya,
    fontWeight: '700',
  },
  konfirmasi: {
    padding: JARAK.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: WARNA.suksesMuda,
  },
  teksKonfirmasi: {
    fontSize: TEKS.mungil,
    lineHeight: 16,
    color: WARNA.sukses,
  },
  catatanKaki: {
    fontSize: TEKS.mungil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
  judul: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.tinta,
  },
});
