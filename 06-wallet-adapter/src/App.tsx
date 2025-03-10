import { useEffect, useState } from 'react'
import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'

function App() {
  const { connection } = useConnection()
  const { sendTransaction, publicKey } = useWallet()
  const [balance, setBalance] = useState(0)

  const getBalance = async () => {
    if (!publicKey) throw new WalletNotConnectedError()

    const balance = await connection.getBalance(publicKey)
    setBalance(balance)
  }

  useEffect(() => {
    getBalance()
  }, [publicKey, connection])



  return (
    <>
      <div className='flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white'>
        <h1 className='text-2xl font-bold'>Wallet Adapter</h1>
        <div>
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>
        {balance / 10 ** 9} SOL
      </div>
    </>
  )
}

export default App
