import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { mahasiswa, nilai } from './data/mahasiswa.js';
import { matakuliah } from './data/matakuliah.js';
import {
  filterSemester,
  hitungIpk,
  kelompokkanPerSemester,
  ringkas,
  sisaKuota,
  tentukanPredikat,
  totalSks,
  urutkanJadwal,
} from './utils/akademik.js';

/**
 * Layar Playground bab 3.
 *
 * Belum ada state dan belum ada tombol: semua hasil di bawah dihitung sekali
 * saat modul dimuat. Tujuannya bukan tampilan, melainkan bukti bahwa
 * `destructuring`, `filter`, `map`, `reduce`, dan `find` bekerja pada data nyata.
 */

const mkSemester5 = filterSemester(matakuliah, 5);
const jadwal = urutkanJadwal(mkSemester5);
const ipk = hitungIpk(nilai);
const perSemester = kelompokkanPerSemester(matakuliah);

// Destructuring bertingkat untuk data yang bentuknya sudah diketahui.
const { nama, nim, prodi } = mahasiswa;

export default function App() {
  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <Text style={styles.judul}>Playground JavaScript</Text>
      <Text style={styles.subjudul}>Bab 3 — JavaScript modern untuk React Native</Text>

      <Bagian judul="1. Destructuring">
        <Baris label="Nama" nilai={nama} />
        <Baris label="NIM" nilai={nim} />
        <Baris label="Prodi" nilai={prodi} />
      </Bagian>

      <Bagian judul="2. filter + map — mata kuliah semester 5">
        {mkSemester5.map((mk) => (
          <Text key={mk.kode} style={styles.baris}>
            {ringkas(mk)}
          </Text>
        ))}
      </Bagian>

      <Bagian judul="3. reduce — total SKS dan IPK">
        <Baris label="Total SKS semester 5" nilai={String(totalSks(mkSemester5))} />
        <Baris label={`IPK dari ${nilai.length} nilai`} nilai={ipk.toFixed(2)} />
        <Baris label="Predikat" nilai={tentukanPredikat(ipk)} />
      </Bagian>

      <Bagian judul="4. reduce — kelompok per semester">
        {Object.entries(perSemester).map(([semester, daftar]) => (
          <Text key={semester} style={styles.baris}>
            Semester {semester}: {daftar.length} mata kuliah, {totalSks(daftar)} SKS
          </Text>
        ))}
      </Bagian>

      <Bagian judul="5. sort — jadwal urut hari (tanpa mengubah data asli)">
        {jadwal.map((mk) => (
          <Text key={mk.kode} style={styles.baris}>
            {mk.hari} {mk.jam} · {mk.nama}
          </Text>
        ))}
      </Bagian>

      <Bagian judul="6. find + sisa kuota">
        {['SI502', 'SI501', 'SI999'].map((kode) => {
          const mk = filterSemester(matakuliah, 5).find((item) => item.kode === kode);
          if (mk === undefined) {
            return (
              <Text key={kode} style={styles.gagal}>
                {kode} tidak ditemukan — inilah gunanya memeriksa hasil find.
              </Text>
            );
          }
          return (
            <Text key={kode} style={styles.baris}>
              {mk.nama}: sisa {sisaKuota(mk)} dari {mk.kuota} kursi
            </Text>
          );
        })}
      </Bagian>

      <Text style={styles.kaki}>
        Latihan CLI: node latihan-predikat.js · node latihan-cari.js · node latihan-async.js
      </Text>

      <StatusBar style="light" />
    </ScrollView>
  );
}

/** Komponen kecil berulang supaya setiap bagian punya judul yang seragam. */
function Bagian({ judul, children }) {
  return (
    <View style={styles.bagian}>
      <Text style={styles.judulBagian}>{judul}</Text>
      {children}
    </View>
  );
}

function Baris({ label, nilai }) {
  return (
    <View style={styles.barisFlex}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.nilai}>{nilai}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#0f172a' },
  isi: { padding: 20, paddingBottom: 48 },
  judul: { fontSize: 24, fontWeight: '700', color: '#f8fafc' },
  subjudul: { fontSize: 13, color: '#94a3b8', marginTop: 4, marginBottom: 20 },
  bagian: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  judulBagian: { color: '#7dd3fc', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  baris: { color: '#e2e8f0', fontSize: 13, lineHeight: 21 },
  barisFlex: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  label: { color: '#94a3b8', fontSize: 13 },
  nilai: { color: '#e2e8f0', fontSize: 13, fontWeight: '600' },
  gagal: { color: '#fca5a5', fontSize: 13, lineHeight: 21 },
  kaki: { color: '#64748b', fontSize: 11, marginTop: 8, lineHeight: 16 },
});
