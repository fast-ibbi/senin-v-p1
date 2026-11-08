// screens/KatalogScreen.js — satu layar, satu penggulir utama.
//
// Bab 5 subbab 2.9 + bagian 5: `FlatList` adalah penggulir utama halaman ini.
// Tidak ada `ScrollView` vertikal yang membungkusnya — itu yang membuat daftar
// panjang berhenti malas. Satu-satunya `ScrollView` di bawah sumbunya mendatar
// (baris chip), jadi tidak berebut kendali gulir dengan daftar.
import { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import ChipKategori from '../components/ChipKategori';
import KartuMenu from '../components/KartuMenu';
import { daftarKategori, menu } from '../data/menu';
import { breakpoint, huruf, jarak, radius, warna } from '../theme/warna';

export default function KatalogScreen({ keranjang, padaTambah }) {
  const [kataKunci, setKataKunci] = useState('');
  const [kategoriAktif, setKategoriAktif] = useState('Semua');

  // subbab 4.4: lebar jendela dibaca reaktif, bukan sekali di awal.
  const { width } = useWindowDimensions();

  const kolom = width >= breakpoint.tigaKolom ? 3 : width >= breakpoint.duaKolom ? 2 : 1;

  // Lebar satu kartu dihitung sendiri dari lebar jendela: ruang isi dikurangi
  // jarak antar-kolom, lalu dibagi jumlah kolom. Dipakai untuk membuat gambar
  // petak tetap persegi di semua lebar layar.
  const lebarKartu =
    kolom > 1
      ? Math.floor((width - jarak.sedang * 2 - jarak.sedang * (kolom - 1)) / kolom)
      : 0;

  // subbab 3.4 + 4.x: penyaringan ditulis sebagai dua syarat yang harus benar.
  const data = menu.filter((item) => {
    const cocokKategori = kategoriAktif === 'Semua' || item.kategori === kategoriAktif;
    const cocokKata = item.nama.toLowerCase().includes(kataKunci.trim().toLowerCase());
    return cocokKategori && cocokKata;
  });

  const jumlahDiKeranjang = (id) => {
    const baris = keranjang.find((b) => b.id === id);
    return baris ? baris.jumlah : 0;
  };

  return (
    <FlatList
      // Ganti `key` memaksa FlatList disusun ulang saat jumlah kolom berubah —
      // tanpa ini `numColumns` baru ikut berubah setelah layar digulir.
      key={String(kolom)}
      data={data}
      numColumns={kolom}
      keyExtractor={(item) => item.id}
      // `columnWrapperStyle` hanya berlaku untuk daftar berkolom.
      columnWrapperStyle={kolom > 1 ? gaya.baris : undefined}
      contentContainerStyle={gaya.isi}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ListHeaderComponent={
        <View style={gaya.kepala}>
          <Text style={gaya.sapaan}>Mau makan apa hari ini?</Text>

          <View style={gaya.alamat}>
            <Text style={gaya.labelAlamat}>Antar ke</Text>
            <Text style={gaya.isiAlamat}>Kos Melati, Jl. Gatot Subroto No. 12</Text>
            <Text style={gaya.ubah}>Ubah</Text>
          </View>

          <TextInput
            value={kataKunci}
            onChangeText={setKataKunci}
            placeholder="Cari masakan atau minuman"
            placeholderTextColor={warna.teksRedup}
            style={gaya.pencarian}
            accessibilityLabel="Cari menu"
          />

          {/* Sumbu mendatar: aman di dalam daftar vertikal. */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={gaya.barisChip}
          >
            {daftarKategori.map((label) => (
              <ChipKategori
                key={label}
                label={label}
                aktif={label === kategoriAktif}
                padaTekan={() => setKategoriAktif(label)}
              />
            ))}
          </ScrollView>
        </View>
      }
      renderItem={({ item }) => (
        <View style={kolom > 1 ? gaya.sel : undefined}>
          <KartuMenu
            {...item}
            lebar={width}
            lebarKartu={lebarKartu}
            jumlah={jumlahDiKeranjang(item.id)}
            padaTambah={padaTambah}
          />
        </View>
      )}
      ListEmptyComponent={
        <View style={gaya.kosong}>
          <Text style={gaya.teksKosong}>{`Tidak ada masakan yang cocok dengan "${kataKunci}"`}</Text>
          <Text style={gaya.petunjukKosong}>Coba kata lain atau pilih kategori Semua.</Text>
        </View>
      }
    />
  );
}

const gaya = StyleSheet.create({
  isi: { padding: jarak.sedang, gap: jarak.sedang, paddingBottom: jarak.besar },
  baris: { gap: jarak.sedang },
  sel: { flex: 1 },

  kepala: { gap: jarak.sedang, marginBottom: jarak.kecil },
  sapaan: { fontSize: huruf.besar, fontWeight: '700', color: warna.teks },

  alamat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: jarak.kecil,
    padding: jarak.sedang,
    borderRadius: radius.sedang,
    backgroundColor: warna.permukaan,
    borderWidth: 1,
    borderColor: warna.garis,
  },
  labelAlamat: { fontSize: huruf.kecil, color: warna.teksRedup },
  isiAlamat: { flex: 1, fontSize: huruf.kecil, color: warna.teks, fontWeight: '600' },
  ubah: { fontSize: huruf.kecil, color: warna.utama, fontWeight: '700' },

  pencarian: {
    borderWidth: 1,
    borderColor: warna.garis,
    borderRadius: radius.sedang,
    paddingHorizontal: jarak.sedang,
    paddingVertical: 12,
    fontSize: huruf.isi,
    color: warna.teks,
    backgroundColor: warna.permukaan,
  },

  barisChip: { gap: jarak.kecil, paddingVertical: 2 },

  kosong: { padding: jarak.besar, alignItems: 'center', gap: jarak.kecil },
  teksKosong: { fontSize: huruf.isi, color: warna.teks, textAlign: 'center' },
  petunjukKosong: { fontSize: huruf.kecil, color: warna.teksRedup, textAlign: 'center' },
});
