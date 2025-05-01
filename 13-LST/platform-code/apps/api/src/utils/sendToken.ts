import {
  Connection,
  Transaction,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID
} from "@solana/spl-token";

import bs58 from "bs58";

const devnetURL = "https://api.devnet.solana.com";

/**
 * Send tokens to a specified address
 * @param to - Recipient's public key
 * @param amount - Amount of tokens to send
 * @returns Object containing transaction status and optional error/signature
 */
export const sendToken = async (to: PublicKey | string, amount: number): Promise<{
  success: boolean;
  signature?: string;
  error?: string;
}> => {
  try {
    // Validate inputs
    if (!to) {
      throw new Error("Recipient address is required");
    }

    if (!amount || amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    // Convert string to PublicKey if needed
    const recipient = typeof to === 'string' ? new PublicKey(to) : to;

    const connection = new Connection(devnetURL, {
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 60000 // 60 second timeout
    });

    // Validate private key exists
    const PRIVATE_KEY = process.env.USER_PRIVATE_KEY as string;
    if (!PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY Not Found");
    }

    // Create wallet from private key
    let fromWallet: Keypair;
    try {
      fromWallet = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    } catch (error) {
      throw new Error(`Invalid private key format: ${error}`);
    }

    // Validate token address exists
    const MINT_ADDRESS = process.env.MINT_ADDRESS as string;
    if (!MINT_ADDRESS) {
      throw new Error("MINT_ADDRESS not Found");
    }

    // Create mint public key
    let mint: PublicKey;
    try {
      mint = new PublicKey(MINT_ADDRESS);
    } catch (error) {
      throw new Error(`Invalid token address: ${error}`);
    }

    const fromTokenAccount = await getAssociatedTokenAddress(
      mint,
      fromWallet.publicKey
    );

    console.log("Reached Here 1")
    
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      recipient,
      false,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    
    console.log("Reached Here 2")
    
    // Mint tokens to the sender's account
    await mintTo(
      connection,
      fromWallet,
      mint,
      fromTokenAccount,
      fromWallet.publicKey,
      amount,
      [],
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    
    console.log("Reached Here 3")
    
    // Create transfer transaction
    const transaction = new Transaction().add(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount.address,
        fromWallet.publicKey,
        amount
      )
    );
    
    // Set recent blockhash and fee payer
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = fromWallet.publicKey;

    // Send and confirm transaction
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
      error: JSON.stringify(error) || "Unknown error in token transfer"
    };
  }
};
