import { useSendTransaction, useAccount } from "wagmi"
import { parseEther } from 'viem'
import { useState } from "react"

export const SendEth = () => {
  const [eth, seteth] = useState("")
  const [to, setTo] = useState("")
  const { data, sendTransaction, isError, isPending, isSuccess } = useSendTransaction()
  const { isConnected } = useAccount()

  const handleSend = () => {
    if (!to || !eth) return;

    try {
      sendTransaction({
        to: to as `0x${string}`,
        value: parseEther(eth)
      })
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">Send ETH</h2>

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="recipient" className="text-sm text-gray-400">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
            className="bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-none"
            disabled={isPending}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="amount" className="text-sm text-gray-400">
            Amount (ETH)
          </label>
          <input
            id="amount"
            type="text"
            value={eth}
            onChange={(e) => seteth(e.target.value)}
            placeholder="0.01"
            className="bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-none"
            disabled={isPending}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!isConnected || isPending || !to || !eth}
          className={`flex items-center justify-center gap-3 font-medium py-3 px-4 rounded-lg transition-colors duration-200 w-full
            ${!isConnected || isPending || !to || !eth
              ? 'bg-gray-600 cursor-not-allowed text-gray-400'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          {isPending ? 'Sending...' : 'Send ETH'}
        </button>
      </div>

      {isSuccess && (
        <div className="mt-4 p-3 bg-green-900 text-green-300 rounded-lg">
          <p className="font-medium">Transaction sent successfully!</p>
          <p className="text-sm mt-1 break-all">
            Transaction Hash: {data}
          </p>
        </div>
      )}

      {isError && (
        <div className="mt-4 p-3 bg-red-900 text-red-300 rounded-lg">
          <p>Transaction failed. Please try again.</p>
        </div>
      )}

      {!isConnected && (
        <div className="text-center text-gray-400 py-2 mt-2">
          Connect your wallet to send ETH
        </div>
      )}
    </div>
  )
}
