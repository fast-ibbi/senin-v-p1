// utils/rupiah.js — format harga tanpa Intl.
//
// Kenapa tidak `toLocaleString('id-ID')`? Dukungan Intl di Hermes berbeda antar
// versi dan antar platform, jadi hasilnya bisa "15000" di satu perangkat dan
// "15.000" di perangkat lain. Fungsi biasa di bawah berperilaku sama di
// Android, iOS, dan web — sekaligus latihan perulangan Bab 3.
export function rupiah(nilai) {
  const bulat = Math.round(Math.abs(nilai));
  const angka = String(bulat);
  let hasil = '';

  for (let i = 0; i < angka.length; i += 1) {
    if (i > 0 && (angka.length - i) % 3 === 0) hasil += '.';
    hasil += angka[i];
  }

  return `${nilai < 0 ? '-' : ''}Rp${hasil}`;
}
