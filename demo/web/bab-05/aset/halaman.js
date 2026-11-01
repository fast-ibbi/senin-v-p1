/*
 * Satu-satunya JavaScript yang mengubah tampilan di halaman ini: penggeser lebar
 * bingkai ponsel dan tiga tombol preset.
 *
 * Semua contoh di dalam bingkai sengaja statis. Tidak ada contoh yang bisa diklik:
 * yang diperlihatkan adalah hasil akhir pada satu keadaan, dan keadaan lain
 * ditampilkan berdampingan sebagai bingkai terpisah.
 *
 * Ditulis sebagai skrip biasa (bukan modul) dan tanpa `fetch sama sekali, sehingga
 * halaman tetap berfungsi saat dibuka lewat file:// dari flashdisk di lab.
 */
(function () {
  'use strict'

  var akar = document.documentElement
  var slider = document.querySelector('[data-kendali-lebar]')
  if (!slider) return

  var nilai = document.querySelector('[data-kendali-nilai]')
  var preset = Array.prototype.slice.call(document.querySelectorAll('[data-preset]'))
  var min = Number(slider.min) || 320
  var max = Number(slider.max) || 1024
  var bawaan = Number(slider.value) || 390

  function terapkan(lebar) {
    var v = Math.round(Math.min(max, Math.max(min, Number(lebar) || bawaan)))
    akar.style.setProperty('--lebar-bingkai', v + 'px')
    slider.value = String(v)
    if (nilai) nilai.textContent = v + ' px'
    preset.forEach(function (tombol) {
      tombol.setAttribute('aria-pressed', String(Number(tombol.dataset.preset) === v))
    })
  }

  slider.addEventListener('input', function () {
    terapkan(slider.value)
  })

  preset.forEach(function (tombol) {
    tombol.addEventListener('click', function () {
      terapkan(tombol.dataset.preset)
    })
  })

  terapkan(slider.value || bawaan)

  // Label "layar 390 px" dihitung dari lebar layar yang benar-benar dirender,
  // bukan dari nilai penggeser — supaya kalau bingkai terpotong oleh kolom yang
  // sempit, angka yang tertera tidak berbohong.
  if (typeof window.ResizeObserver !== 'function') return

  var pengamat = new window.ResizeObserver(function (entri) {
    entri.forEach(function (e) {
      var bingkai = e.target
      var layar = bingkai.querySelector('.bingkai-layar')
      if (!layar) return
      var keluaran = bingkai.closest('.keluaran')
      var label = keluaran && keluaran.querySelector('.keluaran-lebar')
      if (label) label.textContent = Math.round(layar.clientWidth) + ' px'
    })
  })

  Array.prototype.forEach.call(document.querySelectorAll('.bingkai'), function (bingkai) {
    pengamat.observe(bingkai)
  })
})()
