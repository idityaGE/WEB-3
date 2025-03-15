import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui'
import { ModeToggle } from './mode-toggle'

const WalletAdapter = () => {

  return (
    <div className="w-full h-26 flex items-center justify-evenly">
      <WalletMultiButton />
      <WalletDisconnectButton />
      <ModeToggle />
    </div>
  )
}

export default WalletAdapter
