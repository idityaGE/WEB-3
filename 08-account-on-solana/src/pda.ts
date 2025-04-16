import { Keypair, PublicKey } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'

// Generate a random keypair to represent a wallet owner
const owner = Keypair.generate()
// Generate a random keypair to represent a token mint (token type)
const mintAddress = Keypair.generate()

console.log("Owner Public Key:", owner.publicKey.toBase58())
console.log("Mint Address:", mintAddress.publicKey.toBase58())
console.log("TOKEN_2022_PROGRAM_ID:", TOKEN_2022_PROGRAM_ID.toBase58())
console.log("ASSOCIATED_TOKEN_PROGRAM_ID:", ASSOCIATED_TOKEN_PROGRAM_ID.toBase58())

/**
 * This function demonstrates how to derive a PDA for an Associated Token Account
 * 
 * PDAs (Program Derived Addresses) are special addresses that:
 * 1. Are deterministically derived from seeds and a program ID
 * 2. Don't have private keys (they're "off the Ed25519 curve")
 * 3. Can only be signed by their owning program
 */
const createATA = async () => {
  console.log("\nDeriving PDA for Associated Token Account...");
  console.log("Seeds used:");
  console.log(" - Owner public key")
  console.log(" - TOKEN_2022_PROGRAM_ID") 
  console.log(" - Mint address")

  // findProgramAddressSync derives a PDA from seeds and a program ID
  // It returns both the PDA and the "bump" seed used to find it
  const [ata, bump] = PublicKey.findProgramAddressSync(
    [
      owner.publicKey.toBuffer(),
      TOKEN_2022_PROGRAM_ID.toBuffer(),
      mintAddress.publicKey.toBuffer()
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  )

  console.log("\nATA (Associated Token Account PDA):", ata.toBase58())
  console.log("Bump:", bump)
  console.log("\nExplanation:")
  console.log("- The ATA is a PDA that represents a token account owned by the wallet owner")
  console.log("- It's deterministically derived, so anyone can find it using the same seeds")
  console.log("- The bump ensures the address falls off the Ed25519 curve (making it a valid PDA)")
  console.log("- Only the Associated Token Program can sign for this PDA")

  return [ata, bump]
}

createATA()

/**
 * PDA EXPLANATION:
 * 
 * 1. What is a PDA?
 *    - A Program Derived Address is an account address that's derived from a program ID and seeds
 *    - PDAs don't have private keys and can only be controlled by their program
 * 
 * 2. What is a bump?
 *    - The "bump" is a number (0-255) that's added to the seeds to ensure the derived address
 *      is not on the Ed25519 curve (meaning it can't have a valid private key)
 *    - findProgramAddressSync() tries different bump values until it finds one that works
 *    - The bump is important to store or remember to consistently derive the same PDA
 * 
 * 3. findProgramAddressSync() vs createProgramAddressSync():
 *    - findProgramAddressSync(): Automatically finds a valid bump seed and returns both the PDA and bump
 *      This is safer and what you should typically use
 * 
 *    - createProgramAddressSync(): Requires you to provide the bump seed yourself and only returns the PDA
 *      This can generate invalid addresses if not used carefully (might generate addresses on the curve)
 *      It's lower-level and should only be used when you already know the correct bump
 * 
 * 4. In this example:
 *    - We're deriving the PDA for an Associated Token Account (ATA)
 *    - The ATA will hold tokens of type "mintAddress" for the "owner"
 *    - The PDA is controlled by the Associated Token Program
 *    - Anyone can derive this address, but only the program can modify it
 */
