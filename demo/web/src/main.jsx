import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './tema.css'
import './gaya/halaman.css'
import './gaya/tiruan.css'
import './gaya/bab05-index.css'
import './gaya/bab05-bagian-2.css'
import './gaya/bab05-bagian-4.css'
import './gaya/bab05-bagian-5.css'
import './gaya/bab05-praktikum.css'

createRoot(document.getElementById('akar')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
)
