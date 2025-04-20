import { useAccount, useBalance, useEnsAvatar, useEnsName } from 'wagmi'

export function Profile() {
  const { address, isConnected } = useAccount()
  const { data: balance, isLoading: isBalanceLoading } = useBalance({ address })
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  if (!isConnected || !address) {
    return (
      <div className="text-center text-gray-400 py-4">
        Connect your wallet to view account details
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Account Details</h3>

      <div className="space-y-2">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-400">Address</span>
          {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
          <div className="bg-gray-700 rounded-lg p-2 break-all text-sm">
            {ensName ? `${ensName} (${address})` : address}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-400">Balance</span>
          <div className="bg-gray-700 rounded-lg p-2">
            {isBalanceLoading ? (
              <div className="animate-pulse h-6 bg-gray-600 rounded"></div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-medium">{balance?.formatted}</span>
                <span className="text-gray-400 text-sm">{balance?.symbol}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
