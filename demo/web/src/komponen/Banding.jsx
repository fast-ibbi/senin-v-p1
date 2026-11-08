import { useState } from 'react'
import { RenderaNode } from './NodeKonten.jsx'

/**
 * Perbandingan sebelum/sesudah ("cara lama" vs "cara benar").
 *
 * Konvensi konten:
 *   <div class="banding"
 *        data-label-lama="Tanpa component"
 *        data-label-benar="Dengan component"
 *        data-petunjuk="Tekan untuk berpindah.">
 *     <figure class="kode">…</figure>   ← panel cara lama
 *     <figure class="kode">…</figure>   ← panel cara benar
 *   </div>
 *
 * Dua anak pertama menjadi panel kiri (lama) dan kanan (benar). Tiga mode:
 * keduanya berdampingan (bawaan), hanya cara lama, hanya cara benar.
 */
export default function Banding({ node }) {
  const labelLama = node.dataset.labelLama ?? 'Cara lama'
  const labelBenar = node.dataset.labelBenar ?? 'Cara benar'
  const petunjuk = node.dataset.petunjuk ?? ''

  const [mode, setMode] = useState('keduanya')

  const panel = [...node.children]
  const lama = panel[0] ?? null
  const benar = panel[1] ?? null

  return (
    <div className="banding" role="group" aria-label={`Perbandingan: ${labelLama} dan ${labelBenar}`}>
      <div className="banding-kepala">
        <p className="banding-petunjuk">
          {petunjuk || `Perbandingan sebelum/sesudah — ${labelLama} lawan ${labelBenar}.`}
        </p>
        <button
          type="button"
          className="banding-tombol benar"
          aria-pressed={mode === 'benar'}
          onClick={() => setMode('benar')}
        >
          Cara benar
        </button>
        <button
          type="button"
          className="banding-tombol lama"
          aria-pressed={mode === 'lama'}
          onClick={() => setMode('lama')}
        >
          Cara lama
        </button>
        <button
          type="button"
          className="banding-tombol"
          aria-pressed={mode === 'keduanya'}
          onClick={() => setMode('keduanya')}
        >
          Keduanya
        </button>
      </div>
      <div className="banding-isi">
        {mode === 'keduanya' ? (
          <div className="banding-sisi">
            <div>
              <p className="banding-panel-label lama">{labelLama}</p>
              {lama && <RenderaNode node={lama} />}
            </div>
            <div>
              <p className="banding-panel-label benar">{labelBenar}</p>
              {benar && <RenderaNode node={benar} />}
            </div>
          </div>
        ) : mode === 'benar' ? (
          <div>
            <p className="banding-panel-label benar">{labelBenar}</p>
            {benar && <RenderaNode node={benar} />}
          </div>
        ) : (
          <div>
            <p className="banding-panel-label lama">{labelLama}</p>
            {lama && <RenderaNode node={lama} />}
          </div>
        )}
      </div>
    </div>
  )
}
