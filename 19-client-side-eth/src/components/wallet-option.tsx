import { useAccount, useConnect, useDisconnect } from "wagmi"

const WalletOption = () => {
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { isConnected, address } = useAccount()

  if (isConnected) {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-amber-200 p-3 gap-3">
        <p>Connected : {address}</p>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1.5 bg-amber-700 rounded-xl"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col max-w-32 gap-3 justify-center bg-amber-200 p-3 rounded-2xl">
      {connectors.map((connector) => (
        <button
          className="px-3 py-1.5 bg-green-200 rounded-xl"
          key={connector.uid}
          onClick={() => connect({ connector })}
        >
          {connector.name}
        </button>
      ))}
    </div>
  )
}

export default WalletOption
