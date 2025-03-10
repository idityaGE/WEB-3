import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState } from 'react';

// Import Buffer from buffer package
import { Buffer } from 'buffer';

// Make Buffer available globally for Solana's web3.js library
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

export const SendSOL = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: ''
  });

  const isValidAddress = (address: string): boolean => {
    try {
      if (!address || address.length === 0) return false;
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  };

  const isValidAmount = (value: string): boolean => {
    try {
      if (!value || value.length === 0) return false;
      const numValue = parseFloat(value);
      return !isNaN(numValue) && numValue > 0;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey) {
      setMessage({
        type: 'error',
        text: 'Wallet not connected'
      });
      return new WalletNotConnectedError();
    }

    if (!isValidAddress(recipient)) {
      setMessage({
        type: 'error',
        text: 'Invalid recipient address'
      });
      return;
    }

    if (!isValidAmount(amount)) {
      setMessage({
        type: 'error',
        text: 'Invalid amount'
      });
      return;
    }

    try {
      setIsLoading(true);
      setMessage({ type: null, text: '' });

      const recipientPubKey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      // Create the transaction instruction
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubKey,
        lamports: Math.floor(lamports), // Ensure integer value
      });

      // Create transaction object
      const transaction = new Transaction().add(transferInstruction);

      // Get recent blockhash for transaction
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight }
      } = await connection.getLatestBlockhashAndContext();

      // Set recent blockhash
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send the transaction
      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        minContextSlot
      });

      console.log('Transaction sent with signature:', signature);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature
      });

      if (confirmation.value.err) {
        throw new Error(`Transaction confirmed but failed: ${confirmation.value.err.toString()}`);
      }

      setMessage({
        type: 'success',
        text: `Successfully sent ${amount} SOL to ${recipient.slice(0, 4)}...${recipient.slice(-4)}`
      });

      // Clear input fields
      setAmount('');
      setRecipient('');
    } catch (error: any) {
      console.error('Transaction error:', error);

      setMessage({
        type: 'error',
        text: error?.message || 'Failed to send transaction'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of component remains the same
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-lg font-medium mb-4 text-white">Send SOL</h3>
      <p className="text-gray-400 text-sm mb-4">
        Transfer SOL to another wallet address
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-gray-400 text-sm mb-2">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter wallet address"
            className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
          {recipient && !isValidAddress(recipient) && (
            <p className="mt-1 text-xs text-red-400">Please enter a valid Solana address</p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block text-gray-400 text-sm mb-2">
            Amount (SOL)
          </label>
          <div className="relative">
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.000000001"
              className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-400">SOL</span>
            </div>
          </div>
          {amount && !isValidAmount(amount) && (
            <p className="mt-1 text-xs text-red-400">Please enter a valid amount</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full flex items-center justify-center rounded-lg px-6 py-3 font-medium text-white transition-all ${isLoading
            ? 'bg-indigo-600/50 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-600/20'
            }`}
          disabled={isLoading || !publicKey || !isValidAddress(recipient) || !isValidAmount(amount)}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Transaction...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send SOL
            </>
          )}
        </button>
      </form>

      {message.type && (
        <div className={`mt-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};
