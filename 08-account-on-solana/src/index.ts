import { Keypair, Connection, SystemProgram, Transaction, PublicKey } from "@solana/web3.js";

// Payer account loaded from a private key
// In production, use more secure methods like environment variables
const payer = Keypair.fromSecretKey(Uint8Array.from([63, 201, 192, 248, 41, 146, 106, 67, 32, 168, 217, 215, 181, 136, 87, 154, 57, 128, 148, 221, 76, 49, 102, 45, 102, 16, 241, 85, 82, 152, 138, 246, 90, 237, 249, 124, 129, 215, 55, 193, 199, 27, 166, 82, 94, 45, 116, 239, 154, 185, 22, 235, 145, 2, 235, 214, 237, 157, 194, 36, 59, 89, 206, 37]))

// Connect to Solana devnet for testing
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

/**
 * Creates a new account on Solana
 * @returns The newly created account's public key
 */
const createAccount = async (): Promise<PublicKey> => {
  // Generate a new keypair for the account
  const newAccount = Keypair.generate();

  // Define how much space the account needs
  const space = 165; // bytes

  // Calculate minimum lamports needed for rent exemption
  // This ensures the account is not charged rent fees
  const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(space);

  // Create a new transaction
  const transaction = new Transaction();

  // Add instruction to create a new account
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,      // Account funding the creation
      newAccountPubkey: newAccount.publicKey, // Address of the new account
      lamports: rentExemptionAmount,    // Lamports to fund the account
      space: space,                     // Bytes of space to allocate
      programId: SystemProgram.programId // Owner program of the account 
      // you can put you public key that will make you the owner of the new account
    })
  );

  try {
    // Send and confirm the transaction
    // Both payer and new account need to sign
    const signature = await connection.sendTransaction(
      transaction,
      [payer, newAccount],
    );

    await connection.confirmTransaction(signature, 'confirmed')

    console.log(`New account created at: ${newAccount.publicKey.toString()}`);
    console.log(`Transaction signature: ${signature}`);

    return newAccount.publicKey;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

/**
 * Transfers SOL from payer to specified address
 * @param toAddress - Destination public key
 * @param lamports - Amount to transfer in lamports (1 SOL = 1,000,000,000 lamports)
 * @returns Transaction signature
 */
const transferSol = async (toAddress: PublicKey, lamports: number): Promise<string> => {
  // Create a new transaction
  const transaction = new Transaction();

  // Add transfer instruction
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey, // Source account
      toPubkey: toAddress,         // Destination account
      lamports: lamports           // Amount to transfer
    })
  );

  try {
    // Send and confirm the transaction
    // Only payer needs to sign for transfers
    const signature = await connection.sendTransaction(
      transaction,
      [payer],
    );

    await connection.confirmTransaction(signature, 'confirmed')

    console.log(`Transferred ${lamports} lamports to ${toAddress.toString()}`);
    console.log(`Transaction signature: ${signature}`);

    return signature;
  } catch (error) {
    console.error('Error transferring SOL:', error);
    throw error;
  }
};

/**
 * Main function to demonstrate account creation and SOL transfer
 */
const main = async () => {
  try {
    // First create an account
    const newAccountAddress = await createAccount();

    // Then transfer some additional SOL to it (0.01 SOL)
    const transferAmount = 10_000_000; // 0.01 SOL in lamports
    await transferSol(newAccountAddress, transferAmount);

    // Get and display account info
    const accountInfo = await connection.getAccountInfo(newAccountAddress);
    console.log(`Account balance: ${accountInfo?.lamports} lamports`);
    console.log(`Account owner: ${accountInfo?.owner.toString()}`);
  } catch (error) {
    console.error('Error in main execution:', error);
  }
};

// Uncomment to run the demonstration
main();

// Export functions for use in other modules
export { createAccount, transferSol };
