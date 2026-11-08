import { useRef } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import AvatarPlaceholder from '../components/AvatarPlaceholder';
import KartuStatistik from '../components/KartuStatistik';
import TombolAksi from '../components/TombolAksi';
import {
  DAFTAR_MAHASISWA,
  formatIPK,
  hitungRingkasan,
  peringkatIpk,
  predikatAkademik,
  sebaranProdi,
} from '../data/mahasiswa';
import { BREAKPOINT_LEBAR, JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Beranda — dashboard kampus.
//
// Rujukan slide Bab 5:
//   • Bagian 4 — dua panel berpindah susunan dari `column` menjadi `row` saat
//     lebar jendela melewati breakpoint; nilainya dibaca ulang setiap jendela
//     berubah lewat `useWindowDimensions()`, bukan sekali ukur di awal.
//   • subbab 3.4 — semua warna dan jarak dari theme/warna.js.
//   • subbab 4.5 — pakai `flex: 1` dan `gap`, bukan lebar/tinggi tetap.
export default function BerandaScreen({ onBukaMahasiswa, onBukaDetail, onBukaKatalog }) {
  const { width } = useWindowDimensions();
  const lebar = Math.round(width);
  const lebarLayar = lebar >= BREAKPOINT_LEBAR;
  const susunan = lebarLayar ? 'row' : 'column';

  // Penghitung render ini sengaja ditampilkan: ia membuktikan hook di atas
  // mengembalikan nilai terbaru, bukan angka hasil pengukuran sekali di awal.
  const jumlahRender = useRef(0);
  jumlahRender.current += 1;

  const ringkasan = hitungRingkasan(DAFTAR_MAHASISWA);
  const sebaran = sebaranProdi(DAFTAR_MAHASISWA);
  const terbaik = peringkatIpk(DAFTAR_MAHASISWA);

  return (
    <ScrollView
      style={styles.layar}
      contentContainerStyle={styles.isi}
      showsVerticalScrollIndicator={false}
    >
      {/* Kepala layar: gambar lokal lewat require (subbab 2.3). */}
      <View style={styles.kepala}>
        <Image
          source={require('../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Logo SIAKAD Mobile"
        />
        <View style={styles.kepalaTeks}>
          <Text style={styles.judulAplikasi}>SIAKAD Mobile</Text>
          <Text style={styles.subJudul}>Manajemen Data Mahasiswa</Text>
        </View>
      </View>

      <View style={styles.barisUkur}>
        <LabelUkur label="layar" nilai={lebar + ' px'} />
        <LabelUkur label="breakpoint" nilai={String(BREAKPOINT_LEBAR)} />
        <LabelUkur label="flexDirection" nilai={susunan} />
        <LabelUkur label="render" nilai={'ke-' + jumlahRender.current} />
      </View>

      <View style={styles.barisKartu}>
        <KartuStatistik angka={String(ringkasan.total)} label="Mahasiswa aktif" />
        <KartuStatistik
          angka={formatIPK(ringkasan.rataIpk)}
          label="Rata-rata IPK"
          aksen={WARNA.sukses}
        />
        <KartuStatistik
          angka={String(ringkasan.berprestasi)}
          label="IPK ≥ 3,50"
          aksen={WARNA.peringatan}
        />
      </View>

      {/* Inti Bagian 4: dua panel, satu properti yang berubah. */}
      <View style={[styles.duaPanel, { flexDirection: susunan }]}>
        <Panel
          judul="Sebaran program studi"
          keterangan={
            'Lebar bar dihitung dari jumlah mahasiswa per prodi, bukan angka tetap. ' +
            'Panel memakai flex: 1 sehingga lebar dibagi rata.'
          }
        >
          {sebaran.map((item) => (
            <View key={item.prodi} style={styles.barisBar}>
              <View style={styles.barisBarTeks}>
                <Text style={styles.namaProdi}>{item.prodi}</Text>
                <Text style={styles.jumlahProdi}>{item.jumlah} orang</Text>
              </View>
              <View style={styles.trekBar}>
                <View style={[styles.isiBar, { width: Math.round(item.porsi * 100) + '%' }]} />
              </View>
            </View>
          ))}
        </Panel>

        <Panel
          judul="Ringkasan akademik"
          keterangan={
            'Semua angka dihitung ulang dari DAFTAR_MAHASISWA setiap render. ' +
            'Tidak ada state tambahan, jadi tidak mungkin berbeda dari daftar aslinya.'
          }
        >
          <BarisRingkas label="Total mahasiswa" nilai={String(ringkasan.total)} />
          <BarisRingkas label="Rata-rata IPK" nilai={formatIPK(ringkasan.rataIpk)} />
          <BarisRingkas label="Predikat sangat baik" nilai={String(ringkasan.berprestasi)} />
          <BarisRingkas label="Sedang cuti" nilai={String(ringkasan.cuti)} />
        </Panel>
      </View>

      <Text style={styles.judulBagian}>Mahasiswa dengan IPK tertinggi</Text>
      <View style={styles.daftarTerbaik}>
        {terbaik.map((mahasiswa, urutan) => {
          const predikat = predikatAkademik(mahasiswa.ipk);
          return (
            <Pressable
              key={mahasiswa.id}
              onPress={() => onBukaDetail(mahasiswa.id)}
              android_ripple={{ color: WARNA.permukaanRedup }}
              accessibilityRole="button"
              accessibilityLabel={'Buka detail ' + mahasiswa.nama}
              style={({ pressed }) => [styles.barisTerbaik, pressed && styles.barisDitekan]}
            >
              <Text style={styles.peringkat}>{urutan + 1}</Text>
              <AvatarPlaceholder
                nama={mahasiswa.nama}
                ukuran={36}
                fotoUri={mahasiswa.fotoUri}
              />
              <View style={styles.identitas}>
                <Text style={styles.namaTerbaik} numberOfLines={1}>
                  {mahasiswa.nama}
                </Text>
                <Text style={styles.metaTerbaik} numberOfLines={1}>
                  {mahasiswa.nim} · {predikat.label}
                </Text>
              </View>
              <Text style={styles.ipkTerbaik}>{formatIPK(mahasiswa.ipk)}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.tombol}>
        <TombolAksi label="Lihat semua mahasiswa" onPress={onBukaMahasiswa} />
        <TombolAksi label="Katalog mata kuliah" onPress={onBukaKatalog} jenis="kedua" />
      </View>

      <Text style={styles.catatanKaki}>
        Putar perangkat atau ubah lebar jendela: susunan dua panel di atas berpindah tanpa
        memuat ulang aplikasi. Angka pada chip “render” ikut bertambah — bukti bahwa
        useWindowDimensions() memicu render ulang, bukan mengukur sekali di awal.
      </Text>
    </ScrollView>
  );
}

// Panel kecil dipakai dua kali di atas. Komposisi seperti ini membuat layar
// tetap terbaca tanpa satu blok JSX raksasa (subbab 2.10).
function Panel({ judul, keterangan, children }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.judulPanel}>{judul}</Text>
      <View style={styles.isiPanel}>{children}</View>
      <Text style={styles.keteranganPanel}>{keterangan}</Text>
    </View>
  );
}

function BarisRingkas({ label, nilai }) {
  return (
    <View style={styles.barisRingkas}>
      <Text style={styles.labelRingkas}>{label}</Text>
      <Text style={styles.nilaiRingkas}>{nilai}</Text>
    </View>
  );
}

function LabelUkur({ label, nilai }) {
  return (
    <View style={styles.chipUkur}>
      <Text style={styles.labelUkur}>{label}</Text>
      <Text style={styles.nilaiUkur}>{nilai}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: {
    flex: 1,
    backgroundColor: WARNA.latar,
  },
  isi: {
    padding: JARAK.lg,
    paddingBottom: JARAK.xxl,
    gap: JARAK.lg,
  },
  kepala: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: JARAK.md,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
  },
  kepalaTeks: {
    gap: 1,
  },
  judulAplikasi: {
    fontSize: TEKS.judulLayar,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  subJudul: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  barisUkur: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: JARAK.sm,
  },
  chipUkur: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 3,
    paddingHorizontal: JARAK.sm,
    borderRadius: RADIUS.bulat,
    backgroundColor: WARNA.permukaan,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  labelUkur: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  nilaiUkur: {
    fontSize: TEKS.mungil,
    fontWeight: '700',
    color: WARNA.utama,
  },
  barisKartu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: JARAK.sm,
  },
  duaPanel: {
    gap: JARAK.md,
  },
  panel: {
    flex: 1,
    gap: JARAK.sm,
    padding: JARAK.lg,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  judulPanel: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  isiPanel: {
    gap: JARAK.sm,
  },
  keteranganPanel: {
    fontSize: TEKS.mungil,
    lineHeight: 16,
    color: WARNA.tintaRedup,
  },
  barisBar: {
    gap: 4,
  },
  barisBarTeks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: JARAK.sm,
  },
  namaProdi: {
    fontSize: TEKS.kecil,
    color: WARNA.tinta,
  },
  jumlahProdi: {
    fontSize: TEKS.kecil,
    fontWeight: '600',
    color: WARNA.tintaRedup,
  },
  trekBar: {
    height: 8,
    borderRadius: RADIUS.bulat,
    backgroundColor: WARNA.permukaanRedup,
    overflow: 'hidden',
  },
  isiBar: {
    height: '100%',
    borderRadius: RADIUS.bulat,
    backgroundColor: WARNA.utama,
  },
  barisRingkas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: JARAK.sm,
  },
  labelRingkas: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  nilaiRingkas: {
    fontSize: TEKS.kecil,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  judulBagian: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  daftarTerbaik: {
    gap: JARAK.sm,
  },
  barisTerbaik: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: JARAK.md,
    padding: JARAK.md,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  barisDitekan: {
    backgroundColor: WARNA.permukaanRedup,
  },
  peringkat: {
    width: 16,
    fontSize: TEKS.isi,
    fontWeight: '700',
    color: WARNA.tintaRedup,
  },
  identitas: {
    flex: 1,
    gap: 1,
  },
  namaTerbaik: {
    fontSize: TEKS.isi,
    fontWeight: '600',
    color: WARNA.tinta,
  },
  metaTerbaik: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  ipkTerbaik: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.utama,
  },
  tombol: {
    gap: JARAK.sm,
  },
  catatanKaki: {
    fontSize: TEKS.mungil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
});
