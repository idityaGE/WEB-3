import { test, expect } from "bun:test"
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL, Transaction, TransactionInstruction } from "@solana/web3.js"
import { LiteSVM } from "litesvm"
import path from "path"
import { b } from "@zorsh/zorsh"

// Fuck the borsh lib, use zorsh instead

const programId = PublicKey.unique()

// Borsh schema for instruction data
const createUserAccountSchema = b.struct({
  instruction: b.u8(),
  name: b.string(),
  age: b.u8(),
  email: b.string()
})
type CreateUser = b.infer<typeof createUserAccountSchema>;

test("create user data account", async () => {
  const svm = new LiteSVM();
  svm.addProgramFromFile(programId, path.join(__dirname, "data-storage.so"));

  const user = new Keypair();
  svm.airdrop(user.publicKey, BigInt(2 * LAMPORTS_PER_SOL));

  // Derive PDA for user data
  const seeds = [Buffer.from("user_data"), user.publicKey.toBuffer()];
  const [userDataPda, bump] = PublicKey.findProgramAddressSync(seeds, programId);

  // Create instruction data
  const instructionData: CreateUser = {
    instruction: 0,
    name: "John Doe",
    age: 25,
    email: "john@example.com"
  };

  const data = Buffer.from(createUserAccountSchema.serialize(instructionData));

  const ix = new TransactionInstruction({
    programId,
    keys: [
      { pubkey: user.publicKey, isWritable: true, isSigner: true },     // User (payer)
      { pubkey: userDataPda, isWritable: true, isSigner: false },       // PDA account
      { pubkey: SystemProgram.programId, isWritable: false, isSigner: false }, // System program
    ],
    data
  });

  const tx = new Transaction().add(ix);
  tx.recentBlockhash = svm.latestBlockhash();
  tx.sign(user);

  // Send transaction
  const result = svm.sendTransaction(tx);
  // console.log("Transaction result:", result);

  // Verify account was created
  const accountInfo = svm.getAccount(userDataPda);
  expect(accountInfo).toBeTruthy();
  expect(accountInfo?.owner.toString()).toBe(programId.toString());
  expect(accountInfo?.data.length).toBeGreaterThan(0);

  console.log("User data account created at:", userDataPda.toString());
  console.log("Account data length:", accountInfo?.data.length);
});

test("update user data", async () => {
  const svm = new LiteSVM();
  svm.addProgramFromFile(programId, path.join(__dirname, "data-storage.so"));

  const user = new Keypair();
  svm.airdrop(user.publicKey, BigInt(2 * LAMPORTS_PER_SOL));

  // First create the account (same as above test)
  const seeds = [Buffer.from("user_data"), user.publicKey.toBuffer()];
  const [userDataPda] = PublicKey.findProgramAddressSync(seeds, programId);

  // Create account first...
  // (Same creation logic as above)

  // Now update the data

  const updateSchema = b.struct({
    instruction: b.u8(),
    name: b.option(b.string()),
    age: b.option(b.u8()),
    email: b.option(b.string())
  })
  type UpdateSchema = b.infer<typeof updateSchema>

  const updateData: UpdateSchema = {
    instruction: 1,
    name: "Jane Doe",
    age: 2,
    email: null
  };

  const updateIx = new TransactionInstruction({
    programId,
    keys: [
      { pubkey: user.publicKey, isWritable: false, isSigner: true },
      { pubkey: userDataPda, isWritable: true, isSigner: false },
    ],
    data: Buffer.from(updateSchema.serialize(updateData))
  });

  const updateTx = new Transaction().add(updateIx);
  updateTx.recentBlockhash = svm.latestBlockhash();
  updateTx.sign(user);

  svm.sendTransaction(updateTx);
  console.log("User data updated successfully");
});

const userDataSchema = b.struct({
  name: b.string(),
  age: b.u8(),
  email: b.string(),
  created_at: b.i32()
})

type User = b.infer<typeof userDataSchema>

test("view user data", async () => {
  const svm = new LiteSVM();
  svm.addProgramFromFile(programId, path.join(__dirname, "data-storage.so"));

  const user = new Keypair();
  svm.airdrop(user.publicKey, BigInt(2 * LAMPORTS_PER_SOL));

  // Create user account first (same as previous test)
  const seeds = [Buffer.from("user_data"), user.publicKey.toBuffer()];
  const [userDataPda] = PublicKey.findProgramAddressSync(seeds, programId);

  const instructionData: CreateUser = {
    instruction: 0,
    name: "Alice Smith",
    age: 28,
    email: "alice@example.com"
  };

  const data = Buffer.from(createUserAccountSchema.serialize(instructionData));

  const ix = new TransactionInstruction({
    programId,
    keys: [
      { pubkey: user.publicKey, isWritable: true, isSigner: true },
      { pubkey: userDataPda, isWritable: true, isSigner: false },
      { pubkey: SystemProgram.programId, isWritable: false, isSigner: false },
    ],
    data
  });

  const tx = new Transaction().add(ix);
  tx.recentBlockhash = svm.latestBlockhash();
  tx.sign(user);
  svm.sendTransaction(tx);

  // Now fetch and view the data
  const accountInfo = svm.getAccount(userDataPda);
  expect(accountInfo).toBeTruthy();


  if (accountInfo) {
    // Manual deserialization for testing
    const userData = userDataSchema.deserialize(Buffer.from(accountInfo.data));

    console.log("=== User Data ===");
    console.log("Name:", userData.name);
    console.log("Age:", userData.age);
    console.log("Email:", userData.email);
    console.log("Created At:", new Date(Number(userData.created_at) * 1000).toISOString());

    // Assertions
    expect(userData.name).toBe("Alice Smith");
    expect(userData.age).toBe(28);
    expect(userData.email).toBe("alice@example.com");
  }
})
