# Snapshot per Demo

Satu folder per demo, berisi berkas yang **ditulis pada demo itu saja** — sama dengan baris
**Berkas** di [`../LIST-TUTORIAL-DEMO.md`](../LIST-TUTORIAL-DEMO.md). Berkas yang tidak berubah
tidak diulang; ambil dari folder demo sebelumnya atau dari project akhir di `../kantin-kampus/`.

Snapshot ini untuk dibaca sebelum kelas dan untuk dipulihkan kalau ketikan di depan kelas meleset.
Yang dijalankan tetap project di `../kantin-kampus/`.

| Folder | Isi | Catatan |
|---|---|---|
| `demo-0/` | `App.js` | Versi kosong: satu `Text` di tengah layar |
| `demo-1/` | `App.js` | Versi web sebagai komentar + versi native (`View`, `Text`, `Pressable`) |
| `demo-2/` | `App.js`, `components/KartuMenu.js`, `data/menu.js` | Gaya masih inline; delapan menu |
| `demo-3/` | `components/KartuMenu.js`, `theme/warna.js` | `App.js` tidak berubah dari Demo 2 |
| `demo-4/` | `App.js`, `screens/BerandaScreen.js` | `App.js` menukar satu import |
| `demo-5/` | `data/menu.js`, `screens/DaftarScreen.js`, `App.js` | `data/menu.js` di sini **hanya potongan** `menuPanjang`, ditambahkan ke berkas Demo 2 |
| `demo-6/` | `App.js`, `screens/KatalogScreen.js` | Keadaan akhir; sama dengan isi `../kantin-kampus/` |

Demo 7 tidak punya folder: isinya kuis dan daftar centang, tidak ada kode baru
([`../CHECKLIST-TERAMATI.md`](../CHECKLIST-TERAMATI.md)).

## Dua penyimpangan kecil dari naskah

1. **`App.js` pada Demo 4 dan 5.** Naskah hanya menyebut berkas layar barunya, padahal layar itu
   harus dipanggil dari `App.js` agar terlihat. Snapshot ini memuat `App.js` versi tukar-satu-import
   supaya tahapnya bisa dijalankan apa adanya.
2. **`theme/warna.js` dipakai sejak Demo 4.** Berkasnya lahir di Demo 3; snapshot Demo 4 dan 5
   tidak menyalinnya lagi.

## Cara memakai snapshot di kelas

Kalau ada yang tertinggal, salin satu berkas dari folder yang sesuai ke `../kantin-kampus/`:

```bash
cd demo/bab-05-live
cp langkah/demo-3/components/KartuMenu.js kantin-kampus/components/KartuMenu.js
cp langkah/demo-3/theme/warna.js kantin-kampus/theme/warna.js
```

Simpan project akhir dulu sebelum menimpa, atau salin balik dari `langkah/demo-6/` setelah selesai.
