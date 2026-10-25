import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Tombol } from '../../../components/Tombol.js';
import { cariMatakuliah } from '../../../data/matakuliah.js';
import { useKrs } from '../../../hooks/useKrs.js';
import { spasi, teks, warna } from '../../../tema/desain.js';

/**
 * Ringkasan KRS: daftar pilihan, ubah kelas, dan satu tombol kirim.
 *
 * `ubahKelas` memperlihatkan pembaruan state secara immutable: baris yang diubah
 * diganti objek baru (`{ ...baris, kelas }`), baris lain dibiarkan. Tidak ada
 * `baris.kelas = 'B'` di mana pun — kalau ada, React tidak tahu ada yang berubah.
 */
export default function Ringkasan() {
  const { pilihan, totalSks, sisaSks, hapus, ubahKelas, bersihkan } = useKrs();
  const [terkirim, setTerkirim] = useState(false);

  if (terkirim) {
    return (
      <View style={styles.sukses}>
        <Text style={styles.suksesJudul}>KRS tercatat</Text>
        <Text style={styles.suksesTeks}>
          {pilihan.length} mata kuliah, {totalSks} SKS. Masih di memori — belum ada yang
          dikirim ke server.
        </Text>
        <Tombol
          judul="Kembali ke katalog"
          penuh
          onPress={() => {
            bersihkan();
            setTerkirim(false);
            router.replace('/(tabs)/krs');
          }}
        />
      </View>
    );
  }

  if (pilihan.length === 0) {
    return (
      <View style={styles.kosong}>
        <Text style={styles.kosongTeks}>Keranjang KRS masih kosong.</Text>
        <Tombol judul="Pilih mata kuliah" varian="garis" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <View style={styles.kartuTotal}>
        <Text style={styles.label}>Total SKS</Text>
        <Text style={styles.total}>{totalSks}</Text>
        <Text style={styles.sisa}>sisa {sisaSks} SKS dari batas 24</Text>
      </View>

      {pilihan.map((baris) => {
        const mk = cariMatakuliah(baris.kode);
        return (
          <View key={baris.kode} style={styles.baris}>
            <View style={styles.barisAtas}>
              <View style={styles.info}>
                <Text style={styles.nama}>{mk?.nama ?? baris.kode}</Text>
                <Text style={styles.meta}>
                  {baris.kode} · {baris.sks} SKS · {mk?.hari} {mk?.jam}
                </Text>
              </View>
              <Tombol
                judul="Hapus"
                varian="teks"
                ukuran="sm"
                onPress={() => hapus(baris.kode)}
              />
            </View>

            <View style={styles.kelas}>
              <Text style={styles.labelKelas}>Kelas</Text>
              {['A', 'B', 'C'].map((kelas) => {
                const aktif = baris.kelas === kelas;
                return (
                  <Tombol
                    key={kelas}
                    judul={kelas}
                    ukuran="sm"
                    varian={aktif ? 'utama' : 'garis'}
                    onPress={() => ubahKelas(baris.kode, kelas)}
                  />
                );
              })}
            </View>
          </View>
        );
      })}

      <Tombol judul="Kirim KRS" penuh onPress={() => setTerkirim(true)} />
      <Tombol judul="Kosongkan keranjang" varian="teks" penuh onPress={bersihkan} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: spasi.lg, paddingBottom: spasi.xxxl, gap: spasi.sm },
  kartuTotal: {
    backgroundColor: warna.permukaan,
    borderRadius: 12,
    padding: spasi.lg,
    alignItems: 'center',
    marginBottom: spasi.sm,
  },
  label: { color: warna.teksMati, ...teks.mikro },
  total: { color: warna.utamaRedup, fontSize: 32, fontWeight: '700' },
  sisa: { color: warna.teksRedup, ...teks.mikro, fontWeight: '400' },
  baris: {
    backgroundColor: warna.permukaan,
    borderRadius: 10,
    padding: spasi.md,
    gap: spasi.sm,
  },
  barisAtas: { flexDirection: 'row', alignItems: 'flex-start', gap: spasi.sm },
  info: { flex: 1, gap: 2 },
  nama: { color: warna.teks, ...teks.isi, fontWeight: '600' },
  meta: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
  kelas: { flexDirection: 'row', alignItems: 'center', gap: spasi.sm },
  labelKelas: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', marginRight: spasi.xs },
  kosong: {
    flex: 1,
    backgroundColor: warna.latar,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spasi.xl,
    gap: spasi.md,
  },
  kosongTeks: { color: warna.teksRedup, ...teks.isi },
  sukses: {
    flex: 1,
    backgroundColor: warna.latar,
    justifyContent: 'center',
    padding: spasi.xl,
    gap: spasi.md,
  },
  suksesJudul: { color: warna.sukses, ...teks.judul },
  suksesTeks: { color: warna.teksRedup, ...teks.isi, lineHeight: 22 },
});
