"use client"

import useWallet from "@/store/useWallet"
import { generateMnemonic, mnemonicToSeedSync } from "bip39"
import Link from "next/link"

const Page = () => {
  const { mnemonic, setMnemonic, seed, setSeed } = useWallet()

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic()
    setMnemonic(newMnemonic)
  }

  const handleGenerateSeed = () => {
    if (!mnemonic) {
      alert("Please generate a mnemonic first")
      return
    }
    setSeed(mnemonicToSeedSync(mnemonic).toString("hex"))
  }

  return (
    <div className="dark min-h-screen bg-black text-gray-200">
      <div className="max-w-2xl mx-auto p-6 pt-12">
        <h1 className="text-2xl font-medium text-center mb-10 text-white">Web3 Wallet</h1>

        {/* Mnemonic Word Blocks */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-400">Mnemonic Phrase:</p>
            <button
              onClick={handleGenerateMnemonic}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Generate New
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {mnemonic
              ? mnemonic.split(" ").map((word, index) => (
                <div key={index} className="p-2 bg-gray-900 border border-gray-800 rounded-md text-center text-sm">
                  <span className="text-xs text-gray-500 mr-1">{index + 1}.</span>
                  {word}
                </div>
              ))
              : Array(12)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="p-2 bg-gray-900 border border-gray-800 rounded-md text-center text-sm text-gray-600"
                  >
                    •••
                  </div>
                ))}
          </div>
        </div>

        {/* Seed Display */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-400">Seed:</p>
            <button
              onClick={handleGenerateSeed}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              disabled={!mnemonic}
            >
              Generate Seed
            </button>
          </div>
          <div className="p-3 bg-gray-900 border border-gray-800 rounded-md">
            <p className="font-mono text-xs text-gray-400 break-all">{seed || "No seed generated yet"}</p>
          </div>
        </div>

        {/* Navigation Options */}
        <div className="mt-10 flex flex-col gap-3">
          <Link
            href="/wallet/sol"
            className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 transition-colors"
          >
            <span className="text-white">Create Solana Wallet</span>
          </Link>
          <Link
            href="/wallet/eth"
            className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 transition-colors"
          >
            <span className="text-white">Create Ethereum Wallet</span>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Page

