import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

import BingkaiLayar from '../components/BingkaiLayar';
import KartuProduk from '../components/KartuProduk';
import { DAFTAR_PRODUK } from '../data/produk';
import { BREAKPOINT_LEBAR, JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Layar 6 — Praktikum Integrasi.
//
// Semua isi bab bertemu di sini: komponen inti (View, Text, Image, TextInput),
// StyleSheet dan gaya kondisional (lewat KartuProduk), Flexbox (grid), dan
// FlatList sebagai satu-satunya scroller.
//
// Perhatikan `key={jumlahKolom}`: saat numColumns berubah, daftar harus dibangun
// ulang dari awal, dan mengubah key adalah cara standarnya.
export default function KatalogScreen({ onKembali }) {
  const [kataKunci, setKataKunci] = useState('');
  const { width } = useWindowDimensions();

  const jumlahKolom = width >= BREAKPOINT_LEBAR ? 3 : 2;

  const hasilSaring = DAFTAR_PRODUK.filter((produk) => {
    const kunci = kataKunci.trim().toLowerCase();
    if (kunci === '') return true;
    return (
      produk.nama.toLowerCase().includes(kunci) ||
      produk.kategori.toLowerCase().includes(kunci)
    );
  });

  return (
    <BingkaiLayar
      judul="Katalog produk responsif"
      rujukan="Praktikum Integrasi · penutup Bab 5"
      poin={[
        'Grid memakai numColumns ' + jumlahKolom + ' pada lebar ' + Math.round(width) + ' — berubah pada 600.',
        'key={jumlahKolom} memaksa daftar dibangun ulang saat jumlah kolom berubah.',
        'Satu scroller saja: FlatList. Tidak ada ScrollView yang membungkusnya.',
      ]}
      onKembali={onKembali}
    >
      <View style={styles.kepala}>
        <TextInput
          value={kataKunci}
          onChangeText={setKataKunci}
          placeholder="Cari nama atau kategori produk"
          placeholderTextColor={WARNA.tintaRedup}
          style={styles.input}
          accessibilityLabel="Pencarian produk"
        />
        <Text style={styles.ringkasan}>
          {hasilSaring.length} dari {DAFTAR_PRODUK.length} produk · {jumlahKolom} kolom
        </Text>
      </View>

      <FlatList
        key={jumlahKolom}
        data={hasilSaring}
        keyExtractor={(produk) => produk.id}
        numColumns={jumlahKolom}
        columnWrapperStyle={styles.barisKolom}
        contentContainerStyle={styles.isiDaftar}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.kosong}>
            <Text style={styles.judulKosong}>Tidak ada produk yang cocok</Text>
            <Text style={styles.teksKosong}>
              Coba kata kunci lain. Untuk keadaan seperti inilah ListEmptyComponent dipakai,
              bukan indikator pemuatan.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.sel}>
            <KartuProduk produk={item} />
          </View>
        )}
      />
    </BingkaiLayar>
  );
}

const styles = StyleSheet.create({
  kepala: {
    paddingHorizontal: JARAK.lg,
    paddingTop: JARAK.md,
    gap: JARAK.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: WARNA.garis,
    borderRadius: RADIUS.sm,
    paddingVertical: JARAK.sm,
    paddingHorizontal: JARAK.md,
    fontSize: TEKS.isi,
    color: WARNA.tinta,
    backgroundColor: WARNA.permukaan,
  },
  ringkasan: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  isiDaftar: {
    padding: JARAK.lg,
    gap: JARAK.md,
  },
  barisKolom: {
    gap: JARAK.md,
  },
  sel: {
    flex: 1,
  },
  kosong: {
    alignItems: 'center',
    gap: JARAK.xs,
    paddingVertical: JARAK.xl,
    paddingHorizontal: JARAK.lg,
  },
  judulKosong: {
    fontSize: TEKS.judul,
    fontWeight: '800',
    color: WARNA.tinta,
  },
  teksKosong: {
    fontSize: TEKS.kecil,
    lineHeight: 18,
    textAlign: 'center',
    color: WARNA.tintaRedup,
  },
});
