import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';

import { kirimPresensi } from '../api/presensi.js';
import { Tombol } from './Tombol.js';
import { spasi, teks, warna } from '../tema/desain.js';
import { bukaPengaturan, pastikanIzin } from '../utils/polaIzin.js';

/**
 * Kartu presensi: izin → koordinat → server.
 *
 * Tiga hal yang jarang ditulis di tutorial, tetapi selalu muncul di lapangan:
 *   1. Izin bisa ditolak permanen → harus ada jalan ke pengaturan.
 *   2. GPS butuh waktu → tombol harus menunjukkan proses, bukan diam.
 *   3. Server bisa menolak (di luar radius) → pesannya ditampilkan apa adanya,
 *      bukan diganti "terjadi kesalahan".
 */
export function KartuPresensi({ nim, kode = 'SI501', nama = 'Pemrograman Mobile' }) {
  const [status, setStatus] = useState('idle'); // idle | meminta | mengirim | sukses | galat
  const [pesan, setPesan] = useState(null);
  const [perluPengaturan, setPerluPengaturan] = useState(false);
  const [jarak, setJarak] = useState(null);

  const presensi = async () => {
    setPesan(null);
    setJarak(null);
    setStatus('meminta');

    const izin = await pastikanIzin({
      jenis: 'lokasi',
      statusSekarang: (await Location.getForegroundPermissionsAsync()).status,
      minta: () => Location.requestForegroundPermissionsAsync(),
    });

    if (!izin.diizinkan) {
      setStatus('galat');
      setPesan(izin.pesan);
      setPerluPengaturan(izin.perluPengaturan);
      return;
    }

    setStatus('mengirim');
    try {
      // Akurasi "Balanced" cukup untuk radius 500 m dan jauh lebih cepat di dalam ruangan.
      const posisi = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const hasil = await kirimPresensi({
        nim,
        kode,
        latitude: posisi.coords.latitude,
        longitude: posisi.coords.longitude,
      });

      setStatus('sukses');
      setJarak(hasil.jarakMeter);
      setPesan(`Presensi ${nama} tercatat pada ${hasil.data.jam}.`);
    } catch (err) {
      setStatus('galat');
      setPesan(err.message);
    }
  };

  return (
    <View style={styles.kartu}>
      <View style={styles.kepala}>
        <Text style={styles.judul}>Presensi hari ini</Text>
        <Text style={styles.meta}>{nama} · {kode}</Text>
      </View>

      {pesan && (
        <Text style={[styles.pesan, status === 'galat' ? styles.pesanGalat : styles.pesanOk]}>
          {pesan}
          {jarak !== null ? ` Jarak dari kampus: ${jarak} m.` : ''}
        </Text>
      )}

      {status === 'meminta' || status === 'mengirim' ? (
        <View style={styles.memuat}>
          <ActivityIndicator color={warna.utamaRedup} />
          <Text style={styles.meta}>
            {status === 'meminta' ? 'Meminta izin lokasi…' : 'Mengambil koordinat GPS…'}
          </Text>
        </View>
      ) : (
        <Tombol
          judul={status === 'sukses' ? 'Presensi lagi' : 'Presensi sekarang'}
          varian={status === 'sukses' ? 'sekunder' : 'utama'}
          penuh
          onPress={presensi}
        />
      )}

      {perluPengaturan && (
        <Tombol judul="Buka pengaturan" varian="teks" penuh onPress={bukaPengaturan} />
      )}

      <Text style={styles.catatan}>
        Titik kampus: 3.5952, 98.6722 · radius 500 m · diputuskan server, bukan aplikasi.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: { backgroundColor: warna.permukaan, borderRadius: 12, padding: spasi.lg, gap: spasi.sm },
  kepala: { gap: 2 },
  judul: { color: warna.utamaRedup, ...teks.mikro },
  meta: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
  pesan: { ...teks.kecil, lineHeight: 20 },
  pesanOk: { color: warna.sukses },
  pesanGalat: { color: warna.bahaya },
  memuat: { flexDirection: 'row', alignItems: 'center', gap: spasi.sm, paddingVertical: spasi.sm },
  catatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', lineHeight: 16 },
});
