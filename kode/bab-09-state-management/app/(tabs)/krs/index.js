import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Tombol } from '../../../components/Tombol.js';
import { mahasiswa } from '../../../data/mahasiswa.js';
import { matakuliah } from '../../../data/matakuliah.js';
import { useKrs } from '../../../hooks/useKrs.js';
import { filterSemester, sisaKuota } from '../../../utils/akademik.js';
import { spasi, teks, warna } from '../../../tema/desain.js';

/**
 * Tab KRS — katalog + keranjang.
 *
 * Semua angka di bawah berasal dari `useKrs()`: jumlah MK, total SKS, sisa SKS.
 * Layar ini tidak menyimpan pilihan sendiri, sehingga tab Beranda bisa membaca
 * angka yang sama tanpa saling mengirim props.
 */
const DITAWARKAN = filterSemester(matakuliah, mahasiswa.semester);

export default function Krs() {
  const { pilihan, tambah, hapus, totalSks, sisaSks, sudahDipilih } = useKrs();
  const [pesan, setPesan] = useState(null);

  const tangani = (mk) => {
    const hasil = sudahDipilih(mk.kode) ? { ok: true } : tambah(mk);
    if (sudahDipilih(mk.kode)) {
      hapus(mk.kode);
      setPesan({ jenis: 'info', teks: `${mk.nama} dibatalkan.` });
      return;
    }
    setPesan({ jenis: hasil.ok ? 'sukses' : 'galat', teks: hasil.pesan });
  };

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      {/* Ringkasan keranjang */}
      <View style={styles.ringkasan}>
        <View style={styles.barisRingkas}>
          <Text style={styles.labelRingkas}>SKS dipilih</Text>
          <Text style={styles.angkaRingkas}>
            {totalSks} <Text style={styles.angkaKecil}>/ 24</Text>
          </Text>
        </View>
        <View style={styles.bilah}>
          <View style={[styles.terisi, { width: `${Math.min(100, (totalSks / 24) * 100)}%` }]} />
        </View>
        <Text style={styles.sisa}>
          {pilihan.length} mata kuliah · sisa {sisaSks} SKS
        </Text>

        <Link href="/(tabs)/krs/ringkasan" asChild>
          <Tombol judul="Lihat ringkasan KRS" varian="sekunder" penuh />
        </Link>
      </View>

      {pesan && (
        <Text style={[styles.pesan, pesan.jenis === 'galat' ? styles.pesanGalat : styles.pesanOk]}>
          {pesan.teks}
        </Text>
      )}

      {DITAWARKAN.map((mk) => {
        const dipilih = sudahDipilih(mk.kode);
        const habis = sisaKuota(mk) === 0;

        return (
          <View key={mk.kode} style={[styles.baris, dipilih && styles.barisDipilih]}>
            <View style={styles.info}>
              <Text style={styles.nama}>{mk.nama}</Text>
              <Text style={styles.meta}>
                {mk.kode} · {mk.sks} SKS · {mk.hari} {mk.jam}
              </Text>
              <Text style={[styles.kursi, habis && styles.kursiHabis]}>
                {habis ? 'Kuota penuh' : `Sisa ${sisaKuota(mk)} kursi`}
              </Text>
            </View>

            <Pressable
              onPress={() => tangani(mk)}
              accessibilityRole="button"
              accessibilityLabel={dipilih ? `Batalkan ${mk.nama}` : `Ambil ${mk.nama}`}
              style={({ pressed }) => [
                styles.tombolPilih,
                dipilih && styles.tombolBatal,
                pressed && styles.tombolDitekan,
              ]}
            >
              <Text style={[styles.teksPilih, dipilih && styles.teksBatal]}>
                {dipilih ? 'Batalkan' : 'Ambil'}
              </Text>
            </Pressable>
          </View>
        );
      })}

      <Text style={styles.catatan}>
        Pilihan ini masih di memori. Bab 10 mengirimnya ke server, bab 11 menyimpannya
        sebagai draf, bab 13 memastikan hanya pemilik token yang bisa mengubahnya.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: spasi.lg, paddingBottom: spasi.xxxl, gap: spasi.sm },
  ringkasan: {
    backgroundColor: warna.permukaan,
    borderRadius: 12,
    padding: spasi.lg,
    gap: spasi.sm,
    marginBottom: spasi.sm,
  },
  barisRingkas: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  labelRingkas: { color: warna.teksRedup, ...teks.kecil },
  angkaRingkas: { color: warna.utamaRedup, ...teks.judul },
  angkaKecil: { color: warna.teksMati, ...teks.kecil },
  bilah: { height: 6, backgroundColor: warna.garis, borderRadius: 3, overflow: 'hidden' },
  terisi: { height: 6, backgroundColor: warna.utama },
  sisa: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
  pesan: { ...teks.kecil, paddingVertical: spasi.xs },
  pesanOk: { color: warna.sukses },
  pesanGalat: { color: warna.bahaya },
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spasi.md,
    backgroundColor: warna.permukaan,
    borderRadius: 10,
    padding: spasi.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  barisDipilih: { borderColor: warna.utama },
  info: { flex: 1, gap: 2 },
  nama: { color: warna.teks, ...teks.isi, fontWeight: '600' },
  meta: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
  kursi: { color: warna.teksRedup, ...teks.mikro, fontWeight: '400', marginTop: 2 },
  kursiHabis: { color: warna.bahaya },
  tombolPilih: {
    borderWidth: 1,
    borderColor: warna.utama,
    borderRadius: 8,
    paddingHorizontal: spasi.md,
    paddingVertical: spasi.sm,
  },
  tombolBatal: { borderColor: warna.bahaya },
  tombolDitekan: { opacity: 0.7 },
  teksPilih: { color: warna.utamaRedup, ...teks.mikro },
  teksBatal: { color: warna.bahaya },
  catatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', marginTop: spasi.md, lineHeight: 16 },
});
