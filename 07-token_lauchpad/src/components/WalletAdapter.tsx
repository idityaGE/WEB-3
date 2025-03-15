import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui'

const WalletAdapter = () => {

  return (
    <div className="w-full h-26 flex items-center justify-evenly">
      <WalletMultiButton />
      <WalletDisconnectButton />
    </div>
  )
}

export default WalletAdapter
