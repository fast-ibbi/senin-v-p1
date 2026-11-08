import { Route, Routes } from 'react-router-dom'
import Muka from './halaman/Muka.jsx'
import HalamanKonten from './halaman/HalamanKonten.jsx'
import Kerangka from './komponen/Kerangka.jsx'

function TidakDitemukan() {
  return (
    <Kerangka>
      <h1>Halaman tidak ditemukan</h1>
      <p className="ringkas">
        Rute yang diminta tidak ada. Kembali ke <a href="#/">daftar bab</a>.
      </p>
    </Kerangka>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Muka />} />
      <Route path="/bab/:slug" element={<HalamanKonten />} />
      <Route path="/bab/:slug/:file" element={<HalamanKonten />} />
      <Route path="*" element={<TidakDitemukan />} />
    </Routes>
  )
}
