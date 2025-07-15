import { test, expect } from "bun:test"
import { LiteSVM } from "litesvm";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from "@solana/web3.js";
import path from "path";

const cpiProgramId = PublicKey.unique();
const doubleProgramId = new PublicKey("DGGsE2UUwJuPVTQsrDoA1Swbp2Gej65cE22kk1zYACnn");
const dataAccount = new Keypair();
const payer = new Keypair();


test("Testing CPI", () => {
  const svm = new LiteSVM();
  svm.addProgramFromFile(cpiProgramId, path.join(__dirname, "cpi.so"));
  svm.addProgramFromFile(doubleProgramId, path.join(__dirname, "double.so"));

  svm.airdrop(payer.publicKey, BigInt(LAMPORTS_PER_SOL * 2));

  const space = 4;
  const lamports = svm.minimumBalanceForRentExemption(BigInt(space));

  const ixs = [
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: dataAccount.publicKey,
      lamports: Number(lamports),
      space,
      programId: doubleProgramId
    })
  ];

  const tx = new Transaction();
  let blockhash = svm.latestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.add(...ixs);
  tx.sign(payer, dataAccount);
  svm.sendTransaction(tx);

  const balanceAfter = svm.getBalance(dataAccount.publicKey);
  expect(balanceAfter).toBe(svm.minimumBalanceForRentExemption(BigInt(4)));

  const data = Buffer.from([0, 0, 0, 0]);
  const txn = new TransactionInstruction({
    keys: [
      { pubkey: dataAccount.publicKey, isSigner: true, isWritable: true },
      { pubkey: doubleProgramId, isSigner: false, isWritable: false },
    ],
    programId: cpiProgramId,
    data
  })

  const tx2 = new Transaction();
  blockhash = svm.latestBlockhash();
  tx2.recentBlockhash = blockhash;
  tx2.add(txn);
  tx2.sign(payer, dataAccount);
  svm.sendTransaction(tx2);

  const dataAccountInfo = svm.getAccount(dataAccount.publicKey);
  console.log(dataAccountInfo?.data);
  expect(dataAccountInfo?.data).toEqual(new Uint8Array([1, 0, 0, 0]));
})
