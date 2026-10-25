# LAPORAN-BUILD — siakad-mobile

Isi setiap bagian. Laporan ini dinilai bersama demo aplikasi.

- Nama / NIM:
- Tanggal build:
- Versi aplikasi (`app.json` → `expo.version`):
- Commit terakhir:

## 1. Identitas aplikasi

| Butir | Nilai | Alasan |
| --- | --- | --- |
| `name` | | |
| `slug` | | |
| Application ID / bundle identifier | | Aturan reverse-domain |
| `version` | | |
| Ikon & splash | | Berkas mana yang dipakai |

## 2. Profil build yang dicoba

| Profil | Perintah | Hasil | Produk | Waktu build |
| --- | --- | --- | --- | --- |
| `preview` | `eas build -p android --profile preview` | | APK | |
| `production` | `eas build -p android --profile production` | | AAB | |

Tempel tautan build EAS di sini:

- Preview:
- Production:

## 3. Variabel lingkungan

| Variabel | Nilai di build | Aman dibundel? | Alasan |
| --- | --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | | ya / tidak | |

Jelaskan mengapa `JWT_SECRET` **tidak** boleh memakai awalan `EXPO_PUBLIC_`.

## 4. Penandatanganan

- Siapa yang memegang keystore:
- Di mana disimpan (jangan tempel isinya):
- Apa yang terjadi bila kunci ini hilang setelah aplikasi dirilis di Play Store:

## 5. Rencana distribusi

| Butir | Rencana |
| --- | --- |
| Track pertama di Play Console | internal / closed / open |
| Cara pengujian sebelum produksi | |
| Siapa yang memberi persetujuan rilis | |
| Rencana versi berikutnya | |

## 6. Kendala dan pelajaran

Tuliskan minimal tiga kendala nyata yang muncul saat build (bukan yang kamu bayangkan),
beserta cara kamu menyelesaikannya.
