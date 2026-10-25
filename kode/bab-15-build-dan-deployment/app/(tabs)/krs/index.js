import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { batalkanKrs, ambilKrs, ubahKelasKrs } from '../../../api/krs.js';
import { ambilMatakuliah } from '../../../api/matakuliah.js';
import { Tombol } from '../../../components/Tombol.js';
import { mahasiswa } from '../../../data/mahasiswa.js';
import { useAuth } from '../../../context/AuthContext.js';
import { useKrs } from '../../../hooks/useKrs.js';
import { useMuat } from '../../../hooks/useMuat.js';
import { sisaKuota } from '../../../utils/akademik.js';
import { spasi, teks, warna } from '../../../tema/desain.js';

const NIM = mahasiswa.nim;

/**
 * Tab KRS setelah tersambung ke server.
 *
 * Dua sumber data, sengaja dibedakan:
 *   1. **Tersimpan** — hasil `GET /api/krs`. Ini kebenaran yang dipegang server.
 *      Setiap perubahan (PATCH kelas, DELETE) langsung dikirim, lalu daftar dimuat ulang.
 *   2. **Katalog** — hasil `GET /api/matakuliah`. Memilih di sini hanya menambah
 *      keranjang lokal (bab 9); pengiriman terjadi di layar Ringkasan.
 *
 * Itu sebabnya tombol "Ambil" di katalog tidak langsung memanggil server: keranjang
 * adalah draf, dan draf baru menjadi kenyataan saat dikirim.
 */
export default function Krs() {
  const { token } = useAuth();
  const { tambah, sudahDipilih, pilihan, totalSks, sisaSks } = useKrs();
  const [pesan, setPesan] = useState(null);
  const [sedangUbah, setSedangUbah] = useState(null);

  const tersimpan = useMuat(
    useCallback(({ sinyal }) => ambilKrs(NIM, { token, sinyal }), [token]),
  );
  const katalog = useMuat(
    useCallback(({ sinyal }) => ambilMatakuliah({ semester: mahasiswa.semester, sinyal }), []),
  );

  // Setiap kali tab kembali dilihat, daftar dari server dimuat ulang.
  useFocusEffect(
    useCallback(() => {
      tersimpan.muatUlang();
    }, [tersimpan.muatUlang]),
  );

  const ubahKelas = async (baris, kelas) => {
    setSedangUbah(baris.id);
    try {
      await ubahKelasKrs(baris.id, kelas, { token });
      setPesan({ jenis: 'sukses', teks: `${baris.nama ?? baris.kode} → kelas ${kelas}.` });
      await tersimpan.muatUlang();
    } catch (err) {
      setPesan({ jenis: 'galat', teks: err.message });
    } finally {
      setSedangUbah(null);
    }
  };

  const batalkan = async (baris) => {
    setSedangUbah(baris.id);
    try {
      await batalkanKrs(baris.id, { token });
      setPesan({ jenis: 'sukses', teks: `${baris.nama ?? baris.kode} dibatalkan di server.` });
      await tersimpan.muatUlang();
    } catch (err) {
      setPesan({ jenis: 'galat', teks: err.message });
    } finally {
      setSedangUbah(null);
    }
  };

  const tambahKeKeranjang = (mk) => {
    if (sudahDipilih(mk.kode)) {
      setPesan({ jenis: 'info', teks: `${mk.nama} sudah ada di keranjang.` });
      return;
    }
    const hasil = tambah(mk);
    setPesan({ jenis: hasil.ok ? 'sukses' : 'galat', teks: hasil.pesan });
  };

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      {/* 1. Keranjang lokal */}
      <View style={styles.ringkasan}>
        <View style={styles.barisRingkas}>
          <Text style={styles.labelRingkas}>Keranjang (belum dikirim)</Text>
          <Text style={styles.angkaRingkas}>{totalSks} SKS</Text>
        </View>
        <Text style={styles.sisa}>
          {pilihan.length} mata kuliah · sisa {sisaSks} SKS
        </Text>
        <Link href="/(tabs)/krs/ringkasan" asChild>
          <Tombol judul="Kirim keranjang ke server" varian="sekunder" penuh />
        </Link>
      </View>

      {pesan && (
        <Text style={[styles.pesan, pesan.jenis === 'galat' ? styles.pesanGalat : styles.pesanOk]}>
          {pesan.teks}
        </Text>
      )}

      {/* 2. Data dari server */}
      <Text style={styles.judulBagian}>Tersimpan di server</Text>

      {tersimpan.memuat && (
        <View style={styles.status}>
          <ActivityIndicator color={warna.utamaRedup} />
          <Text style={styles.statusTeks}>Memuat KRS dari server…</Text>
        </View>
      )}

      {tersimpan.galat && (
        <View style={styles.galatKotak}>
          <Text style={styles.galatJudul}>Gagal memuat KRS</Text>
          <Text style={styles.galatTeks}>{tersimpan.galat.pesan}</Text>
          <Tombol judul="Coba lagi" ukuran="sm" varian="garis" onPress={tersimpan.muatUlang} />
        </View>
      )}

      {tersimpan.data?.daftar?.length === 0 && (
        <Text style={styles.kosong}>Belum ada mata kuliah tersimpan. Kirim keranjang dulu.</Text>
      )}

      {(tersimpan.data?.daftar ?? []).map((baris) => (
        <View key={baris.id} style={[styles.baris, sedangUbah === baris.id && styles.barisSibuk]}>
          <View style={styles.info}>
            <Text style={styles.nama}>{baris.nama ?? baris.kode}</Text>
            <Text style={styles.meta}>
              {baris.kode} · {baris.sks} SKS · {baris.status}
            </Text>
          </View>

          <View style={styles.kelas}>
            {['A', 'B', 'C'].map((kelas) => (
              <Tombol
                key={kelas}
                judul={kelas}
                ukuran="sm"
                varian={baris.kelas === kelas ? 'utama' : 'garis'}
                onPress={() => ubahKelas(baris, kelas)}
                nonaktif={sedangUbah === baris.id}
              />
            ))}
            <Tombol
              judul="Batalkan"
              ukuran="sm"
              varian="teks"
              onPress={() => batalkan(baris)}
              nonaktif={sedangUbah === baris.id}
            />
          </View>
        </View>
      ))}

      {/* 3. Katalog */}
      <Text style={styles.judulBagian}>Katalog semester {mahasiswa.semester}</Text>

      {katalog.memuat && (
        <View style={styles.status}>
          <ActivityIndicator color={warna.utamaRedup} />
          <Text style={styles.statusTeks}>Memuat katalog…</Text>
        </View>
      )}

      {katalog.galat && (
        <View style={styles.galatKotak}>
          <Text style={styles.galatJudul}>Katalog tidak bisa dimuat</Text>
          <Text style={styles.galatTeks}>{katalog.galat.pesan}</Text>
          <Tombol judul="Coba lagi" ukuran="sm" varian="garis" onPress={katalog.muatUlang} />
        </View>
      )}

      {(katalog.data ?? []).map((mk) => {
        const dipilih = sudahDipilih(mk.kode);
        return (
          <Pressable
            key={mk.kode}
            onPress={() => tambahKeKeranjang(mk)}
            style={({ pressed }) => [styles.baris, dipilih && styles.barisDipilih, pressed && styles.ditekan]}
          >
            <View style={styles.info}>
              <Text style={styles.nama}>{mk.nama}</Text>
              <Text style={styles.meta}>
                {mk.kode} · {mk.sks} SKS · sisa {sisaKuota(mk)} kursi
              </Text>
            </View>
            <Text style={[styles.pilih, dipilih && styles.pilihAktif]}>
              {dipilih ? '✓' : '+'}
            </Text>
          </Pressable>
        );
      })}

      <Text style={styles.catatan}>
        Alamat API: `api/client.js`. Menjalankan server: `npm run api` di folder ini.
        Kalau gagal, cek pesan galat di atas — biasanya server belum hidup.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: spasi.lg, paddingBottom: spasi.xxxl, gap: spasi.sm },
  ringkasan: { backgroundColor: warna.permukaan, borderRadius: 12, padding: spasi.lg, gap: spasi.sm },
  barisRingkas: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  labelRingkas: { color: warna.teksRedup, ...teks.kecil },
  angkaRingkas: { color: warna.utamaRedup, ...teks.judul },
  sisa: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
  pesan: { ...teks.kecil, paddingVertical: spasi.xs },
  pesanOk: { color: warna.sukses },
  pesanGalat: { color: warna.bahaya },
  judulBagian: { color: warna.utamaRedup, ...teks.mikro, marginTop: spasi.md },
  status: { flexDirection: 'row', alignItems: 'center', gap: spasi.sm, paddingVertical: spasi.md },
  statusTeks: { color: warna.teksMati, ...teks.kecil },
  galatKotak: {
    borderWidth: 1,
    borderColor: warna.bahaya,
    borderRadius: 10,
    padding: spasi.md,
    gap: spasi.sm,
  },
  galatJudul: { color: warna.bahaya, ...teks.kecil, fontWeight: '600' },
  galatTeks: { color: warna.teksRedup, ...teks.mikro, fontWeight: '400', lineHeight: 16 },
  kosong: { color: warna.teksMati, ...teks.kecil, paddingVertical: spasi.md },
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
  barisSibuk: { opacity: 0.5 },
  ditekan: { opacity: 0.7 },
  info: { flex: 1, gap: 2 },
  nama: { color: warna.teks, ...teks.isi, fontWeight: '600' },
  meta: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
  kelas: { flexDirection: 'row', gap: spasi.xs, alignItems: 'center' },
  pilih: { color: warna.utamaRedup, fontSize: 20, fontWeight: '700', width: 24, textAlign: 'center' },
  pilihAktif: { color: warna.sukses },
  catatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', marginTop: spasi.md, lineHeight: 16 },
});
