import {
  Connection,
  Transaction,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  // LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

import bs58 from "bs58";

const devnetURL = "https://api.devnet.solana.com";

export const sendToken = async (to: PublicKey | string, amountInLamports: number): Promise<{
  success: boolean;
  signature?: string;
  error?: string;
}> => {
  try {
    if (!to) throw new Error("Recipient address is required");


    if (!amountInLamports || amountInLamports <= 0) throw new Error("Amount must be greater than 0");

    const tokenAmount = BigInt(amountInLamports);

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

    const MINT_ADDRESS = process.env.MINT_ADDRESS as string;
    if (!MINT_ADDRESS) throw new Error("MINT_ADDRESS not Found");

    let mint: PublicKey;
    try {
      mint = new PublicKey(MINT_ADDRESS);
    } catch (error) {
      throw new Error(`Invalid token address: ${error}`);
    }

    const programId = TOKEN_2022_PROGRAM_ID

    const fromTokenAccount = await getAssociatedTokenAddress(
      mint,
      fromWallet.publicKey,
      false,
      programId
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      recipient,
      false,
      undefined,
      undefined,
      programId
    );

    try {
      if (!process.env.IS_MINT_AUTHORITY || process.env.IS_MINT_AUTHORITY.toLowerCase() !== 'true') {
        console.log("Skipping mint operation, performing transfer only");
      } else {
        await mintTo(
          connection,
          fromWallet,
          mint,
          fromTokenAccount,
          fromWallet.publicKey,
          tokenAmount,
          [],
          undefined,
          programId
        );
      }
    } catch (mintError) {
      console.error("Error during mint operation:", mintError);
      console.log("Continuing with transfer using existing balance...");
    }

    const transaction = new Transaction().add(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount.address,
        fromWallet.publicKey,
        tokenAmount,
        [],
        programId
      )
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
