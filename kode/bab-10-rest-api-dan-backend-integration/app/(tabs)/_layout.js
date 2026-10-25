import { Redirect, Tabs } from 'expo-router';
import { Text } from 'react-native';

import { useAuth } from '../../context/AuthContext.js';
import { teks, warna } from '../../tema/desain.js';

/**
 * Satu-satunya titik kendali akses.
 *
 * Empat tab di bawahnya tidak perlu memeriksa sesi sendiri. Kalau nanti ada tab
 * kelima, ia otomatis terjaga — dan kalau pemeriksaan ini dihapus, seluruh
 * aplikasi terbuka. Itulah yang dimaksud "satu pintu" di slide.
 */
export default function TabLayout() {
  const { sudahMasuk } = useAuth();

  if (!sudahMasuk) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: warna.utamaRedup,
        tabBarInactiveTintColor: warna.teksMati,
        tabBarStyle: { backgroundColor: warna.permukaan, borderTopColor: warna.garis },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="beranda"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => <Ikon simbol="⌂" warna={color} />,
        }}
      />
      <Tabs.Screen
        name="krs"
        options={{
          title: 'KRS',
          tabBarIcon: ({ color }) => <Ikon simbol="▤" warna={color} />,
        }}
      />
      <Tabs.Screen
        name="nilai"
        options={{
          title: 'Nilai',
          tabBarIcon: ({ color }) => <Ikon simbol="★" warna={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Ikon simbol="☺" warna={color} />,
        }}
      />
    </Tabs>
  );
}

/**
 * Ikon sementara memakai karakter teks.
 * Alasan: `@expo/vector-icons` menambah satu dependensi, sedangkan yang sedang
 * dipelajari di bab ini adalah struktur rute, bukan ikon.
 */
function Ikon({ simbol, warna: warnaIkon }) {
  return <Text style={{ color: warnaIkon, ...teks.subjudul }}>{simbol}</Text>;
}
