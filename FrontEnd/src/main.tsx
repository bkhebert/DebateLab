import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom' // ADD THIS
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter> {/* WRAP APP WITH THIS */}
    <App />
    </BrowserRouter>
  </StrictMode>,
)
