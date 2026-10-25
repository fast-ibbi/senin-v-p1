import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Tombol } from '../../../../components/Tombol.js';
import { cariMatakuliah } from '../../../../data/matakuliah.js';
import { ringkas, sisaKuota } from '../../../../utils/akademik.js';
import { spasi, teks, warna } from '../../../../tema/desain.js';

/**
 * Rute dinamis: `app/(tabs)/beranda/matakuliah/[kode].js` menangani alamat
 * `/beranda/matakuliah/SI501`.
 *
 * Nama berkas di dalam kurung siku menjadi nama parameter. Nilainya selalu
 * berupa **string** — kalau butuh angka, konversi sendiri (`Number(...)`).
 */
export default function DetailMatakuliah() {
  const { kode } = useLocalSearchParams();
  const router = useRouter();

  const mk = cariMatakuliah(kode);

  if (!mk) {
    return (
      <View style={styles.layar}>
        <Text style={styles.kosong}>
          Mata kuliah dengan kode {String(kode)} tidak ditemukan. Kembali dan pilih dari
          daftar jadwal.
        </Text>
        <Tombol judul="Kembali ke jadwal" varian="garis" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <Text style={styles.kode}>{mk.kode}</Text>
      <Text style={styles.nama}>{mk.nama}</Text>
      <Text style={styles.meta}>{ringkas(mk)}</Text>

      <View style={styles.kartu}>
        <Pasangan label="Dosen" nilai={mk.dosen} />
        <Pasangan label="Jadwal" nilai={`${mk.hari}, ${mk.jam}`} />
        <Pasangan label="Ruang" nilai={mk.ruang} />
        <Pasangan label="Kuota" nilai={`${mk.terisi} dari ${mk.kuota} terisi`} />
        <Pasangan label="Sisa kursi" nilai={String(sisaKuota(mk))} />
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>Deskripsi</Text>
        <Text style={styles.deskripsi}>{mk.deskripsi}</Text>
      </View>

      <Tombol judul="Ambil mata kuliah ini" penuh onPress={() => {}} />
      <Text style={styles.catatan}>
        Tombol ini belum menyimpan apa pun. Bab 9 membuat keranjang KRS, bab 10 mengirimnya
        ke server sebagai `POST /api/krs`.
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
  kode: { color: warna.utamaRedup, ...teks.mikro },
  nama: { color: warna.teks, ...teks.judul, marginTop: -spasi.sm },
  meta: { color: warna.teksMati, ...teks.kecil },
  kartu: { backgroundColor: warna.permukaan, borderRadius: 12, padding: spasi.lg, gap: spasi.sm },
  judulKartu: { color: warna.utamaRedup, ...teks.mikro },
  deskripsi: { color: warna.teksRedup, ...teks.kecil, lineHeight: 20 },
  pasangan: { flexDirection: 'row', gap: spasi.md },
  label: { color: warna.teksMati, ...teks.kecil, width: 96 },
  nilai: { color: warna.teks, ...teks.kecil, flex: 1 },
  catatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', lineHeight: 16 },
  kosong: { color: warna.teksRedup, ...teks.isi, padding: spasi.xl, textAlign: 'center' },
});
