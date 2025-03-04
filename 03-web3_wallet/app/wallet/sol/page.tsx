'use client'

import { useRouter } from "next/navigation"
import { createNewSolKeypair } from "@/utils/solana"
import useWallet from "@/store/useWallet"

const page = () => {
  const router = useRouter()
  const { addSolKeypair, removeSolKeypair, solKeypairs, seed } = useWallet()

  const generateNewSolKeypair = () => {
    if (!seed) {
      alert("Please generate a seed first")
      return
    }

    const index = solKeypairs.length
    const keypair = createNewSolKeypair(seed, index)
    addSolKeypair(keypair)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-medium mb-6">Solana Accounts</h1>

      <div className="mb-4">
        <button
          onClick={generateNewSolKeypair}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          disabled={!seed}
        >
          Generate New Keypair
        </button>
        <button
          onClick={() => router.push('/wallet')}
          className="px-4 py-2 ml-2 bg-gray-600 text-white rounded"
        >
          Back to Wallet
        </button>
      </div>

      <div className="space-y-3">
        {solKeypairs.map((keypair, i) => (
          <div key={i} className="p-3 bg-gray-100 rounded shadow">
            <div className="flex justify-between items-center">
              <span className="font-medium">Account #{i + 1}</span>
              <button
                onClick={() => removeSolKeypair(keypair.publicKey)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
            <p className="text-sm mb-1"><span className="font-medium">Public Key:</span></p>
            <p className="font-mono text-xs break-all bg-white p-2 rounded mb-2">{keypair.publicKey}</p>
            <p className="text-sm mb-1"><span className="font-medium">Private Key:</span></p>
            <p className="font-mono text-xs break-all bg-white p-2 rounded">{keypair.secretKey}</p>
          </div>
        ))}

        {solKeypairs.length === 0 && (
          <p className="text-gray-500 text-center p-4">No keypairs generated yet</p>
        )}
      </div>
    </div>
  )
}

export default page