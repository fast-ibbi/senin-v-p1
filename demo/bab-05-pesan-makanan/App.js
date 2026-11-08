// App.js — satu sumber kebenaran untuk keranjang.
//
// Bab 5 subbab 2.10: data turun lewat props, kejadian naik lewat callback.
// Keranjang dipegang di sini, bukan di dalam layar, karena dua layar
// membutuhkannya sekaligus.
//
// Isi keranjang sengaja disimpan sebagai `{ id, jumlah }` saja, bukan salinan
// objek menu: kalau harga di data/menu.js berubah, keranjang ikut berubah.
import { useState } from 'react';
import { Platform, SafeAreaView, StatusBar as StatusBarRN, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import BilahRingkas from './components/BilahRingkas';
import KeranjangScreen from './screens/KeranjangScreen';
import KatalogScreen from './screens/KatalogScreen';
import { menu, ONGKIR } from './data/menu';
import { warna } from './theme/warna';

export default function App() {
  const [keranjang, setKeranjang] = useState([]); // [{ id, jumlah }]
  const [keranjangTerbuka, setKeranjangTerbuka] = useState(false);
  const [terkirim, setTerkirim] = useState(false);
  // Total dikunci saat pesanan dikirim, karena keranjangnya langsung dikosongkan.
  const [totalDibayar, setTotalDibayar] = useState(0);

  // Gabungkan isi keranjang dengan data menu, lalu hitung turunannya.
  const butir = keranjang.map((baris) => {
    const masakan = menu.find((item) => item.id === baris.id);
    return { ...masakan, jumlah: baris.jumlah };
  });

  const jumlahItem = butir.reduce((jumlah, b) => jumlah + b.jumlah, 0);
  const total = butir.reduce((jumlah, b) => jumlah + b.harga * b.jumlah, 0);

  function tambah(id) {
    setKeranjang((lama) => {
      const sudahAda = lama.find((baris) => baris.id === id);

      if (sudahAda) {
        return lama.map((baris) =>
          baris.id === id ? { ...baris, jumlah: baris.jumlah + 1 } : baris
        );
      }

      return [...lama, { id, jumlah: 1 }];
    });
  }

  // Jumlah 0 berarti barisnya dibuang, bukan disimpan sebagai nol.
  function kurang(id) {
    setKeranjang((lama) =>
      lama
        .map((baris) => (baris.id === id ? { ...baris, jumlah: baris.jumlah - 1 } : baris))
        .filter((baris) => baris.jumlah > 0)
    );
  }

  function pesan() {
    // Bilah bawah hanya menghitung harga masakan; ongkir baru masuk di sini.
    setTotalDibayar(total + ONGKIR);
    setTerkirim(true);
    setKeranjang([]);
  }

  function pesanLagi() {
    setTerkirim(false);
    setKeranjangTerbuka(false);
  }

  return (
    <SafeAreaView style={gaya.akar}>
      {keranjangTerbuka ? (
        <KeranjangScreen
          butir={butir}
          terkirim={terkirim}
          totalDibayar={totalDibayar}
          padaTambah={tambah}
          padaKurang={kurang}
          padaKembali={() => setKeranjangTerbuka(false)}
          padaPesan={pesan}
          padaPesanLagi={pesanLagi}
        />
      ) : (
        <View style={gaya.isi}>
          <KatalogScreen
            keranjang={keranjang}
            padaTambah={tambah}
          />

          {/* Bilah bawah hanya muncul kalau ada isinya. */}
          {jumlahItem > 0 && (
            <BilahRingkas
              jumlahItem={jumlahItem}
              total={total}
              padaBuka={() => setKeranjangTerbuka(true)}
            />
          )}
        </View>
      )}

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  akar: {
    flex: 1,
    backgroundColor: warna.latar,
    // SafeAreaView bawaan hanya bekerja di iOS. Di Android, status bar tetap
    // menimpa konten kalau tidak diberi jarak sendiri — lihat Bab 5 subbab 5.5.
    paddingTop: Platform.OS === 'android' ? StatusBarRN.currentHeight : 0,
  },
  isi: { flex: 1 },
});
