import { Redirect } from 'expo-router';

import { useAuth } from '../context/AuthContext.js';

/**
 * Gerbang pertama: alamat `/` tidak menampilkan apa pun, hanya mengarahkan.
 *
 * Dua tujuan berbeda supaya tidak terjadi lingkaran pengalihan:
 *   belum masuk → /login      (login tidak pernah mengarah balik ke sini)
 *   sudah masuk → /(tabs)/beranda
 */
export default function Index() {
  const { sudahMasuk } = useAuth();

  return <Redirect href={sudahMasuk ? '/(tabs)/beranda' : '/login'} />;
}
