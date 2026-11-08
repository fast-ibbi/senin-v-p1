/**
 * Penyorot sintaks: inti highlight.js + tata bahasa yang dipakai konten.
 * Blok kode di berkas konten memakai kelas Prism-style `language-jsx` dsb.;
 * highlight.js memahami alias yang sama untuk tata bahasa yang terdaftar.
 */
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('jsx', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('css', css)

export function ambilBahasa(className) {
  const cocok = /language-([\w-]+)/.exec(className || '')
  return cocok ? cocok[1] : 'javascript'
}

export function sorot(kode, bahasa) {
  if (!hljs.getLanguage(bahasa)) {
    // Bahasa tidak dikenal (mis. language-text): biarkan teks tanpa pewarnaan.
    return null
  }
  try {
    return hljs.highlight(kode, { language: bahasa, ignoreIllegals: true }).value
  } catch {
    return null
  }
}

export default hljs
