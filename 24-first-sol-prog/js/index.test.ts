import { expect, test } from 'bun:test'
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js'
import { COUNTER_SIZE, CounterAccount, schema } from './types'
import * as borsh from 'borsh'

const adminAccount = Keypair.generate()
console.log("Admin Account :", adminAccount.publicKey.toString())
const dataAccount = Keypair.generate()
console.log("Data Account :", dataAccount.publicKey.toString())

const programId = new PublicKey("3WeRs98C52ENUpvE9emX2Apk7atNxEYN3BVuu5qGYvmi")

test("Initialization Test", async () => {
  const connection = new Connection("http://127.0.0.1:8899");
  const transaction = await connection.requestAirdrop(adminAccount.publicKey, 10 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(transaction)

  const data = await connection.getAccountInfo(adminAccount.publicKey);
  // console.log(JSON.stringify(data, null, 2));

  const rent = await connection.getMinimumBalanceForRentExemption(COUNTER_SIZE)

  const createCounterDataAcc = SystemProgram.createAccount({
    fromPubkey: adminAccount.publicKey,
    newAccountPubkey: dataAccount.publicKey,
    lamports: rent,
    space: COUNTER_SIZE,
    programId
  })

  const tx = new Transaction().add(createCounterDataAcc);
  const txHash = await connection.sendTransaction(tx, [adminAccount, dataAccount])
  await connection.confirmTransaction(txHash);

  const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
  let dataInBytes: any;
  if (dataAccountInfo) {
    dataInBytes = borsh.deserialize(schema, dataAccountInfo?.data);
  }
  expect(dataInBytes.count).toBe(0);
})

test("Interacting with Counter Program", async () => {
  const connection = new Connection("http://127.0.0.1:8899");

  const txn = new Transaction().add(
    new TransactionInstruction({
      keys: [{
        pubkey: dataAccount.publicKey,
        isSigner: true,
        isWritable: true
      }],
      programId: programId,
      data: Buffer.from(new Uint8Array([0, 1, 0, 0, 0]))
      // borsh.sendTransaction(schema, new CounterAccount({count: 1}));
      /* first bit is either incr or decr and next 4 bytes (u32) is data
      enum IntructionData {
          Increment(u32),
          Decrement(u32),
      }
      */
    })
  )

  const txnHash = await connection.sendTransaction(txn, [adminAccount, dataAccount]);
  await connection.confirmTransaction(txnHash);
  console.log("Txn Hash : ", txnHash);

  const counterAccount = await connection.getAccountInfo(dataAccount.publicKey);
  if (!counterAccount) {
    throw new Error("Counter Account is not Found");
  }
  const counter = borsh.deserialize(schema, counterAccount.data) as CounterAccount;
  console.log("Count : ", counter.count)
  expect(counter.count).toBe(1);
})


