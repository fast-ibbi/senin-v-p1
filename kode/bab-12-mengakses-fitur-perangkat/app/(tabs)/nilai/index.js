import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Tombol } from '../../../components/Tombol.js';
import { mahasiswa } from '../../../data/mahasiswa.js';
import { useNilai } from '../../../hooks/useNilai.js';
import { spasi, teks, warna } from '../../../tema/desain.js';

/**
 * Tab Nilai — sekarang dengan cache.
 *
 * Tiga keadaan yang ditampilkan dengan jujur:
 *   - data dari jaringan        → tidak ada penanda khusus
 *   - data dari cache           → lencana "cache · 12 menit lalu"
 *   - gagal total (tanpa cache) → kotak galat + tombol coba lagi
 *
 * Memalsukan keadaan "selalu terisi" akan menyembunyikan bug yang justru ingin
 * kamu lihat saat praktikum.
 */
export default function Nilai() {
  const { data, sumber, umurTeks, kedaluwarsa, memuat, galat, muatUlang } = useNilai(
    mahasiswa.nim,
  );

  const perSemester = useMemo(() => {
    const daftar = data?.daftar ?? [];
    return daftar.reduce((kelompok, baris) => {
      const isi = kelompok[baris.semester] ?? [];
      return { ...kelompok, [baris.semester]: [...isi, baris] };
    }, {});
  }, [data]);

  if (memuat && !data) {
    return (
      <View style={styles.tengah}>
        <ActivityIndicator color={warna.utamaRedup} />
        <Text style={styles.statusTeks}>Memuat nilai…</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.tengah}>
        <Text style={styles.galatJudul}>Nilai tidak bisa dimuat</Text>
        <Text style={styles.galatTeks}>
          {galat?.pesan ?? 'Belum ada data dan belum ada snapshot di perangkat.'}
        </Text>
        <Tombol judul="Coba lagi" varian="garis" onPress={muatUlang} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      {sumber === 'cache' && (
        <View style={[styles.lencana, kedaluwarsa && styles.lencanaUsang]}>
          <Text style={styles.lencanaTeks}>
            Dari cache · {umurTeks}
            {kedaluwarsa ? ' · sudah lewat 6 jam' : ''}
          </Text>
        </View>
      )}

      {galat && (
        <View style={styles.galatKotak}>
          <Text style={styles.galatJudul}>Gagal memperbarui dari server</Text>
          <Text style={styles.galatTeks}>{galat.pesan}</Text>
          <Tombol judul="Coba lagi" ukuran="sm" varian="garis" onPress={muatUlang} />
        </View>
      )}

      <View style={styles.ringkasan}>
        <Kotak label="IPK" nilai={data.ipk.toFixed(2)} />
        <Kotak label="SKS lulus" nilai={String(data.totalSks)} />
        <Kotak label="Mata kuliah" nilai={String(data.daftar.length)} />
      </View>

      {Object.entries(perSemester)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([semester, daftar]) => (
          <View key={semester} style={styles.kartu}>
            <Text style={styles.judulKartu}>
              Semester {semester} · {daftar.reduce((n, b) => n + b.sks, 0)} SKS
            </Text>
            {daftar.map((baris) => (
              <View key={baris.id} style={styles.baris}>
                <View style={styles.info}>
                  <Text style={styles.nama}>{baris.nama}</Text>
                  <Text style={styles.meta}>
                    {baris.kode} · {baris.sks} SKS
                  </Text>
                </View>
                <Text style={[styles.huruf, warnaHuruf(baris.nilaiHuruf)]}>
                  {baris.nilaiHuruf}
                </Text>
              </View>
            ))}
          </View>
        ))}

      <Tombol judul="Muat ulang dari server" varian="garis" penuh memuat={memuat} onPress={muatUlang} />
      <Text style={styles.catatan}>
        Matikan server (`Ctrl+C` di terminal `npm run api`), lalu tekan "Muat ulang":
        nilai tetap tampil dan lencana cache muncul. Itulah gunanya snapshot.
      </Text>
    </ScrollView>
  );
}

function Kotak({ label, nilai }) {
  return (
    <View style={styles.kotak}>
      <Text style={styles.angka}>{nilai}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function warnaHuruf(huruf) {
  if (huruf.startsWith('A')) return { color: warna.sukses };
  if (huruf.startsWith('B')) return { color: warna.utamaRedup };
  return { color: warna.peringatan };
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: spasi.lg, paddingBottom: spasi.xxxl, gap: spasi.md },
  tengah: {
    flex: 1,
    backgroundColor: warna.latar,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spasi.xl,
    gap: spasi.md,
  },
  statusTeks: { color: warna.teksMati, ...teks.kecil },
  galatJudul: { color: warna.bahaya, ...teks.subjudul },
  galatTeks: { color: warna.teksRedup, ...teks.kecil, textAlign: 'center' },
  galatKotak: {
    borderWidth: 1,
    borderColor: warna.bahaya,
    borderRadius: 10,
    padding: spasi.md,
    gap: spasi.sm,
  },
  lencana: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(14,165,233,0.12)',
    borderRadius: 999,
    paddingHorizontal: spasi.md,
    paddingVertical: spasi.xs,
  },
  lencanaUsang: { backgroundColor: 'rgba(251,191,36,0.14)' },
  lencanaTeks: { color: warna.utamaRedup, ...teks.mikro },
  ringkasan: { flexDirection: 'row', gap: spasi.sm },
  kotak: {
    flex: 1,
    backgroundColor: warna.permukaan,
    borderRadius: 10,
    padding: spasi.md,
    alignItems: 'center',
    gap: 2,
  },
  angka: { color: warna.utamaRedup, ...teks.subjudul },
  label: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
  kartu: { backgroundColor: warna.permukaan, borderRadius: 12, padding: spasi.lg, gap: spasi.sm },
  judulKartu: { color: warna.utamaRedup, ...teks.mikro, marginBottom: spasi.xs },
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spasi.sm,
    borderTopWidth: 1,
    borderTopColor: warna.garis,
  },
  info: { flex: 1 },
  nama: { color: warna.teks, ...teks.isi },
  meta: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', marginTop: 2 },
  huruf: { ...teks.subjudul, fontWeight: '700' },
  catatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', lineHeight: 16 },
});
