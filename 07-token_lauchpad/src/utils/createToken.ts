import { createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Keypair, type PublicKey, SystemProgram, Transaction, type Connection } from "@solana/web3.js"
import { WalletNotConnectedError, type WalletAdapterProps } from "@solana/wallet-adapter-base"
import { type FormSchema } from "@/components/TokenLauchpadForm"
// import { createMint } from "@solana/spl-token"

const createToken = async (connection: Connection, publicKey: PublicKey, values: FormSchema, sendTransaction: WalletAdapterProps['sendTransaction']) => {
  if (!publicKey) return new WalletNotConnectedError()

  const mintAccountKeypair = Keypair.generate()
  const lamports = await getMinimumBalanceForRentExemptMint(connection)

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: publicKey,
      newAccountPubkey: mintAccountKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID
    }),
    createInitializeMint2Instruction(mintAccountKeypair.publicKey, values.Decimal, publicKey, null, TOKEN_PROGRAM_ID)
  )

  transaction.feePayer = publicKey
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
  transaction.partialSign(mintAccountKeypair)

  await sendTransaction(transaction, connection)

}

export default createToken
