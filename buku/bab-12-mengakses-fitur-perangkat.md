# BAB 12 — Mengakses Fitur Perangkat

## Deskripsi Singkat

Bab ini membahas cara aplikasi React Native mengakses fitur perangkat — kamera, galeri foto, lokasi, notifikasi, sistem berkas, dan informasi perangkat — melalui paket-paket resmi Expo. Fokus utamanya adalah konsep **izin (permission)** dan praktik memintanya secara benar, karena hampir semua fitur ini menyentuh data pribadi pengguna. Bab 12 memanfaatkan penyimpanan lokal AsyncStorage dari Bab 11 untuk membangun Aplikasi Profil Mahasiswa, dan menjadi bekal sebelum Bab 13 membahas autentikasi serta keamanan aplikasi secara menyeluruh.

## Tujuan Pembelajaran

Setelah mempelajari bab ini, mahasiswa diharapkan mampu:

1. Menjelaskan konsep API perangkat (device API) dan model izin runtime (runtime permission) pada Android dan iOS.
2. Mengidentifikasi peran masing-masing paket: `expo-image-picker`, `expo-location`, `expo-notifications`, `expo-file-system`, `expo-device`, dan `expo-camera`.
3. Mengimplementasikan permintaan izin melalui `getPermissionsAsync` dan `requestPermissionsAsync`, serta menangani penolakan izin dengan baik.
4. Menggunakan `expo-image-picker` untuk mengambil foto dari kamera atau galeri dengan hasil berupa `uri`, dan `expo-location` untuk membaca koordinat beserta catatan akurasinya.
5. Menjadwalkan notifikasi lokal (local notification) dan menganalisis perbedaannya dengan notifikasi push jarak jauh (remote push notification).
6. Menganalisis aspek keamanan dan privasi data perangkat, termasuk prinsip minimasi data (data minimization) dan persetujuan pengguna (user consent).
7. Merancang dan membangun Aplikasi Profil Mahasiswa yang menyimpan foto, lokasi, info perangkat, dan data mahasiswa secara lokal, lalu tetap ada saat aplikasi dibuka ulang.

## Peta Konsep

```text
                  MENGELAKSES FITUR PERANGKAT
                              │
     ┌──────────────┬─────────┴──────────┬───────────────┐
 Kamera & Galeri  Lokasi            Notifikasi    File System &
 (image-picker)  (expo-location)  (expo-notif.)   Device Info
     └──────────────┴─────────┬──────────┴───────────────┘
                              │
                   IZIN (PERMISSION) — inti bab
        getPermissionsAsync / requestPermissionsAsync
        app.json → plugins → Info.plist (iOS) & izin Android
                              │
              Keamanan & Privasi: consent, minimasi data
                              │
    Mini Project: Aplikasi Profil Mahasiswa
      (+ AsyncStorage — Bab 11 → data tetap setelah muat ulang)
```

## Materi

### 12.1 Konsep API Perangkat dan Izin (Permission)

Aplikasi yang pernah Anda pakai di ponsel — e-ktp digital, aplikasi kampus, ojek online, m-banking — hampir semuanya memanfaatkan sesuatu yang melekat pada perangkat: kamera untuk memindai atau berfoto, GPS untuk mengetahui posisi, mikrofon untuk perintah suara, hingga notifikasi untuk mengingatkan pengguna. Kemampuan ini tidak datang sendiri; aplikasi harus memanggil **API perangkat (device API)**, yaitu antarmuka yang disediakan sistem operasi agar program dapat memerintah perangkat keras atau layanan sistem. Di React Native, API perangkat dibungkus menjadi paket-paket Expo sehingga Anda cukup menulis kode JavaScript, sementara bagian native (kode Android/iOS asli) dikerjakan oleh paket tersebut — prinsip yang sama dengan arsitektur React Native yang Anda pelajari di Bab 1.

**Mengapa teknologi ini ada?** Sistem operasi mobile tidak membiarkan aplikasi menyentuh perangkat keras seenaknya. Bayangkan jika aplikasi apa pun dapat mengaktifkan kamera tanpa sepengetahuan pengguna: siapa pun dapat memotret Anda secara diam-diam. Karena itu Android dan iOS menerapkan **sandbox** (lingkungan terkurung): tiap aplikasi berjalan di ruang terpisah, dan akses ke fitur sensitif harus melewati gerbang bernama izin (permission). Konsekuensinya, fitur perangkat selalu berpasangan dengan dua jenis pekerjaan: (1) mendeklarasikan izin pada konfigurasi project, dan (2) meminta izin kepada pengguna saat aplikasi berjalan — inilah yang disebut **izin runtime (runtime permission)**, model yang dipakai Android sejak versi 6 (Marshmallow) dan iOS untuk hampir semua data sensitif.

Di Android, izin runtime tampil sebagai dialog sistem saat aplikasi memintanya pertama kali; pengguna dapat memilih "izinkan" atau "tolak", bahkan menonaktifkannya kembali lewat Pengaturan. Di iOS, sistem menampilkan dialog serupa, tetapi aplikasi wajib menyertakan **deskripsi penggunaan (usage description)** di berkas `Info.plist` untuk setiap fitur sensitif yang dipakai — misalnya teks yang menjelaskan "untuk apa kamera digunakan". Penting: jika deskripsi ini tidak ada, aplikasi iOS akan langsung berhenti (crash) saat fitur dipanggil, bukan sekadar menolak. Inilah alasan utama mengapa konfigurasi izin menjadi bagian yang tidak bisa dilewatkan.

Bagaimana cara mendeklarasikan izin di project Expo? Melalui **config plugin (config plugin)**: daftar `plugins` dalam berkas `app.json`. Berikut contohnya (potongan) sebelum file lengkapnya Anda lihat pada Praktikum:

File: app.json
```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Aplikasi membutuhkan akses galeri untuk memilih foto profil.",
          "cameraPermission": "Aplikasi membutuhkan akses kamera untuk mengambil foto profil."
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Aplikasi membutuhkan lokasi Anda untuk mengisi data profil."
        }
      ]
    ]
  }
}
```

**Penjelasan:** Tiap entri `plugins` adalah nama paket dan opsional objek konfigurasinya. Saat Anda menjalankan `npx expo prebuild` atau membangun lewat EAS Build (Bab 15), Expo "menyuntikkan" konfigurasi ini ke project native: string `photosPermission` disalin menjadi kunci `NSPhotoLibraryUsageDescription` di `Info.plist` (iOS), sementara izin Android ditambahkan ke `AndroidManifest.xml`. Dengan demikian Anda tidak perlu membuka berkas native satu per satu. Perhatikan bahwa teks izin ditulis dalam bahasa Indonesia dan menjelaskan kegunaannya — ini bagian dari praktik privasi yang baik (Subbab 12.6). *⚠ version-sensitive: mekanisme config plugin dan nama kunci Info.plist dapat berubah antar versi SDK; periksa dokumentasi resmi terbaru (docs.expo.dev) untuk daftar opsi tiap paket.*

Pada aplikasi yang berjalan di **Expo Go** (Bab 2), sebagian besar izin sudah dideklarasikan oleh Expo Go sendiri, sehingga percobaan cepat di Expo Go tidak perlu mengubah `app.json`. Namun, saat Anda membuat build mandiri (development build atau production build), daftar `plugins` inilah yang menentukan izin aplikasi Anda — karena itu kebiasaan menuliskannya sejak awal sangat dianjurkan.

Sisi kedua dari izin adalah permintaannya saat aplikasi berjalan. Paket Expo menyediakan pola yang konsisten: `getPermissionsAsync()` untuk memeriksa status izin yang sudah ada, dan `requestPermissionsAsync()` untuk meminta izin (memunculkan dialog sistem bila perlu). Keduanya mengembalikan objek `PermissionResponse` dengan properti penting: `granted` (boolean — izin diberikan atau tidak), `status` (`granted`, `denied`, atau `undetermined`), dan `canAskAgain` (masih bisa diminta lagi atau pengguna sudah memilih "jangan tanyakan lagi"). Pola umum yang akan Anda pakai terus-menerus di bab ini:

File: utils/polaIzin.js
```js
import * as ImagePicker from 'expo-image-picker';

export async function pastikanIzinGaleri() {
  const statusSekarang = await ImagePicker.getPermissionsAsync();
  if (statusSekarang.granted) {
    return true;
  }
  const hasilPermintaan = await ImagePicker.requestPermissionsAsync();
  return hasilPermintaan.granted;
}
```

**Penjelasan:** Fungsi ini menerapkan pola "periksa dulu, minta kalau perlu": jika izin sudah pernah diberikan, langsung disetujui tanpa dialog; jika belum, sistem memunculkan dialog satu kali. Nilai `granted` dari hasil permintaan inilah yang dipakai pengambil keputusan di layar. Ketika `canAskAgain` bernilai `false` (pengguna memilih "jangan tanyakan lagi"), satu-satunya jalan adalah membuka Pengaturan sistem — misalnya dengan `Linking.openSettings()` dari React Native — lalu meminta pengguna mengaktifkan izin secara manual. Anda akan melihat penanganan penolakan ini pada kode Praktikum.

Dua kebiasaan penting terkait waktu permintaan izin. Pertama, mintalah izin **saat dibutuhkan** (di tengah alur, misalnya saat tombol "Ambil Foto" ditekan), bukan serentak saat aplikasi dibuka; pengguna lebih mudah memahami alasan permintaan bila konteksnya jelas. Kedua, jangan pernah menganggap izin bersifat permanen — pengguna dapat mencabutnya kapan saja dari Pengaturan, sehingga aplikasi yang baik selalu memeriksa ulang sebelum memakai fitur sensitif.

### 12.2 Kamera dan Pemilih Gambar (Camera dan Image Picker)

Fitur kamera adalah salah satu permintaan paling umum dalam aplikasi kampus. Dua paket Expo yang relevan: `expo-camera` untuk kendali penuh atas kamera, dan `expo-image-picker` untuk memilih gambar dari galeri atau mengambil foto melalui antarmuka sistem.

**`expo-camera`** memberi Anda **pratinjau langsung (live preview)**: komponen `<CameraView>` menampilkan bidikan kamera secara real-time di layar aplikasi, lengkap dengan API untuk mengambil gambar (`takePictureAsync`), membalik kamera depan/belakang, hingga memindai kode QR. Paket ini tepat dipakai ketika aplikasi perlu "melihat" — misalnya memindai barcode kartu ujian, deteksi wajah untuk presensi, atau filter kamera. Contoh minimalnya:

File: screens/LayarKamera.js
```js
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function LayarKamera() {
  const [izin, mintaIzin] = useCameraPermissions();

  if (!izin) {
    return <View style={styles.halaman} />;
  }
  if (!izin.granted) {
    return (
      <View style={styles.halaman}>
        <Text style={styles.teks}>Izin kamera belum diberikan.</Text>
        <Pressable style={styles.tombol} onPress={mintaIzin}>
          <Text style={styles.teksTombol}>Berikan Izin</Text>
        </Pressable>
      </View>
    );
  }
  return <CameraView style={styles.halaman} facing="back" />;
}

const styles = StyleSheet.create({
  halaman: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  teks: { fontSize: 16, marginBottom: 12 },
  tombol: { backgroundColor: '#1a56db', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  teksTombol: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
});
```

**Penjelasan:** Hook `useCameraPermissions()` mengelola izin kamera: `izin` berisi status saat ini, `mintaIzin` adalah fungsi pemintanya. Layar ini menampilkan pratinjau kamera hanya bila izin diberikan; bila belum, muncul tombol "Berikan Izin" — inilah penerapan permintaan izin sesuai konteks pada Subbab 12.1. *⚠ version-sensitive: komponen `CameraView` menggantikan komponen `Camera` lama yang sudah tidak disarankan sejak SDK menengah; nama properti dan metode dapat berubah — periksa dokumentasi resmi `expo-camera` terbaru.*

**Trade-off dengan `expo-image-picker`.** Untuk kebutuhan "ambil satu foto lalu tampilkan", `expo-camera` sebenarnya berlebihan: Anda harus mengelola izin, pratinjau, dan alur pengambilan sendiri. `expo-image-picker` menawarkan jalan lebih pendek: dengan satu panggilan `launchCameraAsync()` sistem membuka antarmuka kamera bawaan, dan ketika pengguna menekan tombol rana, aplikasi langsung menerima hasil berupa `uri` (lokasi berkas gambar). Tidak ada kode untuk pratinjau, tombol rana, atau rotasi gambar — semuanya ditangani sistem. Sebaliknya, Anda kehilangan kendali atas tampilan kamera dan tidak bisa menambahkan overlay sembari membidik. Ringkasnya: **pilih `expo-image-picker` bila hasil akhirnya "cukup satu berkas gambar" (foto profil, bukti pembayaran, lampiran laporan); pilih `expo-camera` bila aplikasi harus menampilkan atau mengolah bidikan langsung (pemindai, filter, liveness detection)**. Pada mini project bab ini, foto profil diambil cukup dengan `expo-image-picker` — lebih sederhana dan tetap memenuhi kebutuhan.

Selain memotret, `expo-image-picker` dapat membuka galeri lewat `launchImageLibraryAsync()`. Kedua fungsi menerima opsi yang sama: `mediaTypes` untuk membatasi jenis berkas (*⚠ version-sensitive: sejak SDK yang lebih baru ditulis sebagai array string, misalnya `['images']`, menggantikan konstanta `MediaTypeOptions` yang lama*), `quality` untuk kompresi (0–1), serta `allowsEditing` dan `aspect` untuk mengaktifkan pemotongan gambar — sangat berguna untuk foto profil berbentuk lingkaran. Hasil panggilan berbentuk objek dengan properti `canceled` (true bila pengguna membatalkan) dan `assets`, array yang berisi detail gambar; `assets[0].uri` adalah alamat berkas yang siap ditampilkan oleh `<Image source={{ uri }}>`. Perhatikan satu hal penting: `uri` ini menunjuk ke berkas sementara di area cache sistem, sehingga bisa dibersihkan sistem operasi kapan pun — untuk penyimpanan permanen, berkas harus disalin ke direktori dokumen aplikasi (Subbab 12.5).

### 12.3 Lokasi (Location)

Aplikasi berbasis lokasi — presensi, pengantaran, pencarian kampus terdekat — membaca posisi perangkat melalui **`expo-location`**. Cara kerja penentu posisi itu sendiri berlapis: **GPS (Global Positioning System)** menghitung posisi dari sinyal satelit dan paling akurat di area terbuka, sedangkan posisi berbasis jaringan (Wi-Fi dan menara seluler) lebih cepat tetapi kurang presisi, terutama di dalam gedung. Paket `expo-location` menyatukan sumber-sumber ini; aplikasi cukup memilih tingkat akurasi dan menerima koordinat.

Urutan pemakaiannya sama dengan pola Subbab 12.1: minta izin dengan `requestForegroundPermissionsAsync()` — nama ini menegaskan bahwa lokasi dibaca hanya saat aplikasi terbuka di layar (foreground); ada pula izin lokasi latar belakang (background) yang lebih ketat dan tidak dibahas di buku ini. Setelah izin diberikan, `getCurrentPositionAsync()` mengembalikan posisi terkini:

File: utils/ambilLokasi.js
```js
import * as Location from 'expo-location';

export async function ambilKoordinat() {
  const izin = await Location.requestForegroundPermissionsAsync();
  if (!izin.granted) {
    return null;
  }
  const posisi = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    latitude: posisi.coords.latitude,
    longitude: posisi.coords.longitude,
    akurasi: posisi.coords.accuracy,
    waktu: new Date(posisi.timestamp).toLocaleString('id-ID'),
  };
}
```

**Penjelasan:** `posisi.coords` berisi `latitude` dan `longitude` (derajat desimal, misalnya *-6.90217, 107.60488*), plus `accuracy` — perkiraan radius ketidakpastian dalam **meter** (misalnya 35 berarti posisi diperkirakan dalam lingkaran 35 meter dari titik sebenarnya) — dan `timestamp` waktu pengukuran. Opsi `accuracy` memilih keseimbangan antara kecepatan dan ketelitian: `Balanced` (sekitar 100 meter) cukup untuk menampilkan koordinat profil; `High` (sekitar 10 meter) untuk presensi yang butuh ketelitian; `Lowest` menghemat baterai. Catatan akurasi ini penting untuk ditampilkan bersama koordinat, karena nilai koordinat tanpa akurasi bisa menyesatkan — di dalam gedung, GPS sering meleset ratusan meter. Bila aplikasi hanya butuh posisi terakhir yang pernah didapat (cepat tetapi bisa `null` atau usang), gunakan `getLastKnownPositionAsync()`.

Data lokasi termasuk **data pribadi yang sensitif**: pola pergerakan seseorang dapat disimpulkan dari riwayat koordinatnya. Karena itu izin lokasi selalu diminta terpisah dari izin lain, dan praktik yang baik adalah meminta akurasi serendah mungkin yang masih memenuhi kebutuhan (lihat Subbab 12.6). Untuk mengubah koordinat menjadi nama tempat, tersedia `reverseGeocodeAsync()` yang mengembalikan alamat (jalan, kota, wilayah) — Anda akan menggunakannya pada Latihan.

### 12.4 Notifikasi (Notifications)

**Notifikasi (notification)** adalah pesan yang muncul di luar antarmuka aplikasi — di laci notifikasi Android atau banner iOS — sehingga pengguna tetap diingatkan meski sedang memakai aplikasi lain. `expo-notifications` menyediakan dua kategori. Pertama, **notifikasi lokal (local notification)**: dijadwalkan dan ditampilkan oleh perangkat itu sendiri, tanpa melibatkan jaringan. Kedua, **notifikasi push jarak jauh (remote push notification)**: dikirim dari server, misalnya pemberitahuan nilai baru dari sistem akademik. *⚠ version-sensitive: notifikasi push membutuhkan server pengirim (Expo Push Service, Firebase Cloud Messaging untuk Android, atau Apple Push Notification service untuk iOS) dan tidak dapat ditangani oleh `expo-notifications` saja; bab ini hanya membahas notifikasi lokal.*

**Mengapa teknologi ini ada?** Aplikasi tidak selalu terbuka saat momen penting terjadi (jadwal ujian, tenggat pengumpulan tugas). Notifikasi memindahkan "pengingat" dari dalam aplikasi ke level sistem operasi, yang bertanggung jawab menampilkan pesan sesuai prioritas dan preferensi pengguna. Di Android, pengguna bahkan mengelompokkan notifikasi per **kanal notifikasi (notification channel)** agar dapat mengatur bunyi dan tingkat gangguan tiap jenis pesan.

Alur notifikasi lokal terdiri dari tiga langkah: (1) membuat kanal (khusus Android), (2) meminta izin, dan (3) menjadwalkan. Contoh ringkas:

File: utils/kirimNotifikasi.js
```js
import * as Notifications from 'expo-notifications';

export async function kirimPengingat(judulPesan, isiPesan, detik) {
  await Notifications.setNotificationChannelAsync('pengingat-kuliah', {
    name: 'Pengingat Kuliah',
    importance: Notifications.AndroidImportance.DEFAULT,
  });

  const izin = await Notifications.requestPermissionsAsync();
  if (!izin.granted) {
    return false;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: judulPesan,
      body: isiPesan,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: detik,
      channelId: 'pengingat-kuliah',
    },
  });
  return true;
}
```

**Penjelasan:** `setNotificationChannelAsync` membuat kanal `'pengingat-kuliah'` dengan tingkat kepentingan `DEFAULT` (berbunyi, tanpa layar penuh) — wajib ada di Android, karena notifikasi tanpa kanal dapat diabaikan sistem. `requestPermissionsAsync` memunculkan dialog izin; di Android 13 ke atas, sistem menanyakan izin notifikasi secara eksplisit seperti izin lainnya, sedangkan di versi lebih lama permintaan ini langsung disetujui. Terakhir, `scheduleNotificationAsync` menerima `content` (judul dan isi) serta `trigger` — pemicu kapan notifikasi muncul; `TIME_INTERVAL` dengan `seconds` menyatakan "muncul setelah N detik", dan kanal ditunjuk lewat `channelId`. *⚠ version-sensitive: bentuk `trigger` bernama-tipe diperkenalkan di SDK yang lebih baru; pada versi lama cukup `trigger: { seconds: 5 }`. Periksa dokumentasi resmi `expo-notifications` untuk bentuk terkini.* Notifikasi lokal juga dapat dijadwalkan pada tanggal tertentu (`DATE`) atau diulang berkala — pengaturan detailnya dapat Anda telusuri di dokumentasi dan diuji pada Latihan.

### 12.5 Sistem Berkas dan Informasi Perangkat (File System dan Device Information)

Aplikasi mobile hidup di dalam **sandbox berkas**: tiap aplikasi memiliki direktori privat yang tidak dapat dibaca aplikasi lain — direktori `documentDirectory` untuk berkas permanen milik aplikasi, dan `cacheDirectory` untuk berkas sementara yang boleh dibersihkan sistem. Sandbox inilah yang membuat ponsel Anda aman: aplikasi catatan tidak bisa mengintip foto aplikasi kamera. **`expo-file-system`** memberi akses terkelola ke direktori privat tersebut dengan API berorientasi objek `File` dan `Paths` (pengganti fungsi-fungsi lama yang diawali `writeAsStringAsync` dan semacamnya yang sudah ditinggalkan di SDK terbaru *⚠ version-sensitive: periksa dokumentasi resmi `expo-file-system` untuk bentuk API terkini*). Contoh membaca dan menulis berkas teks sederhana:

File: utils/catatanBerkas.js
```js
import { File, Paths } from 'expo-file-system';

export async function simpanCatatan(isian) {
  const berkas = new File(Paths.document, 'catatan-saya.txt');
  await berkas.write(isian);
  return berkas.uri;
}

export async function bacaCatatan() {
  const berkas = new File(Paths.document, 'catatan-saya.txt');
  if (!berkas.exists) {
    return '';
  }
  return await berkas.text();
}
```

**Penjelasan:** `Paths.document` menunjuk direktori dokumen aplikasi; `new File(Paths.document, 'catatan-saya.txt')` mewakili satu berkas di dalamnya. `berkas.write(isian)` menulis teks (membuat berkas bila belum ada), `berkas.text()` membaca isinya, dan properti `berkas.exists` menghindari galat saat berkas belum pernah dibuat. Karena berkas berada di direktori privat, tidak diperlukan izin khusus untuk operasi ini — berbeda dengan kamera atau lokasi. Pola ini pula yang menjadi jawaban permanen untuk foto: `uri` hasil image picker (Subbab 12.2) hanyalah berkas sementara; menyalinnya ke `Paths.document` membuatnya bertahan — Anda diajak mempraktikkannya pada Tantangan.

Sementara itu, **`expo-device`** membaca **informasi perangkat (device information)**: nama perangkat (`deviceName`), model (`modelName`, misalnya "Pixel 7"), sistem operasi beserta versinya (`osName`, `osVersion`), merek (`brand`), dan `isDevice` untuk membedakan perangkat fisik dari emulator. Informasi ini berguna untuk menyesuaikan tampilan, mengelompokkan statistik pengguna, atau menolak fitur tertentu pada emulator. Perlu diingat: kombinasi informasi perangkat dapat digunakan untuk **fingerprinting** (identifikasi unik pengguna), sehingga praktiknya juga tunduk pada prinsip minimasi data (Subbab 12.6).

### 12.6 Keamanan dan Privasi Data Perangkat

Fitur perangkat hampir selalu berarti memproses data pribadi pengguna: wajah di foto, lokasi, hingga preferensi notifikasi. Tiga prinsip yang harus dipegang pengembang aplikasi — bukan sekadar mengikuti aturan, tetapi karena inilah inti kepercayaan pengguna.

**Pertama, minta izin dengan penjelasan (informed consent).** Dialog sistem memang menampilkan pilihan, tetapi aplikasi Anda yang menentukan konteks: jelaskan dalam teks izin "untuk apa" fitur dipakai (misalnya "lokasi untuk mengisi alamat profil", bukan sekadar "membaca lokasi"). Jangan meminta izin yang tidak diperlukan dan jangan meminta semuanya sekaligus di awal — permintaan yang membingungkan justru meningkatkan penolakan.

**Kedua, jangan mengunggah data tanpa persetujuan.** Data lokasi, foto, dan info perangkat adalah milik pengguna. Unggahan hanya boleh terjadi sebagai respons atas tindakan eksplisit pengguna (misalnya menekan tombol "Simpan dan Kirim"), bukan diam-diam di latar belakang. Ketika aplikasi Anda memiliki backend (Bab 10), nyatakan dengan jelas data apa yang dikirim, ke mana, dan untuk apa — dan jangan mengirim lebih dari yang dibutuhkan.

**Ketiga, minimalkan data (data minimization).** Ambil data sesedikit mungkin yang masih memenuhi fungsi: gunakan akurasi lokasi kasar bila cukup; simpan koordinat terakhir, bukan jejak pergerakan; jangan menyalin seluruh galeri bila cukup satu gambar. Data yang tidak pernah dikumpulkan adalah data yang tidak bisa bocor. Pada sisi penyimpanan, ingat bahwa AsyncStorage (Bab 11) bukan tempat data sensitif — token dan kredensial harus ditempatkan di `expo-secure-store`, yang akan Anda pelajari di Bab 13. Terakhir, aplikasi yang dipublikasikan wajib memiliki **kebijakan privasi (privacy policy)** yang menjelaskan praktik di atas; toko aplikasi (Google Play dan App Store) mewajibkannya, dan pengguna kini semakin sadar membaca dokumen tersebut.

### 12.7 Mini Project: Aplikasi Profil Mahasiswa

Sebagai penerapan utuh, bab ini membangun **Aplikasi Profil Mahasiswa**: satu layar yang mengumpulkan empat kelompok data — data akademik (nama, NIM, program studi, email), foto profil (dari kamera atau galeri), lokasi saat ini (koordinat beserta akurasi), dan informasi perangkat — lalu menyimpannya ke AsyncStorage (Bab 11) sehingga **saat aplikasi ditutup dan dibuka kembali, seluruh data tetap ada**. Sebagai penutup, sebuah tombol uji menjadwalkan notifikasi lokal yang merangkum profil pengguna.

Arsitekturnya sengaja sederhana: berkas `App.js` sebagai pintu masuk menampilkan satu layar `screens/ProfilMahasiswa.js`; logika penyimpanan dipisah ke `utils/profilStorage.js`; dan komponen kecil `components/InfoBaris.js` menampilkan satu pasangan label–nilai (latihan komponen reusable ala Bab 5). Gambaran alurnya:

```text
Layar ProfilMahasiswa
  ├─ muat data tersimpan (AsyncStorage)  ── saat aplikasi dibuka
  ├─ ambil foto    → izin kamera/galeri + launchCameraAsync / launchImageLibraryAsync
  ├─ ambil lokasi  → izin lokasi + getCurrentPositionAsync → tampil + akurasi
  ├─ info perangkat → expo-device (nama, model, OS)
  └─ simpan profil → simpanProfil() → AsyncStorage
                     └─ kirim notifikasi uji → scheduleNotificationAsync
```

Pembagian peran fungsi di atas menunjukkan pola yang akan terus Anda temui di aplikasi nyata: **mengumpulkan** (foto, lokasi, perangkat), **memvalidasi** (bidang wajib), **menyimpan** (persistensi lokal), dan **memberi umpan balik** (dialog, notifikasi). Implementasi lengkapnya ada pada Praktikum; bila aplikasi ini berkembang menjadi beberapa halaman (misalnya halaman detail riwayat lokasi), struktur navigasinya mengikuti pola Expo Router pada Bab 7.

## Contoh

Berikut tiga contoh pendek yang merangkum pola inti bab ini. Contoh pertama sudah Anda lihat pada Subbab 12.2 (image picker); di sini kami tambahkan pola permintaan izin untuk kamera, pembacaan posisi dengan penanganan kegagalan, dan penjadwalan notifikasi satu kali.

**Contoh 1 — Permintaan izin kamera dengan penanganan penolakan.**

File: utils/izinKamera.js
```js
import * as ImagePicker from 'expo-image-picker';

export async function mintaIzinKamera() {
  const status = await ImagePicker.getPermissionsAsync();
  if (status.granted) {
    return { disetujui: true };
  }
  if (status.canAskAgain === false) {
    return { disetujui: false, permanen: true };
  }
  const hasil = await ImagePicker.requestPermissionsAsync();
  return { disetujui: hasil.granted, permanen: false };
}
```

**Penjelasan:** Fungsi ini mengembalikan objek yang membedakan tiga keadaan: izin sudah ada, ditolak sementara (masih bisa diminta lagi), dan ditolak permanen (`canAskAgain === false`). Keadaan terakhir penting — aplikasi tidak bisa memunculkan dialog lagi, sehingga layar harus menampilkan petunjuk "buka Pengaturan" dan memanggil `Linking.openSettings()`. Pola tiga keadaan ini dapat dipakai untuk semua paket yang menyediakan `getPermissionsAsync`/`requestPermissionsAsync`.

**Contoh 2 — Membaca posisi dengan jaring pengaman (fallback).**

File: utils/posisiTerakhir.js
```js
import * as Location from 'expo-location';

export async function posisiTerbaik() {
  const izin = await Location.requestForegroundPermissionsAsync();
  if (!izin.granted) {
    return null;
  }
  try {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
  } catch (galat) {
    const posisiLama = await Location.getLastKnownPositionAsync();
    if (posisiLama) {
      console.warn('Posisi terkini gagal, memakai posisi terakhir.', galat);
      return posisiLama;
    }
    return null;
  }
}
```

**Penjelasan:** Di dalam ruangan atau saat sinyal GPS buruk, `getCurrentPositionAsync` dapat gagal atau menunggu lama. Blok `try/catch` (Bab 3) menangkap kegagalan tersebut dan mencoba `getLastKnownPositionAsync`, yang mengembalikan posisi terakhir yang pernah diukur (bisa `null` bila belum pernah ada). Pola fallback begini membuat aplikasi tetap berfungsi pada kondisi nyata, bukan hanya pada demo.

**Contoh 3 — Notifikasi lokal pada waktu tertentu.**

File: utils/notifikasiUjian.js
```js
import * as Notifications from 'expo-notifications';

export async function ingatkanUjian(waktuUjian) {
  const izin = await Notifications.requestPermissionsAsync();
  if (!izin.granted) {
    return false;
  }
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Jadwal Ujian',
      body: 'Ujian Pemrograman Mobile dimulai sebentar lagi.',
    },
    trigger: waktuUjian,
  });
  return true;
}
```

**Penjelasan:** Bila Anda sudah memiliki objek `Date`, pemicu `DATE` memungkinkan notifikasi muncul tepat pada tanggal tersebut — cukup dengan melewatkan `{ type: Notifications.SchedulableTriggerInputTypes.DATE, date: waktuUjian }` sebagai `trigger` *⚠ version-sensitive: periksa bentuk pemicu terkini di dokumentasi `expo-notifications`*. Perhatikan bahwa penjadwalan tetap butuh izin yang diberikan sebelumnya; hasil `false` dari fungsi ini memberi tahu layar bahwa pengguna menolak notifikasi.

## Praktikum

### Tujuan Praktikum

Praktikum ini membangun Aplikasi Profil Mahasiswa yang mempraktikkan seluruh materi bab: konfigurasi `plugins` di `app.json`, permintaan izin kamera/galeri/lokasi/notifikasi, pengambilan foto dan koordinat, pembacaan info perangkat, penyimpanan ke AsyncStorage, serta pemulihan data saat aplikasi dibuka ulang. Setelah praktikum selesai, mahasiswa mampu mengimplementasikan pola "minta izin → gunakan fitur → simpan hasil" secara mandiri.

### Kebutuhan

- Project Expo berbasis template blank (JavaScript) sesuai Bab 2, bernama `profil-mahasiswa`.
- Perangkat fisik dengan Expo Go (disarankan) atau emulator Android; fitur GPS bekerja lebih baik di perangkat fisik.
- Paket Expo yang dipasang: `expo-image-picker`, `expo-location`, `expo-notifications`, `expo-file-system`, `expo-device`, dan `@react-native-async-storage/async-storage`.

### Persiapan

1. Buat project baru (cara sama dengan Bab 2):

```bash
npx create-expo-app profil-mahasiswa --template blank
cd profil-mahasiswa
npx expo start
```

2. Pasang seluruh paket dengan perintah resmi Expo agar versinya cocok dengan SDK project:

```bash
npx expo install expo-image-picker expo-location expo-notifications expo-file-system expo-device @react-native-async-storage/async-storage
```

3. Periksa berkas `app.json` dan tambahkan daftar `plugins` seperti pada Langkah Kerja (berguna saat Anda membangun APK di Bab 15; di Expo Go tidak wajib karena Expo Go telah mendeklarasikan izinnya).

### Langkah Kerja

1. Salin isi berkas `app.json` pada bagian Kode ke project Anda (perhatikan blok `plugins`).
2. Ganti isi `App.js` dengan kode pada bagian Kode yang menampilkan layar `ProfilMahasiswa`.
3. Buat folder `screens`, `components`, dan `utils` di dalam folder project, lalu salin masing-masing berkas `ProfilMahasiswa.js`, `InfoBaris.js`, dan `profilStorage.js`.
4. Mulai ulang bundler dengan membersihkan cache agar plugin dan paket baru terbaca: `npx expo start -c`.
5. Buka aplikasi di Expo Go, isi nama dan NIM (gunakan data Anda sendiri atau contoh: Budi Santoso, 2201001), lalu uji keempat tombol secara berurutan: Ambil Foto (Kamera), Pilih dari Galeri, Dapatkan Lokasi Saat Ini, Simpan Profil, dan Kirim Notifikasi Uji.
6. Tutup aplikasi (geser dari daftar aplikasi terbaru), buka kembali, dan periksa bahwa seluruh data masih tampil — inilah bukti persistensi AsyncStorage.

### Kode

File: app.json
```json
{
  "expo": {
    "name": "Profil Mahasiswa",
    "slug": "profil-mahasiswa",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Aplikasi membutuhkan akses galeri untuk memilih foto profil.",
          "cameraPermission": "Aplikasi membutuhkan akses kamera untuk mengambil foto profil."
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Aplikasi membutuhkan lokasi Anda untuk mengisi data profil."
        }
      ],
      "expo-notifications"
    ]
  }
}
```

**Penjelasan:** Blok `plugins` mendeklarasikan izin pada level project: dua entri pertama berbentuk array berisi nama paket dan objek opsi (teks izin iOS yang dihasilkan saat build), sedangkan `"expo-notifications"` cukup berbentuk string karena tidak membutuhkan opsi khusus. *⚠ version-sensitive: nama opsi (`photosPermission`, `cameraPermission`, `locationWhenInUsePermission`) adalah konvensi config plugin yang mengikuti versi SDK — periksa dokumentasi tiap paket sebelum build.*

File: App.js
```js
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import ProfilMahasiswa from './screens/ProfilMahasiswa';

export default function App() {
  return (
    <SafeAreaView style={styles.kontainer}>
      <StatusBar style="auto" />
      <ProfilMahasiswa />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  kontainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
```

**Penjelasan:** Layar utama diletakkan di dalam `SafeAreaView` (Bab 5) agar konten tidak tertutup notch atau tombol navigasi sistem. Seluruh logika ada di `ProfilMahasiswa`, sehingga `App.js` tetap ramping — kebiasaan memisahkan pintu masuk dan layar yang baik untuk project yang terus bertumbuh.

File: utils/profilStorage.js
```js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Kunci penyimpanan profil di AsyncStorage (pola serialisasi JSON, lihat Bab 11).
const KUNCI_PROFIL = 'profil-mahasiswa';

export async function simpanProfil(profil) {
  const teksJson = JSON.stringify(profil);
  await AsyncStorage.setItem(KUNCI_PROFIL, teksJson);
}

export async function muatProfil() {
  const teksJson = await AsyncStorage.getItem(KUNCI_PROFIL);
  if (!teksJson) {
    return null;
  }
  return JSON.parse(teksJson);
}
```

**Penjelasan:** Berkas ini membungkus AsyncStorage dengan dua fungsi: `simpanProfil` menerima objek profil dan menyimpannya sebagai JSON; `muatProfil` mengembalikan objek atau `null` bila belum pernah disimpan. Dengan pembungkusan seperti ini, layar tidak perlu tahu detail nama kunci atau serialisasi — pola yang sama dengan yang Anda kenal dari Bab 11.

File: components/InfoBaris.js
```js
import { StyleSheet, Text, View } from 'react-native';

export default function InfoBaris({ label, nilai }) {
  return (
    <View style={styles.baris}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.nilai}>{nilai}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  baris: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    color: '#666666',
    fontSize: 14,
  },
  nilai: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
  },
});
```

**Penjelasan:** Komponen kecil ini menampilkan sepasang label dan nilai dalam satu baris (label di kiri, nilai di kanan). Dengan menerima props `label` dan `nilai`, komponen dapat dipakai ulang untuk koordinat maupun info perangkat — praktik komposisi komponen dari Bab 4 dan Bab 5.

File: screens/ProfilMahasiswa.js
```js
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Device from 'expo-device';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import InfoBaris from '../components/InfoBaris';
import { muatProfil, simpanProfil } from '../utils/profilStorage';

export default function ProfilMahasiswa() {
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [prodi, setProdi] = useState('');
  const [email, setEmail] = useState('');
  const [fotoUri, setFotoUri] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [perangkat, setPerangkat] = useState({
    nama: 'Memuat...',
    model: 'Memuat...',
    sistem: 'Memuat...',
  });

  useEffect(() => {
    muatDataTersimpan();
    isiInfoPerangkat();
    siapkanChannelNotifikasi();
  }, []);

  async function muatDataTersimpan() {
    const tersimpan = await muatProfil();
    if (tersimpan) {
      setNama(tersimpan.nama || '');
      setNim(tersimpan.nim || '');
      setProdi(tersimpan.prodi || '');
      setEmail(tersimpan.email || '');
      setFotoUri(tersimpan.fotoUri || null);
      setLokasi(tersimpan.lokasi || null);
    }
  }

  function isiInfoPerangkat() {
    setPerangkat({
      nama: Device.deviceName || 'Tidak diketahui',
      model: Device.modelName || 'Tidak diketahui',
      sistem: `${Device.osName} ${Device.osVersion}`,
    });
  }

  async function siapkanChannelNotifikasi() {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Notifikasi Umum',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  async function ambilFotoDariKamera() {
    const izin = await ImagePicker.requestCameraPermissionsAsync();
    if (!izin.granted) {
      Alert.alert('Izin Ditolak', 'Aplikasi tidak dapat menggunakan kamera tanpa izin Anda.');
      return;
    }
    const hasil = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!hasil.canceled) {
      setFotoUri(hasil.assets[0].uri);
    }
  }

  async function pilihFotoDariGaleri() {
    const izin = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!izin.granted) {
      Alert.alert('Izin Ditolak', 'Aplikasi tidak dapat mengakses galeri tanpa izin Anda.');
      return;
    }
    const hasil = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!hasil.canceled) {
      setFotoUri(hasil.assets[0].uri);
    }
  }

  async function ambilLokasi() {
    const izin = await Location.requestForegroundPermissionsAsync();
    if (!izin.granted) {
      Alert.alert('Izin Ditolak', 'Aplikasi tidak dapat membaca lokasi tanpa izin Anda.');
      return;
    }
    const posisi = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setLokasi({
      latitude: posisi.coords.latitude,
      longitude: posisi.coords.longitude,
      akurasi: posisi.coords.accuracy,
    });
  }

  async function simpan() {
    if (!nama.trim() || !nim.trim()) {
      Alert.alert('Data Belum Lengkap', 'Nama dan NIM wajib diisi sebelum disimpan.');
      return;
    }
    const profil = {
      nama: nama.trim(),
      nim: nim.trim(),
      prodi: prodi.trim(),
      email: email.trim(),
      fotoUri,
      lokasi,
      disimpanPada: new Date().toISOString(),
    };
    await simpanProfil(profil);
    Alert.alert('Tersimpan', 'Profil berhasil disimpan di perangkat Anda.');
  }

  async function kirimNotifikasi() {
    const izin = await Notifications.requestPermissionsAsync();
    if (!izin.granted) {
      Alert.alert('Izin Ditolak', 'Aktifkan izin notifikasi agar aplikasi dapat mengirim pengingat.');
      return;
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Profil Tersimpan',
        body: `Halo ${nama || 'Mahasiswa'}, profil Anda sudah siap digunakan.`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        channelId: 'default',
      },
    });
    Alert.alert('Terjadwal', 'Notifikasi akan muncul sekitar 5 detik lagi.');
  }

  return (
    <ScrollView style={styles.halaman} contentContainerStyle={styles.isi}>
      <Text style={styles.judul}>Profil Mahasiswa</Text>

      <View style={styles.bagianFoto}>
        {fotoUri ? (
          <Image source={{ uri: fotoUri }} style={styles.foto} />
        ) : (
          <View style={[styles.foto, styles.fotoKosong]}>
            <Text style={styles.teksFotoKosong}>Belum ada foto</Text>
          </View>
        )}
        <Pressable style={styles.tombolKecil} onPress={ambilFotoDariKamera}>
          <Text style={styles.teksTombolKecil}>Ambil Foto (Kamera)</Text>
        </Pressable>
        <Pressable style={styles.tombolKecil} onPress={pilihFotoDariGaleri}>
          <Text style={styles.teksTombolKecil}>Pilih dari Galeri</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Nama</Text>
      <TextInput
        style={styles.input}
        value={nama}
        onChangeText={setNama}
        placeholder="Nama lengkap"
      />
      <Text style={styles.label}>NIM</Text>
      <TextInput
        style={styles.input}
        value={nim}
        onChangeText={setNim}
        placeholder="Contoh: 2201001"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Program Studi</Text>
      <TextInput
        style={styles.input}
        value={prodi}
        onChangeText={setProdi}
        placeholder="Contoh: Sistem Informasi"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="nama.kecil@students.univ.ac.id"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Pressable style={styles.tombol} onPress={ambilLokasi}>
        <Text style={styles.teksTombol}>Dapatkan Lokasi Saat Ini</Text>
      </Pressable>
      {lokasi && (
        <View style={styles.kartuInfo}>
          <InfoBaris label="Latitude" nilai={lokasi.latitude.toFixed(5)} />
          <InfoBaris label="Longitude" nilai={lokasi.longitude.toFixed(5)} />
          <InfoBaris label="Akurasi" nilai={`+/- ${Math.round(lokasi.akurasi)} meter`} />
        </View>
      )}

      <Text style={styles.label}>Info Perangkat</Text>
      <View style={styles.kartuInfo}>
        <InfoBaris label="Nama Perangkat" nilai={perangkat.nama} />
        <InfoBaris label="Model" nilai={perangkat.model} />
        <InfoBaris label="Sistem Operasi" nilai={perangkat.sistem} />
      </View>

      <Pressable style={styles.tombol} onPress={simpan}>
        <Text style={styles.teksTombol}>Simpan Profil</Text>
      </Pressable>
      <Pressable style={styles.tombolSekunder} onPress={kirimNotifikasi}>
        <Text style={styles.teksTombolSekunder}>Kirim Notifikasi Uji</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  halaman: {
    flex: 1,
  },
  isi: {
    padding: 16,
    paddingBottom: 40,
  },
  judul: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bagianFoto: {
    alignItems: 'center',
    marginBottom: 16,
  },
  foto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 12,
  },
  fotoKosong: {
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teksFotoKosong: {
    color: '#666666',
  },
  tombolKecil: {
    backgroundColor: '#e8f0fe',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 6,
  },
  teksTombolKecil: {
    color: '#1a56db',
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    color: '#444444',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  tombol: {
    backgroundColor: '#1a56db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  teksTombol: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  tombolSekunder: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#1a56db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  teksTombolSekunder: {
    color: '#1a56db',
    fontSize: 16,
    fontWeight: '600',
  },
  kartuInfo: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
});
```

**Penjelasan singkat:** Layar ini adalah pusat aplikasi. Pada pemuatan awal (`useEffect`), tiga pekerjaan berjalan: `muatDataTersimpan()` memulihkan profil dari AsyncStorage, `isiInfoPerangkat()` membaca data perangkat lewat `expo-device`, dan `siapkanChannelNotifikasi()` membuat kanal notifikasi Android. Tiap tombol mengikuti pola yang sama — minta izin dengan penjelasan ketika ditekan, gunakan fitur bila disetujui, tampilkan `Alert` bila ditolak. Foto ditampilkan melalui `<Image source={{ uri: fotoUri }}>`; koordinat diformat `toFixed(5)` agar ringkas (lima angka desimal kira-kira setara presisi satu meter); dan `simpan()` memvalidasi bidang wajib sebelum menulis ke AsyncStorage. Penjelasan rinci tiap fungsi mengikuti pada bagian Penjelasan Kode.

### Penjelasan Kode

**State dan pemulihan data.** Tujuh `useState` menampung seluruh data layar: empat bidang teks, `fotoUri`, `lokasi`, dan `perangkat`. Perhatikan pola pemulihan pada `muatDataTersimpan`: hasil `muatProfil()` diuji dengan `if (tersimpan)` lalu setiap state diisi dengan nilai bawaan (`|| ''`, `|| null`) agar layar tidak pernah menerima `undefined`. Ini penting — AsyncStorage menyimpan JSON, dan objek profil lama (misalnya tanpa `lokasi`) tetap harus bisa dimuat. `useEffect` dengan daftar dependensi kosong memastikan pemulihan hanya terjadi sekali saat layar pertama kali dirender; jika pemulihan dijalankan ulang setiap render, data akan terus menimpa input pengguna.

**Izin dan pengambilan foto.** `ambilFotoDariKamera` dan `pilihFotoDariGaleri` hampir identik, membedakan hanya `launchCameraAsync` vs `launchImageLibraryAsync` dan izin yang diminta (`requestCameraPermissionsAsync` vs `requestMediaLibraryPermissionsAsync`). Opsi `allowsEditing: true` dengan `aspect: [1, 1]` mengaktifkan pemotongan persegi yang pas untuk foto profil. Hasil diuji dengan `!hasil.canceled` — pengguna dapat menekan tombol batal, dan dalam keadaan itu `assets` kosong sehingga tidak boleh diakses. Dengan `quality: 0.6`, berkas dikompresi agar ringan saat disimpan.

**Lokasi dan akurasi.** `ambilLokasi` meminta izin foreground, lalu `getCurrentPositionAsync` dengan akurasi `Balanced`. Tiga nilai disimpan: `latitude`, `longitude`, dan `akurasi` (meter). Tampilan menambahkan awalan `+/-` agar mahasiswa memahami bahwa koordinat bukan titik pasti, melainkan pusat lingkaran ketidakpastian — pemahaman yang sering diabaikan di aplikasi presensi.

**Simpan dan notifikasi.** `simpan` melakukan validasi minimal (nama dan NIM wajib) sebelum membentuk objek profil dan memanggil `simpanProfil`. Stempel waktu `disimpanPada` memakai `new Date().toISOString()` sehingga tersimpan dalam format standar. `kirimNotifikasi` meminta izin notifikasi, lalu menjadwalkan notifikasi 5 detik kemudian dengan isi yang memuat nama pengguna — contoh nyata penyatuan data profil dengan fitur perangkat.

### Hasil yang Diharapkan

- Saat pertama dibuka, layar menampilkan judul "Profil Mahasiswa", lingkaran foto kosong berteks "Belum ada foto", empat kolom input, dan tombol-tombol aksi.
- Menekan "Ambil Foto (Kamera)" memunculkan dialog izin kamera pada perangkat (pertama kali), lalu antarmuka kamera sistem; setelah memotret dan memotong, lingkaran foto terisi gambar.
- Menekan "Dapatkan Lokasi Saat Ini" menampilkan kartu berisi Latitude, Longitude, dan Akurasi (misalnya `-6.90217`, `107.60488`, `+/- 35 meter`); nilai akurasi wajar di area terbuka 5–100 meter, dan bisa lebih besar di dalam gedung.
- Menekan "Simpan Profil" menampilkan pesan "Profil berhasil disimpan di perangkat Anda." setelah nama dan NIM terisi.
- Menekan "Kirim Notifikasi Uji" menampilkan "Terjadwal", dan sekitar 5 detik kemudian notifikasi "Profil Tersimpan — Halo ..., profil Anda sudah siap digunakan." muncul di laci notifikasi.
- Menutup aplikasi lalu membukanya kembali: seluruh data (foto, koordinat, info perangkat, teks) tetap tampil tanpa perlu diisi ulang.

### Troubleshooting

**Masalah:** Foto yang baru diambil tidak tampil, atau gambar tampil sekali lalu hilang setelah aplikasi dibuka ulang.
**Penyebab:** `uri` dari image picker menunjuk ke berkas sementara di cache sistem; sistem operasi dapat membersihkannya sewaktu-waktu, dan berkas itu tidak ikut tersimpan di AsyncStorage (yang hanya menyimpan teks JSON).
**Solusi:** Salin berkas ke direktori dokumen aplikasi dengan `expo-file-system` (pola `File` pada Subbab 12.5) dan simpan `uri` hasil salinan; tampilkan gambar dari `uri` tersebut.
**Pencegahan:** Biasakan membedakan berkas sementara (cache) dan berkas permanen (documentDirectory) sejak awal; salin foto segera setelah dipilih bila foto akan disimpan lama.

**Masalah:** Notifikasi tidak muncul di Android meskipun tombol "Kirim Notifikasi Uji" menampilkan "Terjadwal".
**Penyebab:** Di Android 13 ke atas izin notifikasi ditolak (dialog izin tidak pernah muncul atau ditolak), atau kanal notifikasi belum dibuat sehingga sistem membuang notifikasi tanpa kanal.
**Solusi:** Pastikan `setNotificationChannelAsync` dipanggil sebelum menjadwalkan (kode praktikum sudah melakukannya di `siapkanChannelNotifikasi`); cek pengaturan aplikasi → Notifikasi di Android; jalankan ulang dengan `npx expo start -c` bila kanal dibuat sebelum paket terpasang dengan benar.
**Pencegahan:** Selalu periksa hasil `requestPermissionsAsync` dan tampilkan pesan jelas bila ditolak; buat kanal sekali di awal aplikasi, bukan di dalam fungsi yang jarang dipanggil.

**Masalah:** Tombol "Dapatkan Lokasi Saat Ini" membutuhkan waktu lama atau berakhir tanpa hasil di dalam ruangan.
**Penyebab:** Sinyal GPS lemah di dalam gedung; `getCurrentPositionAsync` menunggu fiksasi satelit yang mungkin tidak kunjung datang.
**Solusi:** Gunakan akurasi `Balanced` atau lebih rendah, atau terapkan pola fallback `getLastKnownPositionAsync` (Contoh 2); coba di dekat jendela atau di luar ruangan; aktifkan Wi-Fi karena posisi berbasis jaringan membantu.
**Pencegahan:** Beri umpan balik "sedang membaca lokasi..." pada UI dan batasi waktu tunggu; jangan menjadikan koordinat sebagai satu-satunya penentu keputusan di dalam ruangan.

**Masalah:** Izin ditolak secara permanen — dialog tidak muncul lagi meskipun tombol ditekan ulang.
**Penyebab:** Pengguna memilih "jangan tanyakan lagi" pada dialog sistem; `requestPermissionsAsync` berikutnya langsung mengembalikan status ditolak tanpa dialog.
**Solusi:** Deteksi `canAskAgain === false`, tampilkan penjelasan, dan arahkan pengguna ke Pengaturan aplikasi menggunakan `Linking.openSettings()`.
**Pencegahan:** Jangan meminta izin di luar konteks (misalnya saat aplikasi baru dibuka) agar pengguna tidak frustrasi dan memilih penolakan permanen; jelaskan kegunaan fitur sebelum dialog muncul.

## Studi Kasus

**Aplikasi Presensi Perkuliahan Berbasis Foto dan Lokasi.**

Presensi tatap muka konvensional — menandatangani daftar hadir — memiliki kelemahan klasik: mahasiswa dapat "menitipkan tanda tangan" kepada temannya. Banyak perguruan tinggi Indonesia kemudian beralih ke presensi digital, dan di sinilah fitur perangkat menjadi tulang punggung solusi. Skema umumnya: mahasiswa membuka aplikasi saat sesi kuliah berlangsung, sistem meminta izin kamera dan lokasi, mahasiswa berfoto (selfie) sambil sistem mencatat koordinat dan waktu. Server (Bab 10) lalu memeriksa tiga hal: apakah foto diambil pada rentang waktu sesi, apakah koordinat berada dalam radius kampus (misalnya dalam 100 meter dari gedung kuliah — nilai yang menuntut akurasi `High` pada Subbab 12.3, bukan `Balanced`), dan apakah ada anomali (dua presensi dari perangkat sama dalam satu sesi). Hasilnya, praktik titip tanda tangan secara fisik menjadi jauh lebih sulit.

Namun studi kasus ini juga memperlihatkan sisi gelapnya. Data presensi menggabungkan data pribadi yang sensitif: wajah, lokasi, dan waktu keberadaan mahasiswa. Dari tiga titik data ini, pihak kampus dapat merekonstruksi gambaran di mana dan kapan persis seorang mahasiswa berada — potensi pelanggaran privasi yang nyata. Di sinilah materi Subbab 12.6 berperan: aplikasi yang baik meminta izin dengan penjelasan yang jujur ("foto dan lokasi digunakan untuk verifikasi presensi, disimpan hanya untuk sesi ini"); menerapkan minimasi data — cukup koordinat titik cek-in, bukan jejak lokasi yang dicatat terus-menerus; tidak mengunggah data ke server tanpa tindakan eksplisit pengguna (menekan tombol presensi); dan membatasi masa simpan data sesuai kebijakan kampus. Tanpa praktik ini, solusi yang dibangun untuk melindungi integritas akademik justru menjadi alat pengawasan yang menimbulkan masalah baru — dilema yang harus dipahami setiap calon analis sistem.

Keterkaitan dengan materi bab ini langsung terlihat: aplikasi presensi memakai image picker/kamera untuk selfie (12.2), lokasi berakurasi dengan catatan akurasi (12.3), notifikasi untuk pengingat sesi kuliah (12.4), info perangkat untuk mendeteksi emulator atau perangkat tidak wajar (12.5), dan keputusan desain privasi (12.6). Jika Anda mengembangkan aplikasi ini lebih jauh — misalnya menjadikannya modul presensi pada Sistem Informasi Akademik Mobile di Project Akhir — struktur layarnya mengikuti pola navigasi Bab 7 dan integrasi datanya mengikuti pola API pada Bab 10.

## Latihan

### Soal Pemahaman

1. Jelaskan perbedaan antara mendeklarasikan izin di `app.json` (config plugin) dengan meminta izin secara runtime. Kapan masing-masing diperlukan?
2. Apa yang dimaksud dengan `canAskAgain: false` pada hasil permintaan izin, dan bagaimana aplikasi yang baik menanganinya?
3. Mengapa `expo-image-picker` dengan `launchCameraAsync` lebih sederhana daripada `expo-camera` untuk mengambil foto profil? Sebutkan satu kasus yang justru menuntut `expo-camera`.
4. Apa arti nilai `accuracy` pada hasil `getCurrentPositionAsync`? Mengapa menampilkan koordinat tanpa nilai akurasi dapat menyesatkan?
5. Jelaskan perbedaan notifikasi lokal dan notifikasi push jarak jauh, serta mengapa notifikasi push memerlukan server pengirim.
6. Mengapa `uri` hasil image picker tidak aman dijadikan satu-satunya referensi untuk penyimpanan jangka panjang?

### Soal Praktik

1. Modifikasi Aplikasi Profil Mahasiswa sehingga kartu lokasi menampilkan juga nama tempat: gunakan `Location.reverseGeocodeAsync({ latitude, longitude })` setelah koordinat didapat, lalu tampilkan `street` dan `city` dari hasilnya pada `InfoBaris`.
2. Ubah fungsi `simpan` agar mengirim notifikasi otomatis setelah profil tersimpan (tanpa tombol "Kirim Notifikasi Uji"), dengan judul "Profil Tersimpan" dan menggunakan data NIM pada isi pesan.
3. Tambahkan tombol "Hapus Profil" yang menghapus data dari AsyncStorage (gunakan `AsyncStorage.removeItem` atau fungsi baru di `profilStorage.js`), mengosongkan seluruh state, dan menampilkan foto kosong kembali.

### Soal Analisis

1. Sebuah startup aplikasi cek-in kantor meminta seluruh izin (kamera, galeri, lokasi, notifikasi, dan kontak) sekaligus saat aplikasi pertama kali dibuka, dengan alasan "biar tidak repot". Evaluasi keputusan tersebut ditinjau dari tiga sudut: pengalaman pengguna, tingkat penolakan izin yang mungkin terjadi, dan kesesuaian dengan prinsip minimasi data pada Subbab 12.6. Berikan rekomendasi skema permintaan izin yang lebih baik.

## Tantangan

1. **Penyimpanan foto permanen.** Saat pengguna memilih/memotret foto, salin berkas dari `uri` sementara ke `Paths.document` menggunakan `expo-file-system` (misalnya dengan `File` dan metode salinnya *⚠ version-sensitive*), simpan `uri` hasil salinan ke AsyncStorage, dan buktikan bahwa foto masih tampil setelah aplikasi ditutup dan dibuka kembali selama berkas tidak dihapus.
2. **Radius kampus.** Tentukan satu koordinat kampus (misalnya gedung laboratorium tempat Anda kuliah), lalu hitung jarak antara posisi pengguna dan koordinat tersebut menggunakan rumus haversine (implementasikan sendiri dengan fungsi trigonometri JavaScript). Tampilkan jarak dalam meter dan beri peringatan bila pengguna berada di luar radius 500 meter.
3. **Pengingat terjadwal.** Tambahkan kolom input tanggal dan jam, lalu jadwalkan notifikasi lokal pada waktu tersebut menggunakan pemicu `DATE` (`SchedulableTriggerInputTypes.DATE`). Ujilah dengan waktu 1–2 menit ke depan dan catat perilaku notifikasi saat aplikasi sedang dibuka, ditutup, dan setelah perangkat di-reboot.

## Rangkuman

1. API perangkat adalah jembatan antara JavaScript dan fitur perangkat keras/sistem; aksesnya dibatasi sandbox dan diatur izin untuk melindungi pengguna.
2. Izin dikelola dua lapis: deklarasi lewat config plugin di `app.json` (menghasilkan izin `Info.plist` iOS dan `AndroidManifest.xml` saat build) dan permintaan runtime dengan `getPermissionsAsync`/`requestPermissionsAsync`.
3. Penolakan izin harus ditangani sebagai keadaan normal: beri penjelasan, dan arahkan ke Pengaturan sistem bila `canAskAgain` sudah `false`.
4. `expo-image-picker` cukup untuk mengambil foto profil (kamera maupun galeri) dengan hasil `uri`; `expo-camera` diperlukan bila aplikasi butuh pratinjau atau pemindaian langsung.
5. `expo-location` membaca koordinat beserta nilai akurasi; tampilkan akurasi bersama koordinat dan pilih tingkat akurasi serendah mungkin yang memenuhi kebutuhan.
6. Notifikasi lokal dijadwalkan langsung di perangkat (`scheduleNotificationAsync`); notifikasi push jarak jauh membutuhkan server pengirim dan tidak dibahas sebagai materi praktik bab ini.
7. `expo-file-system` mengelola berkas di direktori privat aplikasi dengan API `File`/`Paths`; berkas sementara dari image picker harus disalin ke direktori dokumen agar permanen.
8. `expo-device` menyediakan info perangkat (nama, model, OS) yang berguna untuk penyesuaian tampilan dan deteksi emulator.
9. Tiga prinsip privasi yang wajib dipegang: minta izin dengan penjelasan, jangan mengunggah tanpa persetujuan, dan minimalkan data yang dikumpulkan.
10. Proyek profil mahasiswa ini adalah contoh pola "minta izin → gunakan fitur → simpan lokal" yang menjadi dasar aplikasi-aplikasi berbasis perangkat yang lebih besar.

## Refleksi

1. Pernahkah Anda menolak permintaan izin sebuah aplikasi? Apa yang membuat Anda menolak, dan pelajaran apa yang dapat Anda terapkan saat menulis teks izin aplikasi sendiri?
2. Dari enam paket yang dipelajari di bab ini, fitur perangkat mana yang paling mungkin Anda butuhkan pada aplikasi yang ingin Anda bangun, dan mengapa?
3. Bagaimana perasaan Anda ketika sebuah aplikasi menyimpan lokasi Anda tanpa penjelasan yang jelas? Bandingkan dengan aplikasi yang menjelaskan kegunaannya — mana yang lebih Anda percaya?
4. Jika Anda bekerja sebagai analis sistem di sebuah kampus, kriteria apa yang akan Anda tetapkan bagi vendor aplikasi presensi sebelum data mahasiswa diserahkan?

## Evaluasi Bab

### Pilihan Ganda

1. Tujuan utama model izin runtime pada Android dan iOS adalah ....
   A. mempercepat kinerja aplikasi
   B. melindungi pengguna dari akses data/fitur tanpa sepengetahuan
   C. mengurangi jumlah baris kode aplikasi
   D. mempermudah pengembang memasang iklan

2. Pada aplikasi iOS, informasi "untuk apa kamera digunakan" harus dideklarasikan di dalam ....
   A. `package.json`
   B. `babel.config.js`
   C. `Info.plist` (via config plugin di `app.json`)
   D. `App.js`

3. Properti hasil permintaan izin yang menunjukkan pengguna telah memilih "jangan tanyakan lagi" adalah ....
   A. `granted`
   B. `status`
   C. `canAskAgain`
   D. `isPermanent`

4. Untuk mengambil satu foto profil dengan antarmuka sistem tanpa kode pratinjau, paket yang paling tepat adalah ....
   A. `expo-camera`
   B. `expo-image-picker` dengan `launchCameraAsync`
   C. `expo-notifications`
   D. `expo-device`

5. Nilai `accuracy` pada hasil `getCurrentPositionAsync` menyatakan ....
   A. kecepatan perangkat saat pengukuran
   B. perkiraan radius ketidakpastian posisi dalam meter
   C. jumlah satelit yang menangkap sinyal
   D. ketinggian perangkat dari permukaan laut

6. Perbedaan utama notifikasi lokal dan notifikasi push jarak jauh adalah ....
   A. notifikasi lokal hanya berjalan di Android
   B. notifikasi push dikirim dari server dan membutuhkan layanan pengirim
   C. notifikasi lokal membutuhkan koneksi internet
   D. tidak ada perbedaan; keduanya selalu memerlukan server

7. Kanal notifikasi (notification channel) pada Android berfungsi untuk ....
   A. menyimpan riwayat notifikasi
   B. mengelompokkan notifikasi agar pengguna dapat mengatur perilakunya
   C. mengenkripsi isi notifikasi
   D. mengirim notifikasi ke server

8. Yang dimaksud prinsip minimasi data (data minimization) adalah ....
   A. menghapus aplikasi setelah data dikumpulkan
   B. mengumpulkan data sesedikit mungkin yang masih memenuhi fungsi aplikasi
   C. menyembunyikan data dari pengguna
   D. meminta semua izin sekaligus agar data lengkap

9. `uri` dari hasil image picker perlu disalin ke direktori dokumen aplikasi karena ....
   A. `uri` tersebut menunjuk berkas sementara yang dapat dibersihkan sistem
   B. `uri` tersebut tidak dapat dibaca oleh `<Image>`
   C. AsyncStorage tidak dapat menyimpan teks
   D. aplikasi lain akan membaca `uri` tersebut

10. Informasi perangkat (nama perangkat, model, OS) dari `expo-device` berguna untuk ....
    A. memperbesar penyimpanan aplikasi
    B. menyesuaikan tampilan dan mendeteksi emulator
    C. mengubah nomor IMEI perangkat
    D. mempercepat koneksi internet

### Soal Uraian

1. Jelaskan alur lengkap izin lokasi pada aplikasi Android mulai dari deklarasi di `app.json` hingga pengguna menolaknya, termasuk apa yang terjadi pada `canAskAgain` dan langkah apa yang diambil aplikasi yang baik.
2. Bandingkan `expo-camera` dan `expo-image-picker` untuk tiga skenario: foto profil, pemindaian kode QR, dan filter kamera real-time. Tentukan paket yang tepat untuk tiap skenario beserta alasannya.
3. Rancang kebijakan privasi singkat (5–8 baris) untuk Aplikasi Profil Mahasiswa: data apa yang dikumpulkan, untuk apa, berapa lama disimpan, dan bagaimana pengguna dapat menghapusnya. Gunakan istilah yang mudah dipahami pengguna awam.

### Kunci Jawaban

<details>
<summary>Klik untuk melihat kunci jawaban pilihan ganda</summary>

1. B — model izin runtime melindungi pengguna dari akses fitur/data tanpa sepengetahuan.
2. C — penggunaan fitur iOS dideklarasikan di `Info.plist`, yang dihasilkan config plugin di `app.json` saat build.
3. C — `canAskAgain: false` menandakan dialog tidak akan muncul lagi.
4. B — `launchCameraAsync` dari `expo-image-picker` memakai antarmuka kamera sistem tanpa kode pratinjau.
5. B — `accuracy` adalah perkiraan radius ketidakpastian posisi dalam meter.
6. B — notifikasi push dikirim server dan membutuhkan layanan pengirim (mis. Expo Push Service/FCM/APNs).
7. B — kanal mengelompokkan notifikasi agar perilakunya dapat diatur pengguna.
8. B — minimasi data berarti mengumpulkan sesedikit mungkin yang masih memenuhi fungsi.
9. A — `uri` result picker menunjuk berkas sementara di cache yang dapat dibersihkan sistem.
10. B — info perangkat digunakan untuk penyesuaian tampilan dan deteksi emulator.

</details>