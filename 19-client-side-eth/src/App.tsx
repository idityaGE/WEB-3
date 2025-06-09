import Profile from '@/components/profile'
import WalletOption from './components/wallet-option'
import { TotalSupply } from './components/read-only-functions'

function App() {

  return (
    <>
      <div className='h-screen flex flex-col justify-center items-center gap-4'>
        <WalletOption />
        <TotalSupply />
        <Profile />
      </div>
    </>
  )
}

export default App
 