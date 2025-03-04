import { Keypair } from '@solana/web3.js'
import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import { derivePath } from 'ed25519-hd-key'
import nacl from "tweetnacl";

const mnemonic = generateMnemonic(256)
// console.log(mnemonic)
const seed = mnemonicToSeedSync(mnemonic).toString("hex")

for (let i = 0; i < 5; i++) {
  const path = `m/44'/501'/${i}'/0'`
  const derivedPath = derivePath(path, seed).key; // A buffer
  const keypair = Keypair.fromSeed(derivedPath)
  const privateKey = keypair.secretKey
  const publicKey = keypair.publicKey.toBase58();
  console.log('Private Key:', Buffer.from(privateKey).toString("hex"));
  console.log('Public Key:', publicKey);
  console.log('------------------------');
}


// for ethereum
for (let i = 0; i < 4; i++) {
  const path = `m/44'/60'/${i}'/0'`; // This is the derivation path
  const derivedSeed = derivePath(path, seed).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  console.log(Keypair.fromSecretKey(secret).publicKey.toBase58());
}