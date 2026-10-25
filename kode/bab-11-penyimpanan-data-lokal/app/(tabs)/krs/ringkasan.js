import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { simpanKrs } from '../../../api/krs.js';
import { Tombol } from '../../../components/Tombol.js';
import { mahasiswa } from '../../../data/mahasiswa.js';
import { useKrs } from '../../../hooks/useKrs.js';
import { spasi, teks, warna } from '../../../tema/desain.js';

/**
 * Mengirim keranjang ke server: satu POST per mata kuliah.
 *
 * Mengapa satu per satu, bukan satu kiriman berisi banyak?
 * Karena server memutuskan per mata kuliah: kuota bisa penuh, bisa bentrok
 * jadwal, bisa melewati batas SKS. Kalau dikirim sebagai satu paket, satu
 * kegagalan membatalkan semuanya dan mahasiswa tidak tahu mana yang bermasalah.
 *
 * Perhatikan `for...of` dengan `await` di dalamnya: pengiriman berurutan, supaya
 * pesan galat bisa ditampilkan sesuai urutan pilihan.
 */
export default function Ringkasan() {
  const { pilihan, totalSks, sisaSks, hapus } = useKrs();
  const [mengirim, setMengirim] = useState(false);
  const [hasil, setHasil] = useState(null);

  const kirim = async () => {
    setMengirim(true);
    const hasilPerItem = [];

    for (const baris of pilihan) {
      try {
        const tersimpan = await simpanKrs({
          nim: mahasiswa.nim,
          kode: baris.kode,
          kelas: baris.kelas,
        });
        hasilPerItem.push({ kode: baris.kode, ok: true, id: tersimpan.id });
        hapus(baris.kode);
      } catch (err) {
        hasilPerItem.push({ kode: baris.kode, ok: false, pesan: err.message });
      }
    }

    setMengirim(false);
    setHasil(hasilPerItem);
  };

  if (hasil) {
    const sukses = hasil.filter((baris) => baris.ok);
    const gagal = hasil.filter((baris) => !baris.ok);

    return (
      <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
        <Text style={styles.judulHasil}>
          {sukses.length} berhasil · {gagal.length} gagal
        </Text>

        {hasil.map((baris) => (
          <View key={baris.kode} style={styles.barisHasil}>
            <Text style={[styles.tanda, baris.ok ? styles.tandaOk : styles.tandaGagal]}>
              {baris.ok ? '✓' : '×'}
            </Text>
            <Text style={styles.teksHasil}>
              {baris.kode} {baris.ok ? `tersimpan sebagai ${baris.id}` : `— ${baris.pesan}`}
            </Text>
          </View>
        ))}

        <Tombol
          judul="Kembali ke KRS"
          penuh
          onPress={() => {
            setHasil(null);
            router.replace('/(tabs)/krs');
          }}
        />
      </ScrollView>
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
        <Text style={styles.label}>Akan dikirim</Text>
        <Text style={styles.total}>{totalSks} SKS</Text>
        <Text style={styles.sisa}>{pilihan.length} mata kuliah · sisa {sisaSks} SKS</Text>
      </View>

      {pilihan.map((baris) => (
        <View key={baris.kode} style={styles.baris}>
          <View style={styles.info}>
            <Text style={styles.nama}>{baris.kode}</Text>
            <Text style={styles.meta}>
              {baris.sks} SKS · kelas {baris.kelas}
            </Text>
          </View>
          <Tombol
            judul="Hapus"
            varian="teks"
            ukuran="sm"
            onPress={() => hapus(baris.kode)}
            nonaktif={mengirim}
          />
        </View>
      ))}

      <Tombol judul="Kirim ke server" penuh memuat={mengirim} onPress={kirim} />
      <Text style={styles.catatan}>
        Setiap baris menjadi `POST /api/krs`. Server bisa menolak satu per satu — perhatikan
        pesan yang muncul di ringkasan hasil.
      </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: warna.permukaan,
    borderRadius: 10,
    padding: spasi.md,
  },
  info: { flex: 1, gap: 2 },
  nama: { color: warna.teks, ...teks.isi, fontWeight: '600' },
  meta: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
  judulHasil: { color: warna.teks, ...teks.judul, marginBottom: spasi.sm },
  barisHasil: { flexDirection: 'row', gap: spasi.sm, alignItems: 'flex-start' },
  tanda: { fontSize: 16, fontWeight: '700', width: 20 },
  tandaOk: { color: warna.sukses },
  tandaGagal: { color: warna.bahaya },
  teksHasil: { color: warna.teksRedup, ...teks.kecil, flex: 1, lineHeight: 20 },
  kosong: {
    flex: 1,
    backgroundColor: warna.latar,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spasi.xl,
    gap: spasi.md,
  },
  kosongTeks: { color: warna.teksRedup, ...teks.isi },
  catatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', marginTop: spasi.sm, lineHeight: 16 },
});
