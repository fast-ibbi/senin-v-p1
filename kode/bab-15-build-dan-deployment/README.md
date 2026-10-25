# Bab 15 — Build dan Deployment

Slide: [`slides/bab-15-build-dan-deployment.md`](../../slides/bab-15-build-dan-deployment.md)

Bab terakhir tidak menambah layar. Yang ditambahkan adalah **identitas rilis**: nama paket
yang permanen, nomor versi, tiga profil build, variabel lingkungan, dan template laporan
build yang menjadi syarat penilaian.

## Tujuan pembelajaran

- Membedakan development build dan production build, lalu menentukan kapan memakainya
- Menjelaskan peran EAS Build dan tiga profil build beserta produknya (APK/AAB)
- Mengonfigurasi `app.json`: name, slug, application ID, versi, ikon, splash screen
- Menganalisis peran environment variable `EXPO_PUBLIC_` dan batasannya terhadap secret
- Mengidentifikasi konsep signing dan risiko kehilangan kunci penandatanganan
- Merancang strategi distribusi Google Play dan memahami alur App Store

## Isi folder

| Berkas | Isi |
| --- | --- |
| `app.json` | Identitas final: `ac.id.ibbi.siakad`, versi 1.0.0, ikon, splash, `extra.eas.projectId` |
| `eas.json` | Tiga profil build + bagian `submit` |
| `.env.example` | Contoh `EXPO_PUBLIC_API_URL` beserta peringatannya |
| `LAPORAN-BUILD.md` | Template laporan yang harus diisi |
| `backend/` | Varian JWT, sama seperti bab 13–14 |

## Tiga profil build

| Profil | Produk | Dipakai untuk | Catatan |
| --- | --- | --- | --- |
| `development` | APK + development client | menguji modul native yang tidak ada di Expo Go | butuh `expo-dev-client` |
| `preview` | APK | dibagikan ke dosen/teman lewat tautan | paling sering dipakai di kelas |
| `production` | AAB | diunggah ke Play Console | tidak bisa dipasang langsung |

`android.buildType` menentukan bentuk berkasnya: `apk` bisa dipasang langsung, `app-bundle`
hanya diterima Play Store.

## Sebelum build pertama

```bash
npm install -g eas-cli        # sekali saja
eas login                     # akun Expo
eas init                      # menulis projectId ke app.json
```

Ganti `extra.eas.projectId` di `app.json` dengan nilai dari `eas init`. Nilai contoh
`00000000-...` hanya penanda.

```bash
eas build -p android --profile preview      # menghasilkan APK
eas build -p android --profile production   # menghasilkan AAB
```

## Application ID: keputusan yang tidak bisa dibatalkan

`ac.id.ibbi.siakad` mengikuti aturan reverse-domain: domain kampus dibalik, lalu nama
aplikasi. Setelah versi pertama terbit di Play Store, nilai ini **tidak bisa diubah** —
mengubahnya berarti aplikasi baru dengan nol unduhan.

`versionCode` (Android) dan `buildNumber` (iOS) naik setiap unggahan. Profil `production`
memakai `autoIncrement: true`, jadi EAS menaikkannya sendiri.

## `EXPO_PUBLIC_` bukan tempat rahasia

| Variabel | Boleh dibundel? | Alasan |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | ya | alamat server memang diketahui publik |
| `JWT_SECRET` | **tidak** | nilai ini tersisip ke bundel; siapa pun yang memegang APK bisa membacanya |
| Kunci keystore | **tidak** | disimpan di EAS/secret manager, tidak pernah di repo |

Bundel JavaScript bisa dibongkar. Perlakukan setiap nilai `EXPO_PUBLIC_*` seperti teks yang
tercetak di halaman depan aplikasi.

## Checkpoint

1. `npx expo-doctor` tidak melaporkan masalah konfigurasi.
2. `app.json` memuat `android.package` dan `ios.bundleIdentifier` yang sama (`ac.id.ibbi.siakad`).
3. `eas.json` punya tiga profil; `preview` menghasilkan APK, `production` menghasilkan AAB.
4. Kamu bisa menjelaskan mengapa AAB tidak bisa langsung dipasang di ponsel.
5. `LAPORAN-BUILD.md` terisi lengkap, termasuk rencana distribusi.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| `eas build` menolak: project not configured | `eas init` belum dijalankan | Jalankan `eas init`, lalu salin `projectId` |
| Build gagal: `Invalid application ID` | Format bukan reverse-domain | Pakai `ac.id.<kampus>.<aplikasi>`, huruf kecil |
| APK terpasang tetapi API gagal | `EXPO_PUBLIC_API_URL` masih `localhost` | Untuk ponsel, isi IP laptop; untuk emulator, `10.0.2.2` |
| `versionCode already used` | Nomor versi tidak naik | Pakai `autoIncrement` atau naikkan manual |
| Kunci keystore hilang | Tidak ada cadangan | Setelah rilis, aplikasi tidak bisa diperbarui — mulai ulang dengan ID baru |

## Yang berubah dibanding bab 14

| Berkas | Perubahan |
| --- | --- |
| `app.json` | Tambah `android.package`, `ios.bundleIdentifier`, `versionCode`, `buildNumber`, `extra.eas` |
| `eas.json` | Baru — tiga profil + submit |
| `.env.example` | Baru — contoh variabel lingkungan |
| `LAPORAN-BUILD.md` | Baru — template laporan akhir |
| Kode aplikasi | Tidak berubah dari bab 14 |
