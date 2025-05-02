import { Connection, Keypair, PublicKey, } from "@solana/web3.js";
import { devnetURL } from "./sendSol";
import { getAssociatedTokenAddress, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

type AccountDetails = {
  publicKey: string,
  solBalance: number,
  tokenBalance: number,
  mintAddress: string,
}

export const getAccountDetails = async (wallet: Keypair, mint: PublicKey) => {
  try {
    if (!wallet || !mint) {
      throw new Error("Invalid parameters: wallet and mint address are required");
    }

    const accDetails: AccountDetails = {
      publicKey: wallet.publicKey.toBase58(),
      solBalance: 0,
      tokenBalance: 0,
      mintAddress: mint.toString(),
    }

    const connection = new Connection(devnetURL, "confirmed");

    try {
      const sol_bal = await connection.getBalance(wallet.publicKey);
      accDetails.solBalance = sol_bal;
    } catch (error) {
      throw new Error(`Failed to fetch SOL balance: ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mint,
        wallet.publicKey,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
      const token_bal = await connection.getTokenAccountBalance(associatedTokenAddress, "confirmed");
      console.log(token_bal)
      accDetails.tokenBalance = parseFloat(token_bal.value.amount);
    } catch (error) {
      console.warn(`Warning: Could not fetch token balance: ${error instanceof Error ? error.message : String(error)}`);
    }

    return accDetails;
  } catch (error) {
    throw new Error(`Error getting account details: ${error instanceof Error ? error.message : String(error)}`);
  }
}
