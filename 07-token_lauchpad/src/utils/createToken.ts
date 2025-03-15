import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  AuthorityType,
  createSetAuthorityInstruction
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";
import {
  Keypair,
  SystemProgram,
  Transaction,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import { WalletNotConnectedError, type WalletAdapterProps, } from "@solana/wallet-adapter-base";
import { type FormSchema } from "@/components/TokenLauchpadForm";

/**
 * Creates a new token on the Solana blockchain
 * 
 * @param connection - The Solana connection object
 * @param publicKey - The public key of the wallet creating the token
 * @param values - The form values for creating the token
 * @param sendTransaction - The function to send the transaction
 * @returns The base58 encoded public key of the created mint account
 */
const createToken = async (
  connection: Connection,
  publicKey: PublicKey,
  values: FormSchema,
  sendTransaction: WalletAdapterProps['sendTransaction']
): Promise<string> => {
  if (!publicKey) throw new WalletNotConnectedError();

  // Generate a new keypair for token mint account
  const mintAccountKeypair = Keypair.generate();
  const mint = mintAccountKeypair.publicKey;

  // Metadata to store in Mint Account
  const metaData: TokenMetadata = {
    updateAuthority: publicKey, // Authority that can update the metadata pointer and token metadata
    mint: mint,
    name: values.TokenName,
    symbol: values.Symbol,
    uri: values.ImageUrl,
    additionalMetadata: [["description", values.Description]]
  };

  // Size of MetadataExtension 2 bytes for type, 2 bytes for length
  const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
  // Size of metadata
  const metadataLen = pack(metaData).length;

  // Size of Mint Account with extension
  const mintLen = getMintLen([ExtensionType.MetadataPointer]);

  // Minimum lamports required for Mint Account
  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintLen + metadataExtension + metadataLen,
  );

  // Get the associated token address for the user wallet
  const associatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  // Create a transaction with multiple instructions
  const transaction = new Transaction();

  // 1. Create mint account
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: publicKey, // Account that will transfer lamports to created account
      newAccountPubkey: mint, // Address of the account to create
      space: mintLen, // Amount of bytes to allocate to the created account
      lamports, // Amount of lamports transferred to created account
      programId: TOKEN_2022_PROGRAM_ID // Program assigned as owner of created account
    }),

    // Instruction to initialize the Mint
    createInitializeMintInstruction(
      mint, // Mint Account address
      values.Decimal, // Decimals
      publicKey, // Mint authority
      publicKey, // Freeze authority (if null, then freeze authority is not set)
      TOKEN_2022_PROGRAM_ID // Program ID
    ),

    // Instruction to initialize the MetadataPointer Extension
    createInitializeMetadataPointerInstruction(
      mint, // Mint Account address
      publicKey, // Authority that can set the metadata address
      mint, // Account address that holds the metadata
      TOKEN_2022_PROGRAM_ID,
    ),

    // Instruction to initialize Metadata Account data
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mint, // Account address that holds the metadata
      updateAuthority: publicKey, // Authority that can update the metadata
      mint: mint, // Mint Account address
      mintAuthority: publicKey, // Designated Mint Authority
      name: metaData.name,
      symbol: metaData.symbol,
      uri: metaData.uri,
    })
  );

  // Add description if provided
  if (values.Description) {
    transaction.add(
      // Instruction to update metadata, adding custom field
      createUpdateFieldInstruction({
        programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
        metadata: mint, // Account address that holds the metadata
        updateAuthority: publicKey, // Authority that can update the metadata
        field: "description", // key
        value: values.Description, // value
      })
    );
  }

  // 3. Create associated token account for user wallet
  transaction.add(
    createAssociatedTokenAccountInstruction(
      publicKey, // payer
      associatedTokenAddress, // associated token account address
      publicKey, // owner
      mint, // mint
      TOKEN_2022_PROGRAM_ID
    ),

    // 4. Mint tokens to user's associated token account
    createMintToInstruction(
      mint, // mint
      associatedTokenAddress, // destination
      publicKey, // authority
      BigInt(values.InitialSupply) * BigInt(10 ** values.Decimal), // amount adjusted for decimals
      [],
      TOKEN_2022_PROGRAM_ID
    )
  );

  // 5. If RevokeMint is true, add instruction to revoke mint authority
  if (values.RevokeMint) {
    transaction.add(
      createSetAuthorityInstruction(
        mint, // mint account
        publicKey, // current authority
        AuthorityType.MintTokens, // authority type
        null, // new authority (null means revoking)
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );
  }

  // 6. If RevokeFreeze is true, add instruction to revoke freeze authority
  if (values.RevokeFreeze) {
    transaction.add(
      createSetAuthorityInstruction(
        mint, // mint account
        publicKey, // current authority
        AuthorityType.FreezeAccount, // authority type
        null, // new authority (null means revoking)
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );
  }

  // Set transaction metadata and sign with the mint keypair
  transaction.feePayer = publicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  transaction.partialSign(mintAccountKeypair);

  // Send transaction to blockchain
  const signature = await sendTransaction(transaction, connection, {
    skipPreflight: false,
    preflightCommitment: 'confirmed'
  });

  // Wait for confirmation
  await connection.confirmTransaction(signature, 'confirmed');

  // Return the mint account address for reference
  return mintAccountKeypair.publicKey.toBase58();
};

export default createToken;
