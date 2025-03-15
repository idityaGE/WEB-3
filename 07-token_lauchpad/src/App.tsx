import TokenLauchpadForm from "./components/TokenLauchpadForm"
import WalletAdapter from "./components/WalletAdapter"

const App = () => {

  return (
    <>
      <div className="min-h-screen w-full bg-background">
        <div>
          <WalletAdapter />
        </div>

        <div className="mt-10 flex justify-center items-center">
          <TokenLauchpadForm />
        </div>

      </div>
    </>
  )
}

export default App
