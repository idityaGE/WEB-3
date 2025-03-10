import { useEffect, useState, useCallback } from 'react'
import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import AirdropSol from './components/airdrop-sol'

function App() {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const getBalance = useCallback(async () => {
    if (!publicKey) return

    try {
      setIsLoading(true)
      const balance = await connection.getBalance(publicKey)
      setBalance(balance)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch balance:', error)
    } finally {
      setIsLoading(false)
    }
  }, [publicKey, connection])

  const formattedAddress = publicKey ?
    `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` :
    ''

  const formattedBalance = (balance / LAMPORTS_PER_SOL).toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 9
  })

  const refreshBalance = () => {
    getBalance()
  }

  useEffect(() => {
    if (connected) {
      getBalance()
      const intervalId = setInterval(getBalance, 60000)
      return () => clearInterval(intervalId)
    }
  }, [publicKey, connection, connected, getBalance])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300">
              Solana Wallet
            </h1>
            <p className="text-gray-400 text-sm mt-1">Connect and manage your Solana assets</p>
          </div>
          <div className="flex gap-2">
            <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 !transition-all" />
            {connected && (
              <WalletDisconnectButton className="!bg-red-600 hover:!bg-red-700 !transition-all" />
            )}
          </div>
        </header>

        {/* Main content */}
        <main>
          {!connected ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">Wallet Not Connected</h2>
              <p className="text-gray-400 mb-6 max-w-md">
                Connect your Solana wallet to view your balance and manage your account.
              </p>
              <WalletMultiButton className="!bg-gradient-to-r from-indigo-600 to-purple-600 hover:!from-indigo-700 hover:!to-purple-700 !transition-all !py-3 !px-8" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Wallet Info Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-sm font-medium text-gray-400">Wallet Address</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-white">{formattedAddress}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(publicKey?.toString() || "")
                        }}
                        className="text-indigo-400 hover:text-indigo-300 p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={refreshBalance}
                    className="text-indigo-400 hover:text-indigo-300 p-2 rounded-full hover:bg-indigo-500/10 transition-all"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>

                {/* Balance Display */}
                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-lg p-6 mb-4">
                  <h3 className="text-sm font-medium text-indigo-300 mb-2">Available Balance</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold mr-2">{formattedBalance}</span>
                    <span className="text-indigo-300">SOL</span>
                  </div>
                  {lastUpdated && (
                    <p className="text-xs text-gray-400 mt-2">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>

        <div className='pt-3'>
          <AirdropSol />
        </div>

      </div>
    </div>
  )
}

export default App
