import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { radius, spasi, teks, warna } from '../tema/desain.js';

/**
 * Satu kolom form: label, input, pesan bantuan, dan pesan galat.
 *
 * Semua kolom di aplikasi ini memakai komponen yang sama supaya:
 *   - jarak, warna garis, dan ukuran huruf tidak berbeda antar form
 *   - pesan galat selalu muncul di tempat yang sama
 *   - `accessibilityLabel` dan `aria-invalid` tidak lupa dipasang
 *
 * Komponen ini **controlled**: nilainya dipegang parent lewat `nilai` dan
 * `onChangeText`. Ia tidak menyimpan teks sendiri.
 */
export function FormField({
  label,
  nilai,
  onChangeText,
  galat,
  petunjuk,
  rahasia = false,
  ...sisa
}) {
  const [fokus, setFokus] = useState(false);
  const [tampil, setTampil] = useState(false);

  return (
    <View style={styles.bungkus}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.kotak,
          fokus && styles.kotakFokus,
          Boolean(galat) && styles.kotakGalat,
        ]}
      >
        <TextInput
          value={nilai}
          onChangeText={onChangeText}
          onFocus={() => setFokus(true)}
          onBlur={() => setFokus(false)}
          placeholderTextColor={warna.teksMati}
          secureTextEntry={rahasia && !tampil}
          accessibilityLabel={label}
          accessibilityState={{ disabled: sisa.editable === false }}
          style={styles.input}
          {...sisa}
        />

        {rahasia && (
          <Pressable
            onPress={() => setTampil((lama) => !lama)}
            accessibilityRole="button"
            accessibilityLabel={tampil ? 'Sembunyikan password' : 'Tampilkan password'}
            hitSlop={8}
          >
            <Text style={styles.tombolMata}>{tampil ? 'Sembunyikan' : 'Lihat'}</Text>
          </Pressable>
        )}
      </View>

      {/* Pesan galat menggantikan petunjuk, tidak ditumpuk — supaya tidak melompat. */}
      {galat ? (
        <Text style={styles.galat} accessibilityLiveRegion="polite">
          {galat}
        </Text>
      ) : petunjuk ? (
        <Text style={styles.petunjuk}>{petunjuk}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bungkus: { gap: spasi.xs },
  label: { color: warna.teksRedup, ...teks.mikro },
  kotak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spasi.sm,
    backgroundColor: warna.permukaan,
    borderWidth: 1,
    borderColor: warna.garis,
    borderRadius: radius.md,
    paddingHorizontal: spasi.md,
  },
  kotakFokus: { borderColor: warna.utama },
  kotakGalat: { borderColor: warna.bahaya },
  input: {
    flex: 1,
    color: warna.teks,
    ...teks.isi,
    paddingVertical: spasi.md,
  },
  tombolMata: { color: warna.utamaRedup, ...teks.mikro },
  galat: { color: warna.bahaya, ...teks.mikro, fontWeight: '400' },
  petunjuk: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
});
