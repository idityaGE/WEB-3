import { http, createConfig, injected } from 'wagmi'
import { holesky } from 'wagmi/chains'
// import { metaMask, walletConnect, } from 'wagmi/connectors'

// const projectId = '<WALLETCONNECT_PROJECT_ID>'

export const config = createConfig({
  chains: [holesky],
  connectors: [
    injected(),
    // walletConnect({ projectId })
  ],
  transports: {
    [holesky.id]: http(),
  },
})
