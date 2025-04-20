import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './configs/wagmi.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config} >
      <QueryClientProvider client={new QueryClient()}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
