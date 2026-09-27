// Konfigurasi Marp CLI untuk folder ini.
// Dipakai otomatis bila perintah marp/marp-cli dijalankan dari folder ini.
/** @type {import('@marp-team/marp-cli').Config} */
export default {
  // Daftarkan tema di ./theme agar deck bisa memakai `theme: academic`.
  themeSet: ['./theme'],

  // Wajib untuk PDF/PPTX/PNG bila deck memuat gambar lokal (mis. diagram hasil bake).
  allowLocalFiles: true,

  // Bahasa dokumen HTML hasil konversi (ganti ke 'en' untuk deck berbahasa Inggris).
  lang: 'id',

  // Bookmark PDF berdasarkan slide + heading.
  pdfOutlines: true,

  options: {
    // Jangan ubah baris baru di paragraf menjadi <br> (perilaku CommonMark).
    markdown: { breaks: false },
  },
}
