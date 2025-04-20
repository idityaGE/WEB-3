import { useConnect, useDisconnect } from "wagmi"

const Connect = () => {
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className="flex flex-col gap-3 w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">Connect Wallet</h2>
      <div className="grid grid-cols-1 gap-3">
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            <span>{connector.name}</span>
          </button>
        ))}
      </div>
      <div>
        <button
          className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    </div>
  )
}

export default Connect
