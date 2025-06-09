import Profile from '@/components/profile'
import WalletOption from './components/wallet-option'

function App() {

  return (
    <>
    <div className='h-screen flex flex-col justify-center items-center gap-4'>
      <WalletOption />
      <Profile />
    </div>
    </>
  )
}

export default App
