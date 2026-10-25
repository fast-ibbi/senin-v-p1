/**
 * Validasi sebagai fungsi murni.
 *
 * Aturan: menerima nilai, mengembalikan hasil, tidak menyentuh state atau UI.
 * Karena itu aturan yang sama bisa dipakai form login, form registrasi, dan
 * diuji tanpa React sama sekali — lihat bab 14.
 *
 * Bentuk hasil selalu sama:
 *   { sah: true }                       → tidak ada masalah
 *   { sah: false, pesan: '...' }        → satu pesan untuk satu field
 */

export const POLA_NIM = /^\d{8}$/;
export const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PANJANG_PASSWORD = 8;

export function validasiNim(nim) {
  const bersih = String(nim ?? '').trim();
  if (bersih.length === 0) return { sah: false, pesan: 'NIM wajib diisi.' };
  if (!POLA_NIM.test(bersih)) return { sah: false, pesan: 'NIM harus 8 angka.' };
  return { sah: true };
}

export function validasiNama(nama) {
  const bersih = String(nama ?? '').trim();
  if (bersih.length === 0) return { sah: false, pesan: 'Nama wajib diisi.' };
  if (bersih.length < 3) return { sah: false, pesan: 'Nama minimal 3 karakter.' };
  return { sah: true };
}

export function validasiEmail(email) {
  const bersih = String(email ?? '').trim();
  if (bersih.length === 0) return { sah: false, pesan: 'Email wajib diisi.' };
  if (!POLA_EMAIL.test(bersih)) return { sah: false, pesan: 'Format email belum benar.' };
  return { sah: true };
}

export function validasiPassword(password) {
  const isi = String(password ?? '');
  if (isi.length === 0) return { sah: false, pesan: 'Password wajib diisi.' };
  if (isi.length < MIN_PANJANG_PASSWORD) {
    return { sah: false, pesan: `Password minimal ${MIN_PANJANG_PASSWORD} karakter.` };
  }
  return { sah: true };
}

export function validasiKonfirmasi(password, konfirmasi) {
  if (String(konfirmasi ?? '').length === 0) {
    return { sah: false, pesan: 'Ulangi password terlebih dahulu.' };
  }
  if (password !== konfirmasi) return { sah: false, pesan: 'Password tidak sama.' };
  return { sah: true };
}

export function validasiProdi(prodi) {
  const daftar = ['Sistem Informasi', 'Teknik Informatika'];
  if (!daftar.includes(prodi)) {
    return { sah: false, pesan: 'Pilih program studi.' };
  }
  return { sah: true };
}

/**
 * Menggabungkan hasil per field menjadi satu keputusan.
 * `errors` hanya memuat field yang bermasalah — itulah yang dipakai form untuk
 * menampilkan pesan di bawah kolom yang salah, bukan satu pesan di atas.
 */
export function validasiLogin({ nim, password }) {
  const errors = {};

  const hasilNim = validasiNim(nim);
  if (!hasilNim.sah) errors.nim = hasilNim.pesan;

  const hasilPassword = validasiPassword(password);
  if (!hasilPassword.sah) errors.password = hasilPassword.pesan;

  return { sah: Object.keys(errors).length === 0, errors };
}

export function validasiRegistrasi({ nim, nama, email, prodi, password, konfirmasi }) {
  const errors = {};

  const pemeriksa = [
    ['nim', validasiNim(nim)],
    ['nama', validasiNama(nama)],
    ['email', validasiEmail(email)],
    ['prodi', validasiProdi(prodi)],
    ['password', validasiPassword(password)],
    ['konfirmasi', validasiKonfirmasi(password, konfirmasi)],
  ];

  for (const [field, hasil] of pemeriksa) {
    if (!hasil.sah) errors[field] = hasil.pesan;
  }

  return { sah: Object.keys(errors).length === 0, errors };
}

/** 0–4; dipakai untuk indikator kekuatan password di form registrasi. */
export function kekuatanPassword(password) {
  const isi = String(password ?? '');
  if (isi.length === 0) return 0;

  let skor = 0;
  if (isi.length >= MIN_PANJANG_PASSWORD) skor += 1;
  if (/[A-Z]/.test(isi)) skor += 1;
  if (/[0-9]/.test(isi)) skor += 1;
  if (/[^A-Za-z0-9]/.test(isi)) skor += 1;

  return skor;
}

export const labelKekuatan = ['Kosong', 'Lemah', 'Cukup', 'Kuat', 'Sangat kuat'];
