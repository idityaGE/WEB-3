import TokenLauchpadForm from "./components/TokenLauchpadForm"
import WalletAdapter from "./components/WalletAdapter"

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/70">
      <header className="py-6 px-4 border-b border-border shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Solana Token Launchpad
          </h1>
          <WalletAdapter />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <TokenLauchpadForm />
        </div>
      </main>

      <footer className="py-6 border-t border-border text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          Built with ❤️ for Solana • {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}

export default App
