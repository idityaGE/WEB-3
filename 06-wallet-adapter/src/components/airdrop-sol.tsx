import { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

const AirdropSol = () => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [amount, setAmount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: ''
  })

  const airdropSol = async () => {
    if (!publicKey) return

    try {
      setIsLoading(true)
      setMessage({ type: null, text: '' })

      // Request airdrop of selected amount in SOL
      const lamports = amount * LAMPORTS_PER_SOL
      const signature = await connection.requestAirdrop(publicKey, lamports)

      // Wait for confirmation
      await connection.confirmTransaction(signature)

      // Show success message
      setMessage({
        type: 'success',
        text: `Successfully airdropped ${amount} SOL to your wallet!`
      })
    } catch (error: any) {
      console.error('Failed to airdrop SOL:', error)

      // Extract the meaningful part of the error message
      let errorMessage = 'Failed to airdrop SOL'

      // Handle the specific error format from Solana API
      if (error?.message) {
        try {
          // Check if this is a JSON RPC error
          if (error.message.includes('429')) {
            errorMessage = 'Airdrop limit reached or faucet has run dry. Try again later or visit faucet.solana.com'
          } else if (error.message.includes('JSON')) {
            // Try to parse the JSON part of the error
            const match = error.message.match(/{.*}/s)
            if (match) {
              const jsonData = JSON.parse(match[0])
              if (jsonData.error && jsonData.error.message) {
                errorMessage = jsonData.error.message
              }
            }
          } else {
            // Just use the error message directly
            errorMessage = error.message
          }
        } catch (parseError) {
          // If parsing fails, use the original message
          errorMessage = `${errorMessage}: ${error.message}`
        }
      }

      setMessage({
        type: 'error',
        text: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium mb-4 text-white">Airdrop SOL</h3>
        <p className="text-gray-400 text-sm mb-4">
          Request an airdrop of SOL to your wallet (works only on devnet and testnet).
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div className="w-full sm:w-auto">
            <label className="block text-gray-400 text-sm mb-2" htmlFor="amount-select">
              Amount to Airdrop
            </label>
            <div className="relative">
              <select
                id="amount-select"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="appearance-none bg-gray-700/50 border border-gray-600 text-white rounded-lg py-2 pl-4 pr-10 w-full sm:w-36 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isLoading}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} SOL
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <button
            className={`flex items-center justify-center rounded-lg px-6 py-2.5 font-medium text-white transition-all ${isLoading
              ? 'bg-indigo-600/50 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-600/20'
              } w-full sm:w-auto mt-4 sm:mt-8`}
            onClick={airdropSol}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Airdrop {amount} SOL
              </>
            )}
          </button>
        </div>

        {message.type && (
          <div className={`mt-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          </div>
        )}

        <p className="mt-4 text-xs text-gray-500">
          Note: Airdrops are limited by network policies and only work on development networks.
        </p>
      </div>
    </div>
  )
}

export default AirdropSol
