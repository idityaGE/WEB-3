import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import type { CalculatorProg } from "../target/types/calculator_prog";
import { clusterApiUrl, Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import idl from "../target/idl/calculator_prog.json"

describe("calculator-prog", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const user = Keypair.fromSecretKey(Uint8Array.from([191, 191, 88, 89, 191, 57, 127, 155, 134, 10, 223, 155, 240, 240, 177, 78, 184, 250, 119, 112, 229, 82, 77, 70, 193, 181, 1, 250, 181, 190, 31, 76, 134, 132, 63, 172, 16, 118, 140, 243, 202, 60, 162, 185, 44, 22, 138, 104, 114, 77, 38, 155, 102, 98, 36, 246, 103, 28, 7, 205, 214, 166, 254, 144])
  )
  const connection = new Connection(clusterApiUrl("testnet"), "confirmed");
  const program = new Program(idl as CalculatorProg, {
    connection
  })
  // const program = anchor.workspace.calculatorProg as Program<CalculatorProg>;
  const dataAccount = new anchor.web3.Keypair();

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize(0)
      .accounts({
        dataAccount: dataAccount.publicKey,
        signer: user.publicKey,
        systemProgram: SystemProgram.programId
      })
    console.log("Your transaction signature", tx);
  });
});
