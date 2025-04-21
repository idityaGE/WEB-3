import { http, createConfig, injected } from 'wagmi'
import { sepolia } from 'wagmi/chains'
// import { metaMask, walletConnect, } from 'wagmi/connectors'

// const projectId = '<WALLETCONNECT_PROJECT_ID>'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    // walletConnect({ projectId })
  ],
  transports: {
    // [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
