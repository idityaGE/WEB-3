import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold">Web3 Wallet</h1>
      <p className="text-xl mt-4">Welcome to Web3 Wallet</p>

      <div className="flex flex-col items-center justify-center"> 
        <h2 className="text-2xl mt-8">Select Wallet</h2>
        <div className="mt-8 flex gap-3 justify-center items-center">
          <Link
            href="/wallet/sol"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Solana
          </Link>
          <Link
            href="/wallet/eth"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Ethereum
          </Link>
        </div>
      </div>
    </div>
  );
}
