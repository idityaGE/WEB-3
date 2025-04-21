import { useConnect, useDisconnect, useAccount } from "wagmi"
import { useState } from "react"

const Connect = () => {
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { isConnected, address } = useAccount()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const truncateAddress = (address: string) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">Wallet Connection</h2>

      {!isConnected ? (
        <div className="grid grid-cols-1 gap-3">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className={`flex items-center justify-center gap-3 font-medium py-3 px-4 rounded-lg transition-colors duration-200
                ${isPending
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              {isPending ? 'Connecting...' : `Connect with ${connector.name}`}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-white">{address && truncateAddress(address)}</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        disconnect();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center text-green-400">
            <p>Wallet successfully connected</p>
            <p className="text-sm text-gray-400 mt-1">You can now send ETH and interact with the blockchain</p>
          </div>
        </div>
      )}
    </div>
  )
}

export { Connect }
