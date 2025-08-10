import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Staking } from "../target/types/staking"; // Replace with actual generated type

describe("StakeAccount PDA Test", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.YourProgram as Program<Staking>; // Replace with your program
  const user = new Keypair.fromSecretKey(Uint8Array.from([]))

  it("Creates PDA account correctly", async () => {
    // Derive PDA
    const [pda, bump] = await PublicKey.findProgramAddressSync(
      [Buffer.from("pda"), user.publicKey.toBuffer()],
      program.programId
    );

    // Send transaction
    const tx = await program.methods
      .createPdaAccount()
      .accounts({
        payer: user.publicKey,
        pdaAccount: pda,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    console.log("Transaction Signature:", tx);

    // Fetch the created account
    const stakeAccount = await program.account.stakeAccount.fetch(pda);

    // Assertions
    assert.ok(stakeAccount.owner.equals(user.publicKey));
    assert.strictEqual(stakeAccount.stakedAmount.toNumber(), 0);
    assert.strictEqual(stakeAccount.totalPoints.toNumber(), 0);
    assert.strictEqual(stakeAccount.bump, bump);
    assert.ok(typeof stakeAccount.lastUpdateTime === "number");
  });
});
