# Penjelasan Perintah Terminal Linux/Mac Beserta Contohnya

Terminal adalah aplikasi yang digunakan untuk menjalankan perintah melalui teks atau command line. Terminal sering digunakan oleh programmer untuk mengelola file, folder, menjalankan program, dan mengembangkan aplikasi.

Berikut penjelasan 6 perintah dasar terminal beserta fungsi, sintaks, dan contohnya.

## 1. `cd` — Change Directory

Perintah `cd` digunakan untuk berpindah dari satu direktori (folder) ke direktori lainnya.

Sintaks:

Bash

```
cd nama_folder
```

Contoh penggunaan:

|
Perintah

|

Fungsi

|
| --- | --- |
|

`cd Documents`

|

Masuk ke folder Documents

|
|

`cd ..`

|

Kembali ke folder sebelumnya (parent directory)

|
|

`cd /`

|

Masuk ke direktori root

|
|

`cd ~`

|

Kembali ke home directory

|
|

`cd Documents/project`

|

Masuk ke folder project di dalam Documents

|

Contoh praktik:

Misalnya struktur folder seperti berikut:

```
home/
└── user/
    └── Documents/
        └── project/
            └── app.js
```

Jika posisi terminal saat ini berada di `/home/user`, jalankan:

Bash

```
cd Documents
```

Sekarang posisi berada di:

```
/home/user/Documents
```

Kemudian jalankan:

Bash

```
cd project
```

Posisi sekarang menjadi:

```
/home/user/Documents/project
```

Untuk kembali satu folder ke atas:

Bash

```
cd ..
```

Catatan: `cd` tanpa argumen biasanya membawa pengguna kembali ke home directory.

## 2. `mkdir` — Make Directory

Perintah `mkdir` digunakan untuk membuat direktori atau folder baru.

Sintaks:

Bash

```
mkdir nama_folder
```

Contoh:

Bash

```
mkdir project
```

Perintah tersebut membuat folder bernama `project` di direktori aktif saat ini.

Jika ingin membuat beberapa folder sekaligus:

Bash

```
mkdir frontend backend database
```

Hasilnya:

```
.
├── frontend/
├── backend/
└── database/
```

Membuat folder bertingkat menggunakan opsi `-p`:

Bash

```
mkdir -p project/src/controllers
```

Opsi `-p` akan membuat folder induk yang belum ada secara otomatis.

Contoh struktur hasilnya:

```
project/
└── src/
    └── controllers/
```

Perintah ini berguna ketika membuat struktur folder aplikasi Node.js atau Express.

## 3. `ls` / `ll` — List Files

Perintah `ls` digunakan untuk menampilkan daftar file dan folder pada direktori tertentu.

Sintaks:

Bash

```
ls
```

Contoh hasil:

```
Documents  Downloads  project  gambar.png
```

Artinya, pada direktori aktif terdapat tiga folder dan satu file.

Beberapa variasi yang sering digunakan:

|
Perintah

|

Fungsi

|
| --- | --- |
|

`ls`

|

Menampilkan nama file dan folder

|
|

`ls -l`

|

Menampilkan daftar dalam format panjang, termasuk izin akses, pemilik, ukuran, dan tanggal

|
|

`ls -a`

|

Menampilkan file tersembunyi, termasuk yang diawali titik (`.`)

|
|

`ls -la`

|

Menampilkan semua file dalam format panjang

|
|

`ls Documents`

|

Menampilkan isi folder Documents

|

Contoh:

Bash

```
ls -la
```

Hasilnya kurang lebih:

```
drwxr-xr-x  5 user staff  160 Sep 28 09:00 .
drwxr-xr-x 10 user staff  320 Sep 28 08:00 ..
-rw-r--r--  1 user staff  120 Sep 28 09:00 app.js
-rw-r--r--  1 user staff  250 Sep 28 09:00 .env
```

Keterangan:

* `.` menunjukkan direktori saat ini.

* `..` menunjukkan direktori induk.

* `.env` adalah contoh file tersembunyi karena namanya diawali titik.

Apa itu `ll`?

Bash

```
ll
```

Pada banyak sistem Linux, `ll` merupakan alias dari `ls -l` atau `ls -la`. Namun, `ll` bukan perintah standar yang tersedia di semua sistem. Di macOS, misalnya, alias ini mungkin belum dikonfigurasi.

Jika `ll` tidak dikenali, gunakan:

Bash

```
ls -l
```

## 4. `clear` — Membersihkan Tampilan Terminal

Perintah `clear` digunakan untuk membersihkan tampilan terminal agar layar terlihat kosong.

Sintaks:

Bash

```
clear
```

Contoh:

Sebelum menjalankan `clear`:

```
user@mac project % ls
app.js  package.json  node_modules

user@mac project % pwd
/Users/user/project
```

Kemudian jalankan:

Bash

```
clear
```

Tampilan terminal akan dibersihkan sehingga terlihat kosong dan siap menerima perintah baru.

Perlu diperhatikan bahwa `clear` hanya membersihkan tampilan layar, bukan menghapus file, folder, atau riwayat perintah dari shell.

Alternatif shortcut yang umum digunakan:

* Linux: `Ctrl + L`

* macOS Terminal: `Ctrl + L`

## 5. `rm` — Remove (Menghapus File atau Folder)

Perintah `rm` digunakan untuk menghapus file atau folder.

### A. Menghapus file

Sintaks:

Bash

```
rm nama_file
```

Contoh:

Bash

```
rm app.js
```

File `app.js` akan dihapus dari direktori aktif.

Menghapus beberapa file sekaligus:

Bash

```
rm file1.txt file2.txt file3.txt
```

### B. Menghapus folder kosong

Gunakan perintah `rmdir` untuk menghapus folder yang kosong:

Bash

```
rmdir folder_kosong
```

### C. Menghapus folder beserta isinya

Gunakan opsi `-r` (recursive):

Bash

```
rm -r project
```

Perintah tersebut menghapus folder `project` beserta file dan subfolder di dalamnya.

### D. Menghapus folder dengan `rm -rf`

Bash

```
rm -rf project
```

Penjelasan opsi:

|
Opsi

|

Arti

|
| --- | --- |
|

`-r`

|

Recursive, menghapus folder beserta seluruh isi di dalamnya

|
|

`-f`

|

Force, tidak meminta konfirmasi dan mengabaikan file yang tidak ditemukan

|

Contoh struktur sebelum dihapus:

```
project/
├── app.js
├── package.json
└── src/
    └── index.js
```

Jalankan:

Bash

```
rm -rf project
```

Folder `project` dan seluruh isinya akan dihapus.

Peringatan penting

Perintah `rm -rf` sangat berbahaya jika salah menentukan lokasi atau nama folder. Penghapusan biasanya tidak masuk ke Recycle Bin atau Trash dan sulit dipulihkan.

Sebelum menghapus, periksa lokasi dengan:

Bash

```
pwd
ls
```

Jangan menjalankan `rm -rf /` atau perintah penghapusan dengan path yang belum dipastikan.

## 6. `touch` — Membuat File

Perintah `touch` digunakan untuk membuat file kosong jika file tersebut belum ada. Jika file sudah ada, `touch` biasanya memperbarui waktu akses atau modifikasinya tanpa menghapus isi file.

Sintaks:

Bash

```
touch nama_file
```

Contoh membuat file JavaScript:

Bash

```
touch app.js
```

File `app.js` akan dibuat di direktori aktif.

Membuat beberapa file sekaligus:

Bash

```
touch index.js app.js server.js
```

Hasilnya:

```
.
├── index.js
├── app.js
└── server.js
```

Membuat file di dalam folder tertentu:

Bash

```
touch src/index.js
```

Folder `src` harus sudah ada. `touch` tidak otomatis membuat folder induk yang belum tersedia.

Untuk memeriksa file yang sudah dibuat:

Bash

```
ls
```

Untuk mengisi file dengan kode, kamu bisa menggunakan editor seperti VS Code:

Bash

```
code app.js
```

Perintah `code` berfungsi membuka file di Visual Studio Code jika command line VS Code sudah terpasang.

# Ringkasan Perintah Terminal

Tabel berikut bisa digunakan sebagai contekan saat belajar terminal.

|
Perintah

|

Fungsi

|

Contoh

|
| --- | --- | --- |
|

`cd`

|

Berpindah direktori

|

`cd Documents`

|
|

`mkdir`

|

Membuat folder

|

`mkdir project`

|
|

`ls`

|

Melihat isi direktori

|

`ls -la`

|
|

`ll`

|

Alias daftar panjang, jika tersedia

|

`ll`

|
|

`clear`

|

Membersihkan tampilan terminal

|

`clear`

|
|

`rm`

|

Menghapus file

|

`rm app.js`

|
|

`rm -r`

|

Menghapus folder dan isinya

|

`rm -r project`

|
|

`rm -rf`

|

Menghapus folder secara paksa

|

`rm -rf project`

|
|

`touch`

|

Membuat file kosong

|

`touch app.js`

|

## Latihan praktik

Coba jalankan perintah berikut secara berurutan di terminal untuk membuat struktur proyek sederhana:

Bash

```
# 1. Membuat folder proyek
mkdir belajar-terminal

# 2. Masuk ke folder proyek
cd belajar-terminal

# 3. Membuat folder src
mkdir src

# 4. Masuk ke folder src
cd src

# 5. Membuat file JavaScript
touch index.js

# 6. Melihat isi folder
ls -la

# 7. Kembali ke folder belajar-terminal
cd ..

# 8. Membersihkan tampilan terminal
clear
```

Struktur folder yang terbentuk:

```
belajar-terminal/
└── src/
    └── index.js
```

Dengan memahami keenam perintah ini, kamu sudah memiliki dasar untuk navigasi direktori, membuat struktur proyek, dan mengelola file melalui terminal Linux maupun macOS.
