import { Request, Response } from "express"
import { Keypair, PublicKey } from "@solana/web3.js"
import bs58 from 'bs58'
import { getAccountDetails } from "../utils/getAccountDetails"

const detailsHandler = async (req: Request, res: Response) => {
  try {
    const PRIVATE_KEY = process.env.USER_PRIVATE_KEY
    const MINT_ADDRESS = process.env.MINT_ADDRESS

    if (!PRIVATE_KEY || !MINT_ADDRESS) {
      return res.status(500).json({
        status: false,
        message: "Missing environment variables: USER_PRIVATE_KEY or MINT_ADDRESS not found"
      });
    }

    try {
      const wallet = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
      const mint = new PublicKey(MINT_ADDRESS);

      const accountDetails = await getAccountDetails(wallet, mint);

      return res.status(200).json({
        status: true,
        data: accountDetails
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: `Failed to process Solana account details: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  } catch (error) {
    console.error("Error in details handler:", error);
    return res.status(500).json({
      status: false,
      message: `Internal server error: ${error instanceof Error ? error.message : "Unknown error occurred"}`
    });
  }
}

export { detailsHandler };
