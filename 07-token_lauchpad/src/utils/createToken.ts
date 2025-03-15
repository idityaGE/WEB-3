import {
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  AuthorityType
} from "@solana/spl-token"
import {
  Keypair,
  type PublicKey,
  SystemProgram,
  Transaction,
  type Connection
} from "@solana/web3.js"
import {
  WalletNotConnectedError,
  type WalletAdapterProps
} from "@solana/wallet-adapter-base"
import { type FormSchema } from "@/components/TokenLauchpadForm"

const createToken = async (
  connection: Connection,
  publicKey: PublicKey,
  values: FormSchema,
  sendTransaction: WalletAdapterProps['sendTransaction']
) => {
  if (!publicKey) throw new WalletNotConnectedError()

  // Generate a new keypair for token mint account
  const mintAccountKeypair = Keypair.generate()
  const lamports = await getMinimumBalanceForRentExemptMint(connection)

  // Get the associated token address for the user wallet
  const associatedTokenAddress = await getAssociatedTokenAddress(
    mintAccountKeypair.publicKey,
    publicKey
  )

  // Create a transaction with multiple instructions
  const transaction = new Transaction()

  // 1. Create mint account
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: publicKey,
      newAccountPubkey: mintAccountKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID
    }),

    // 2. Initialize mint account
    // We always initialize with the user as both mint and freeze authority
    // If requested to revoke these authorities, we'll do it in additional instructions
    createInitializeMint2Instruction(
      mintAccountKeypair.publicKey,
      values.Decimal,
      publicKey,
      publicKey, // Always start with freeze authority set
      TOKEN_PROGRAM_ID
    ),

    // 3. Create associated token account for user wallet
    createAssociatedTokenAccountInstruction(
      publicKey, // payer
      associatedTokenAddress, // associated token account address
      publicKey, // owner
      mintAccountKeypair.publicKey, // mint
      TOKEN_PROGRAM_ID
    ),

    // 4. Mint tokens to user's associated token account
    createMintToInstruction(
      mintAccountKeypair.publicKey, // mint
      associatedTokenAddress, // destination
      publicKey, // authority
      values.InitialSupply * (10 ** values.Decimal), // amount adjusted for decimals
      [],
      TOKEN_PROGRAM_ID
    )
  )

  // 5. If RevokeMint is true, add instruction to revoke mint authority
  if (values.RevokeMint) {
    transaction.add(
      createSetAuthorityInstruction(
        mintAccountKeypair.publicKey, // mint account
        publicKey, // current authority
        AuthorityType.MintTokens, // authority type
        null, // new authority (null means revoking)
        [],
        TOKEN_PROGRAM_ID
      )
    )
  }

  // 6. If RevokeFreeze is true, add instruction to revoke freeze authority
  if (values.RevokeFreeze) {
    transaction.add(
      createSetAuthorityInstruction(
        mintAccountKeypair.publicKey, // mint account
        publicKey, // current authority
        AuthorityType.FreezeAccount, // authority type
        null, // new authority (null means revoking)
        [],
        TOKEN_PROGRAM_ID
      )
    )
  }

  // Set transaction metadata and sign with the mint keypair
  transaction.feePayer = publicKey
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
  transaction.partialSign(mintAccountKeypair)

  // Send transaction to blockchain
  const signature = await sendTransaction(transaction, connection, {
    skipPreflight: false,
    preflightCommitment: 'confirmed'
  })

  // Wait for confirmation
  await connection.confirmTransaction(signature, 'confirmed')

  // Return the mint account address for reference
  return mintAccountKeypair.publicKey.toBase58()
}

export default createToken
