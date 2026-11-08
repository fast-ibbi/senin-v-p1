import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

// Avatar mahasiswa.
//
// Rujukan slide Bab 5:
//   • subbab 2.3 — `Image` wajib diberi lebar dan tinggi eksplisit; tanpa itu
//     gambarnya tidak muncul sama sekali (bukan sekadar kecil).
//   • subbab 2.3 — `source` menerima `require('...')` untuk berkas yang dibundel
//     dan `{ uri: '...' }` untuk gambar dari jaringan. Di sini dipakai `uri`.
//   • subbab 3.3 — jatuh ke inisial saat foto kosong atau gagal dimuat; ini juga
//     contoh state lokal yang mengubah tampilan.
//
// Ukuran avatar berbeda-beda per layar, jadi lebar/tinggi/radius dihitung dari
// props. Objek gaya dinamis seperti ini wajar; yang dihindari adalah menulis
// ulang seluruh StyleSheet di dalam render (subbab 3.1).

const PALET = ['#1d4ed8', '#0f766e', '#7c3aed', '#b45309', '#be123c'];

function inisial(nama) {
  const kata = nama.trim().split(/\s+/);
  const depan = kata[0] ? kata[0][0] : '';
  const belakang = kata.length > 1 ? kata[kata.length - 1][0] : '';
  return (depan + belakang).toUpperCase();
}

export default function AvatarPlaceholder({ nama, ukuran = 48, fotoUri = null }) {
  const [gagalDimuat, setGagalDimuat] = useState(false);

  const bingkai = {
    width: ukuran,
    height: ukuran,
    borderRadius: ukuran / 2,
  };

  if (fotoUri && !gagalDimuat) {
    return (
      <Image
        source={{ uri: fotoUri }}
        style={[styles.gambar, bingkai]}
        resizeMode="cover"
        onError={() => setGagalDimuat(true)}
        accessibilityLabel={'Foto ' + nama}
      />
    );
  }

  const latar = PALET[nama.length % PALET.length];

  return (
    <View style={[styles.kotak, bingkai, { backgroundColor: latar }]}>
      <Text style={[styles.huruf, { fontSize: ukuran * 0.34 }]}>{inisial(nama)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gambar: {
    backgroundColor: '#dbe3ec',
  },
  kotak: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  huruf: {
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
