import { expect, test } from 'bun:test'
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { COUNTER_SIZE, schema } from './types'
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
