import { test, expect } from "bun:test"
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL, Transaction, TransactionInstruction } from "@solana/web3.js"
import { LiteSVM } from "litesvm"
import path from "path"

const programId = PublicKey.unique()
const recipient = new Keypair()

test("sol transfer cpi with pda signer", async () => {
  const svm = new LiteSVM();
  svm.addProgramFromFile(programId, path.join(__dirname, "pda-cpi.so"));

  const seeds = [Buffer.from("pda"), recipient.publicKey.toBuffer()]
  const [pdaAddress, bump] = PublicKey.findProgramAddressSync(
    seeds,
    programId
  )

  const amount = BigInt(LAMPORTS_PER_SOL);
  svm.airdrop(pdaAddress, amount);
  svm.airdrop(recipient.publicKey, amount);

  const instructionIndex = 0; 
  const transferAmount = amount / BigInt(2);

  const data = Buffer.alloc(9) // 1 byte for instruction enum + 8 bytes for u64
  data.writeUInt8(instructionIndex, 0); // first byte identifies the instruction
  data.writeBigUInt64LE(transferAmount, 1); // remaining bytes are instruction arguments


  const ix = new TransactionInstruction({
    programId,
    keys: [
      {pubkey: pdaAddress, isWritable: true, isSigner: false},
      {pubkey: recipient.publicKey, isWritable: true, isSigner: false},
      {pubkey: SystemProgram.programId, isWritable: false, isSigner: false},
    ],
    data
  })
  const tx = new Transaction().add(ix)
  tx.recentBlockhash = svm.latestBlockhash()
  tx.sign(recipient)

  svm.sendTransaction(tx);
  const recipientBalance = svm.getBalance(recipient.publicKey);
  console.log(recipientBalance?.toString())
  const pdaBalance = svm.getBalance(pdaAddress);

  const transactionFee = BigInt(5000);
  // Recipient starts with 1 SOL, receives 0.5 SOL, pays tx fee
  expect(recipientBalance).toBe(amount + transferAmount - transactionFee);
  // PDA starts with 1 SOL, sends 0.5 SOL
  expect(pdaBalance).toBe(amount - transferAmount);
})
