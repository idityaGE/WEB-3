import {
  Connection,
  Transaction,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from "@solana/web3.js";

import bs58 from "bs58";

const devnetURL = "https://api.devnet.solana.com";

export const sendSol = async (to: PublicKey | string, tokenAmount: number): Promise<{
  success: boolean;
  signature?: string;
  error?: string;
}> => {
  try {
    if (!to) throw new Error("Recipient address is required");


    if (!tokenAmount || tokenAmount <= 0) throw new Error("Amount must be greater than 0");

    const solAmount = BigInt(Math.round(tokenAmount * LAMPORTS_PER_SOL));

    const recipient = new PublicKey(to);

    const connection = new Connection(devnetURL, {
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 60000 // 60 second timeout
    });

    const PRIVATE_KEY = process.env.USER_PRIVATE_KEY as string;
    if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY Not Found");


    let fromWallet: Keypair;
    try {
      fromWallet = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    } catch (error) {
      throw new Error(`Invalid private key format: ${error}`);
    }


    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: recipient,
        lamports: solAmount
      })
    );

    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = fromWallet.publicKey;

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [fromWallet],
      { commitment: 'confirmed' }
    );

    return {
      success: true,
      signature
    };
  } catch (error) {
    console.error("Error in sendToken:", error);

    return {
      success: false,
      error: JSON.stringify(error) || "Unknown error in token transfer",
    };
  }
};
