import { Image, StyleSheet, Text, View } from 'react-native';

import { formatRupiah, statusStok } from '../data/produk';
import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Satu kartu produk untuk layar katalog (layar 6).
//
// Tiga hal yang sengaja diperlihatkan di sini:
//   1. `Image` selalu diberi lebar dan tinggi eksplisit (subbab 2.3).
//   2. Warna label stok memakai gaya kondisional, bukan warna yang disimpan di state (subbab 3.3).
//   3. `require` dan `uri` sama-sama diterima lewat props `source` (subbab 2.3).
export default function KartuProduk({ produk }) {
  const status = statusStok(produk);

  return (
    <View style={styles.kartu}>
      <Image
        source={produk.gambar ? produk.gambar : { uri: produk.gambarUri }}
        style={styles.gambar}
        resizeMode="cover"
        accessibilityLabel={'Gambar ' + produk.nama}
      />

      <View style={styles.badan}>
        <Text style={styles.nama} numberOfLines={2}>
          {produk.nama}
        </Text>
        <Text style={styles.kategori}>{produk.kategori}</Text>
        <Text style={styles.harga}>{formatRupiah(produk.harga)}</Text>

        <View
          style={[
            styles.labelStok,
            status.jenis === 'habis' && styles.labelStokHabis,
            status.jenis === 'menipis' && styles.labelStokMenipis,
          ]}
        >
          <Text
            style={[
              styles.teksStok,
              status.jenis === 'habis' && styles.teksStokHabis,
              status.jenis === 'menipis' && styles.teksStokMenipis,
            ]}
          >
            {status.label}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    flex: 1,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
    overflow: 'hidden',
  },
  // Tanpa lebar dan tinggi eksplisit, gambar tidak akan muncul sama sekali —
  // React Native tidak menebak ukuran gambar.
  gambar: {
    width: '100%',
    height: 104,
  },
  badan: {
    padding: JARAK.md,
    gap: 2,
  },
  nama: {
    fontSize: TEKS.isi,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  kategori: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  harga: {
    fontSize: TEKS.isi,
    fontWeight: '600',
    color: WARNA.utama,
    marginTop: 2,
  },
  labelStok: {
    alignSelf: 'flex-start',
    marginTop: JARAK.sm,
    paddingVertical: 2,
    paddingHorizontal: JARAK.sm,
    borderRadius: RADIUS.bulat,
    backgroundColor: WARNA.suksesMuda,
  },
  labelStokHabis: {
    backgroundColor: WARNA.bahayaMuda,
  },
  labelStokMenipis: {
    backgroundColor: WARNA.peringatanMuda,
  },
  teksStok: {
    fontSize: TEKS.mungil,
    fontWeight: '700',
    color: WARNA.sukses,
  },
  teksStokHabis: {
    color: WARNA.bahaya,
  },
  teksStokMenipis: {
    color: WARNA.peringatan,
  },
});
