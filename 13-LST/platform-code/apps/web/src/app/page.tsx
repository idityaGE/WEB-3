"use client";

import { useQuery } from "@tanstack/react-query";
import { FaGithub, FaExternalLinkAlt, FaCopy, FaCheckCircle, FaRedo } from 'react-icons/fa';
import { useEffect, useState } from 'react';

async function fetchAccountDetails() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_HOST + "/details" as string);
  const data = await res.json();
  return data.data;
}

const Home = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['Account Details'],
    queryFn: fetchAccountDetails,
    refetchInterval: 30 * 1000,
    staleTime: 5000
  });

  const [copied, setCopied] = useState(false);
  const [tokenAddressCopied, setTokenAddressCopied] = useState(false);
  const [walletAddressCopied, setWalletAddressCopied] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("H7HnKPZp1vJS7k8bT16DpCNaaVEdM1zmarp4dfAfvyRy");
  const [walletAddress, setWalletAddress] = useState("77xACsirSsQjUNGtwWqvk3un63sJ8xG3Akc8C24jxbec");

  // Update state when data is loaded
  useEffect(() => {
    if (data) {
      if (data.mintAddress) setTokenAddress(data.mintAddress);
      if (data.publicKey) setWalletAddress(data.publicKey);
    }
  }, [data]);

  const copyToClipboard = (text: string, setCopiedState: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  // Convert lamports to SOL (1 SOL = 10^9 lamports)
  const formatSol = (lamports: number) => {
    if (!lamports && lamports !== 0) return "—";
    return (lamports / 1e9).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
              <span className="font-bold text-sm text-white dark:text-black">lSOL</span>
            </div>
            <h1 className="text-xl font-semibold">Solana LST</h1>
          </div>
          <a
            href="https://github.com/YourUsername/WEB-3/tree/main/13-LST"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaGithub size={18} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Liquid Staking on Solana
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm">
            Stake SOL, get lSOL. Simple liquid staking with instant redemption.
          </p>
        </div>

        {/* Wallet Card - Highlighted */}
        <div className="mb-8 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="bg-black text-white dark:bg-white dark:text-black px-6 py-4 flex justify-between items-center">
            <h3 className="font-medium">Platform Wallet</h3>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1 text-xs bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-black py-1 px-3 rounded transition-colors"
            >
              <FaRedo size={12} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="p-6">

            <div className="mb-6 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 border-2 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Wallet Address (Devnet)</span>
                <button
                  onClick={() => copyToClipboard(walletAddress, setWalletAddressCopied)}
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-xs flex items-center gap-1"
                >
                  {walletAddressCopied ? <FaCheckCircle /> : <FaCopy />}
                  {walletAddressCopied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="font-mono text-sm break-all font-semibold">{walletAddress}</div>
            </div>
            
            <div className="mb-6 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 border-2 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Mint Address (Devnet)</span>
                <button
                  onClick={() => copyToClipboard(tokenAddress, setTokenAddressCopied)}
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-xs flex items-center gap-1"
                >
                  {tokenAddressCopied ? <FaCheckCircle /> : <FaCopy />}
                  {tokenAddressCopied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="font-mono text-sm break-all font-semibold">{tokenAddress}</div>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black dark:border-white"></div>
              </div>
            )}

            {isError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                <p className="text-red-600 dark:text-red-400 text-sm">Error loading platform data.</p>
              </div>
            )}

            {data && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">SOL Balance</p>
                  <p className="text-xl font-semibold">{formatSol(data.solBalance)} SOL</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">lSOL Circulating</p>
                  <p className="text-xl font-semibold">{formatSol(data.tokenBalance)} lSOL</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-8 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-medium">How It Works</h3>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white flex items-center justify-center text-xs font-medium mt-0.5">1</div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Send SOL</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Send SOL to the platform wallet and receive lSOL at a 1:1 ratio.</p>
                </div>
              </div>
              <div className="flex-1 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white flex items-center justify-center text-xs font-medium mt-0.5">2</div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Hold lSOL</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Your lSOL tokens represent your staked SOL in the platform.</p>
                </div>
              </div>
              <div className="flex-1 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white flex items-center justify-center text-xs font-medium mt-0.5">3</div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Redeem Anytime</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Return lSOL to get your original SOL back instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="mb-8 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-medium">Useful Links</h3>
          </div>

          <div className="p-6 flex flex-col sm:flex-row gap-3">
            <a
              href={`https://solscan.io/account/${walletAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black py-3 px-4 rounded-lg transition-colors text-sm"
            >
              <span>View Wallet on Solscan</span>
              <FaExternalLinkAlt size={12} />
            </a>

            <a
              href={`https://solscan.io/token/${tokenAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-black dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white py-3 px-4 rounded-lg transition-colors text-sm border border-gray-200 dark:border-gray-700"
            >
              <span>View lSOL Token</span>
              <FaExternalLinkAlt size={12} />
            </a>
          </div>
        </div>

        {/* Note */}
        <div className="bg-gray-100 dark:bg-gray-900 p-4 mb-8 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <h4 className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-1">Important Note</h4>
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            This is a demo project running on Solana Devnet. Do not send real SOL from Mainnet.
          </p>
        </div>

        {/* Project Info */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium mb-4">About This Project</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-4">
            <p>
              This is a demo project built on Solana's Devnet to showcase a simple Liquid Staking Token (LST) platform.
              The platform allows you to stake your SOL and receive lSOL tokens in return at a 1:1 ratio.
            </p>
            <p>
              Behind the scenes, I'm using Helius webhooks to track transfers, with a
              backend that handles the transfer of SOL and tokens from my wallet.
            </p>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <h4 className="text-amber-700 dark:text-amber-400 font-medium text-sm mb-1">Important Note</h4>
              <p className="text-amber-700 dark:text-amber-400 text-xs">
                This is only a demo project running on Devnet. Do not send real SOL from Mainnet.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-10 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
        © 2025 lSOL Demo • Built for educational purposes on Solana Devnet
      </footer>
    </div>
  );
};

export default Home;
