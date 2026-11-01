import { useState } from 'react';
import {
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import BingkaiLayar from '../components/BingkaiLayar';
import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Layar 2 — Bagian 2.
//
// Enam komponen inti dengan label, masing-masing memperlihatkan perannya.
// ScrollView dan FlatList sengaja TIDAK ada di halaman ini: keduanya punya
// layar sendiri (layar 5), tepat seperti urutan slide.
export default function KomponenScreen({ onKembali }) {
  const [nama, setNama] = useState('');
  const [hitunganTekan, setHitunganTekan] = useState(0);

  return (
    <BingkaiLayar
      judul="Enam komponen inti dan perannya"
      rujukan="Bagian 2 · subbab 2.1–2.6"
      poin={[
        'View memegang, Text berbicara, Image menunjukkan, TextInput mendengar.',
        'Perhatikan: tidak ada teks yang ditulis langsung di dalam View.',
        'Image diberi lebar dan tinggi eksplisit — tanpa itu gambarnya tidak muncul.',
      ]}
      onKembali={onKembali}
    >
      <ScrollView contentContainerStyle={styles.isi} keyboardShouldPersistTaps="handled">
        <Contoh judul="View" subbab="subbab 2.1" catatan="Container tanpa teks di dalamnya.">
          <View style={styles.viewDemo}>
            <View style={styles.petakKecil} />
            <View style={styles.petakKecil} />
            <View style={styles.petakKecil} />
          </View>
        </Contoh>

        <Contoh judul="Text" subbab="subbab 2.2" catatan="Judul, isi, dan teks bersarang.">
          <Text style={styles.judulDemo}>Judul di dalam Text</Text>
          <Text style={styles.isiDemo}>
            Teks biasa, dan <Text style={styles.tebalDemo}>teks bersarang</Text> di dalamnya.
          </Text>
          <Text style={styles.isiDemo} numberOfLines={1}>
            numberOfLines memotong teks yang terlalu panjang menjadi satu baris.
          </Text>
        </Contoh>

        <Contoh
          judul="Image"
          subbab="subbab 2.3"
          catatan="Kiri: gambar di-bundle dengan require. Kanan: gambar dari URL, butuh internet."
        >
          <View style={styles.barisGambar}>
            <View style={styles.kolomGambar}>
              <Image
                source={require('../assets/produk/headphone.png')}
                style={styles.gambarDemo}
                resizeMode="cover"
                accessibilityLabel="Gambar lokal dari folder assets"
              />
              <Text style={styles.labelKecil}>require()</Text>
            </View>

            <View style={styles.kolomGambar}>
              <Image
                source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
                style={styles.gambarDemo}
                resizeMode="contain"
                accessibilityLabel="Gambar dari URL"
              />
              <Text style={styles.labelKecil}>uri (butuh internet)</Text>
            </View>
          </View>
        </Contoh>

        <Contoh
          judul="TextInput"
          subbab="subbab 2.4"
          catatan="Controlled component: nilai dikendalikan state, bukan disimpan sendiri oleh input."
        >
          <TextInput
            value={nama}
            onChangeText={setNama}
            placeholder="Ketik nama produk"
            placeholderTextColor={WARNA.tintaRedup}
            style={styles.inputDemo}
            accessibilityLabel="Contoh kotak isian nama produk"
          />
          <Text style={styles.labelKecil}>
            Nilai terbaca: {nama === '' ? '(kosong)' : nama}
          </Text>
        </Contoh>

        <Contoh
          judul="Button"
          subbab="subbab 2.5"
          catatan="Tombol bawaan platform: cepat dipakai, tetapi tampilannya tidak bisa ditata bebas."
        >
          <Button title="Tombol Button" onPress={() => {}} color={WARNA.utama} />
        </Contoh>

        <Contoh
          judul="Pressable"
          subbab="subbab 2.6"
          catatan="Bebas ditata; umpan balik tekanan diberikan lewat gaya fungsi."
        >
          <Pressable
            onPress={() => setHitunganTekan(hitunganTekan + 1)}
            accessibilityRole="button"
            accessibilityLabel="Contoh Pressable yang menghitung tekanan"
            style={({ pressed }) => [styles.pressableDemo, pressed && styles.pressableDemoTertekan]}
          >
            <Text style={styles.labelPressableDemo}>Tekan saya — {hitunganTekan} kali</Text>
          </Pressable>
        </Contoh>
      </ScrollView>
    </BingkaiLayar>
  );
}

function Contoh({ judul, subbab, catatan, children }) {
  return (
    <View style={styles.kartu}>
      <View style={styles.kepalaKartu}>
        <Text style={styles.judulKartu}>{judul}</Text>
        <Text style={styles.subbabKartu}>{subbab}</Text>
      </View>
      <View style={styles.contohIsi}>{children}</View>
      <Text style={styles.catatan}>{catatan}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  isi: {
    padding: JARAK.lg,
    gap: JARAK.md,
  },
  kartu: {
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
    padding: JARAK.md,
    gap: JARAK.sm,
  },
  kepalaKartu: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  judulKartu: {
    fontSize: TEKS.judul,
    fontWeight: '800',
    color: WARNA.tinta,
  },
  subbabKartu: {
    fontSize: TEKS.mungil,
    color: WARNA.utama,
  },
  contohIsi: {
    gap: JARAK.xs,
  },
  catatan: {
    fontSize: TEKS.kecil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
  viewDemo: {
    flexDirection: 'row',
    gap: JARAK.sm,
    backgroundColor: WARNA.latar,
    borderRadius: RADIUS.sm,
    padding: JARAK.sm,
  },
  petakKecil: {
    flex: 1,
    height: 34,
    borderRadius: RADIUS.sm,
    backgroundColor: WARNA.utamaMuda,
    borderWidth: 1,
    borderColor: WARNA.utama,
  },
  judulDemo: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  isiDemo: {
    fontSize: TEKS.isi,
    color: WARNA.tinta,
  },
  tebalDemo: {
    fontWeight: '800',
    color: WARNA.utama,
  },
  barisGambar: {
    flexDirection: 'row',
    gap: JARAK.md,
  },
  kolomGambar: {
    flex: 1,
    gap: JARAK.xs,
  },
  gambarDemo: {
    width: '100%',
    height: 84,
    borderRadius: RADIUS.sm,
    backgroundColor: WARNA.latar,
  },
  labelKecil: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  inputDemo: {
    borderWidth: 1,
    borderColor: WARNA.garis,
    borderRadius: RADIUS.sm,
    paddingVertical: JARAK.sm,
    paddingHorizontal: JARAK.md,
    fontSize: TEKS.isi,
    color: WARNA.tinta,
    backgroundColor: WARNA.latar,
  },
  pressableDemo: {
    alignSelf: 'flex-start',
    backgroundColor: WARNA.utama,
    borderRadius: RADIUS.bulat,
    paddingVertical: JARAK.sm,
    paddingHorizontal: JARAK.lg,
  },
  pressableDemoTertekan: {
    opacity: 0.7,
  },
  labelPressableDemo: {
    fontSize: TEKS.isi,
    fontWeight: '700',
    color: '#ffffff',
  },
});
