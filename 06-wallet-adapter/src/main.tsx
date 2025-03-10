import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AnzaWalletAdapterProvider } from './components/anza-wallet-adapter.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AnzaWalletAdapterProvider>
      <App />
    </AnzaWalletAdapterProvider>
  </StrictMode>,
)
