import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { radius, spasi, teks, warna } from '../tema/desain.js';

/**
 * Satu tombol, empat varian.
 *
 * Pertanyaan desainnya bukan "bagaimana bentuknya?" melainkan "sepenting apa
 * tindakan ini?" — karena itu variannya mengikuti tingkat kepentingan:
 *
 *   utama     → satu tindakan pokok per layar (Simpan, Ambil MK)
 *   sekunder  → tindakan pendukung (Ubah, Batal)
 *   garis     → tindakan alternatif yang tidak boleh bersaing
 *   teks      → tindakan paling ringan (Tautan, Lihat semua)
 *
 * Keadaan `pressed` dan `disabled` ditangani di satu tempat, sehingga layar tidak
 * perlu tahu cara menggambar tombol yang tidak bisa ditekan.
 */
export function Tombol({
  judul,
  onPress,
  varian = 'utama',
  ukuran = 'md',
  nonaktif = false,
  memuat = false,
  penuh = false,
}) {
  const tidakBisa = nonaktif || memuat;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: tidakBisa, busy: memuat }}
      disabled={tidakBisa}
      onPress={tidakBisa ? undefined : onPress}
      style={({ pressed }) => [
        styles.dasar,
        styles[`ukuran_${ukuran}`],
        styles[`varian_${varian}`],
        penuh && styles.penuh,
        pressed && !tidakBisa && styles[`tekan_${varian}`],
        tidakBisa && styles.nonaktif,
      ]}
    >
      {memuat ? (
        <ActivityIndicator size="small" color={varian === 'utama' ? warna.teks : warna.utama} />
      ) : (
        <Text style={[styles.judul, styles[`judul_${varian}`], ukuran === 'sm' && teks.kecil]}>
          {judul}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dasar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  penuh: { alignSelf: 'stretch' },
  nonaktif: { opacity: 0.45 },

  ukuran_sm: { paddingVertical: spasi.sm, paddingHorizontal: spasi.md },
  ukuran_md: { paddingVertical: spasi.md, paddingHorizontal: spasi.lg },
  ukuran_lg: { paddingVertical: spasi.lg, paddingHorizontal: spasi.xl },

  varian_utama: { backgroundColor: warna.utama },
  varian_sekunder: { backgroundColor: warna.permukaanTinggi },
  varian_garis: { backgroundColor: 'transparent', borderColor: warna.utama },
  varian_teks: { backgroundColor: 'transparent', paddingHorizontal: spasi.sm },

  tekan_utama: { backgroundColor: warna.utamaDitekan },
  tekan_sekunder: { backgroundColor: warna.garis },
  tekan_garis: { backgroundColor: 'rgba(14,165,233,0.12)' },
  tekan_teks: { opacity: 0.7 },

  judul: { ...teks.isi, fontWeight: '600' },
  judul_utama: { color: warna.teks },
  judul_sekunder: { color: warna.teks },
  judul_garis: { color: warna.utamaRedup },
  judul_teks: { color: warna.utamaRedup },
});
