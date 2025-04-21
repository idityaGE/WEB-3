import { Connect } from "./components/Connect"
import { Profile } from "./components/Profile"
import ReadContract from "./components/ReadContract"
import { SendEth } from "./components/SendEth"

function App() {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-b from-gray-800 to-gray-900 text-white min-h-screen p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-400">Web3 Wallet for Ethereum</h1>

        <div className="space-y-6">
          <Connect />

          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <Profile />
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <SendEth />
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <ReadContract />
          </div>

        </div>

        <footer className="mt-12 text-center text-sm text-gray-400">
          <p>Powered by Wagmi and Web3</p>
        </footer>
      </div>
    </div>
  )
}

export default App
