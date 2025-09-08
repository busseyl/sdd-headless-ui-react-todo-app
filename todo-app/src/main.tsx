import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { pwaManager } from './utils/pwa'

// Register service worker for PWA functionality
if (import.meta.env.PROD) {
  pwaManager.register()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
