import { Keypair } from "@solana/web3.js"
import { derivePath } from "ed25519-hd-key";

export const createNewSolKeypair = (seed: string, index: number) => {
  const path = `m/44'/501'/${index}'/0'`
  const derivedSolPath = derivePath(path, seed).key
  const keypair = Keypair.fromSeed(derivedSolPath)
  return {
    publicKey: keypair.publicKey.toBase58(),
    secretKey: Buffer.from(keypair.secretKey).toString("hex"),
  }
}