import { useRef } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import BingkaiLayar from '../components/BingkaiLayar';
import { DAFTAR_PRODUK, formatRupiah } from '../data/produk';
import { BREAKPOINT_LEBAR, JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Layar 4 — Bagian 4.
//
// Dua panel yang berpindah dari column ke row saat lebar jendela melewati 600.
// Angka "jumlah render" sengaja ditampilkan: ia membuktikan bahwa
// useWindowDimensions memicu render ulang, bukan mengukur sekali di awal
// (rujukan slide: subbab 4.8, salah paham "mengukur sekali di useState awal").
export default function ResponsifScreen({ onKembali }) {
  const { width, height } = useWindowDimensions();
  const lebar = Math.round(width);

  const jumlahRender = useRef(0);
  jumlahRender.current += 1;

  const lebarLayar = lebar >= BREAKPOINT_LEBAR;
  const susunan = lebarLayar ? 'row' : 'column';

  const totalKategori = new Set(DAFTAR_PRODUK.map((p) => p.kategori)).size;
  const produkHabis = DAFTAR_PRODUK.filter((p) => p.stok === 0).length;
  const nilaiStok = DAFTAR_PRODUK.reduce((jumlah, p) => jumlah + p.harga * p.stok, 0);

  return (
    <BingkaiLayar
      judul="Dua panel yang menyesuaikan lebar jendela"
      rujukan="Bagian 4 · subbab 4.7–4.10"
      poin={[
        'Putar perangkat atau ubah lebar jendela: susunan panel berubah tanpa memuat ulang.',
        'flexDirection berganti dari column ke row saat lebar melewati 600.',
        'Angka "jumlah render" bertambah — bukti hook ini reaktif, bukan sekali ukur.',
      ]}
      onKembali={onKembali}
    >
      <ScrollView contentContainerStyle={styles.isi}>
        <View style={styles.kartuUkur}>
          <BarisUkur label="lebar × tinggi" nilai={lebar + ' × ' + Math.round(height)} />
          <BarisUkur label="breakpoint" nilai={String(BREAKPOINT_LEBAR)} />
          <BarisUkur label="flexDirection" nilai={susunan} />
          <BarisUkur label="jumlah render" nilai={String(jumlahRender.current)} />
        </View>

        <View style={[styles.panggung, { flexDirection: susunan }]}>
          <View style={styles.panel}>
            <Text style={styles.labelPanel}>PANEL PERTAMA</Text>
            <Text style={styles.judulPanel}>Ringkasan katalog</Text>
            <Text style={styles.angkaPanel}>{DAFTAR_PRODUK.length} produk</Text>
            <Text style={styles.catatanPanel}>
              Tersebar di {totalKategori} kategori. Harga, nama, dan status dihitung ulang
              setiap render dari satu sumber data.
            </Text>
          </View>

          <View style={styles.panel}>
            <Text style={styles.labelPanel}>PANEL KEDUA</Text>
            <Text style={styles.judulPanel}>Nilai stok</Text>
            <Text style={styles.angkaPanel}>{formatRupiah(nilaiStok)}</Text>
            <Text style={styles.catatanPanel}>
              {produkHabis} produk sedang habis. Kedua panel memakai flex: 1, jadi lebarnya
              dibagi rata dikurangi gap dan padding.
            </Text>
          </View>
        </View>

        <View style={styles.kartuCatatan}>
          <Text style={styles.judulCatatan}>Kenapa bukan Dimensions.get()</Text>
          <Text style={styles.teksCatatan}>
            Dimensions.get() memberi angka saat dipanggil saja. Kalau nilainya disimpan sekali
            di awal, memutar perangkat tidak mengubah apa pun. useWindowDimensions mengembalikan
            angka terbaru dan memicu render ulang setiap kali jendela berubah.
          </Text>
        </View>
      </ScrollView>
    </BingkaiLayar>
  );
}

function BarisUkur({ label, nilai }) {
  return (
    <View style={styles.barisUkur}>
      <Text style={styles.labelUkur}>{label}</Text>
      <Text style={styles.nilaiUkur}>{nilai}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  isi: {
    padding: JARAK.lg,
    gap: JARAK.md,
  },
  kartuUkur: {
    backgroundColor: '#1e293b',
    borderRadius: RADIUS.md,
    padding: JARAK.md,
    gap: JARAK.xs,
  },
  barisUkur: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelUkur: {
    fontSize: TEKS.kecil,
    color: '#94a3b8',
  },
  nilaiUkur: {
    fontSize: TEKS.kecil,
    fontFamily: 'Courier',
    fontWeight: '700',
    color: '#e2e8f0',
  },
  panggung: {
    // gap dan flex: 1 dipakai supaya kedua panel berbagi ruang tanpa lebar tetap.
    gap: JARAK.md,
  },
  panel: {
    flex: 1,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
    padding: JARAK.lg,
    gap: JARAK.xs,
  },
  labelPanel: {
    fontSize: TEKS.mungil,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: WARNA.utama,
  },
  judulPanel: {
    fontSize: TEKS.judul,
    fontWeight: '800',
    color: WARNA.tinta,
  },
  angkaPanel: {
    fontSize: TEKS.judulLayar + 4,
    fontWeight: '800',
    color: WARNA.tinta,
  },
  catatanPanel: {
    fontSize: TEKS.kecil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
  kartuCatatan: {
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: WARNA.peringatan,
    padding: JARAK.md,
    gap: JARAK.xs,
  },
  judulCatatan: {
    fontSize: TEKS.isi,
    fontWeight: '800',
    color: WARNA.tinta,
  },
  teksCatatan: {
    fontSize: TEKS.kecil,
    lineHeight: 18,
    color: WARNA.tinta,
  },
});
