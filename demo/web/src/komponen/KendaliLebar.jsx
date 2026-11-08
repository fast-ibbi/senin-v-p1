import { useState } from 'react'

const PRESET = [
  { lebar: 390, nama: 'Ponsel 390' },
  { lebar: 844, nama: 'Lanskap 844' },
  { lebar: 834, nama: 'Tablet 834' },
]

/**
 * Penggeser lebar bingkai ponsel. Nilainya ditulis sebagai variabel CSS
 * `--lebar-bingkai` pada elemen induk, sehingga semua bingkai di halaman
 * ikut berubah — meniru penggeser di demo web bab-05 yang lama.
 */
export default function KendaliLebar({ nilai, onUbah }) {
  return (
    <div className="kendali" role="group" aria-label="Kendali lebar bingkai contoh">
      <div className="kendali-isi">
        <div className="kendali-slider">
          <label htmlFor="lebar" className="kendali-judul">
            Lebar layar contoh
          </label>
          <input
            id="lebar"
            type="range"
            min="320"
            max="1024"
            step="1"
            value={nilai}
            onChange={(e) => onUbah(Number(e.target.value))}
          />
          <span className="kendali-rentang">320–1024 px</span>
          <output className="kendali-nilai" htmlFor="lebar">
            {nilai} px
          </output>
        </div>
        {PRESET.map((p) => (
          <button
            key={p.lebar}
            type="button"
            className="tombol-preset"
            data-preset={p.lebar}
            aria-pressed={nilai === p.lebar}
            onClick={() => onUbah(p.lebar)}
          >
            {p.nama}
          </button>
        ))}
        <p className="kendali-catatan">
          Penggeser ini mengubah lebar semua bingkai di halaman, kecuali bingkai yang sengaja
          dipatok untuk perbandingan. Contoh di dalam bingkai sengaja statis: tidak ada tombol,
          tab, atau isian yang bisa ditekan.
        </p>
      </div>
    </div>
  )
}
