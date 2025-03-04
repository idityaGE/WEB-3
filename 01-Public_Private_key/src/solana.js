import { Keypair } from '@solana/web3.js'
import nacl from "tweetnacl";

const KeyPair = Keypair.generate();

const publicKey = KeyPair.publicKey.toBase58();
const secretKey = KeyPair.secretKey;

console.log("Public Key:", publicKey);
console.log("Private Key (Secret Key):", secretKey);

const message = new TextEncoder().encode("hello world")

const signature = nacl.sign.detached(message, secretKey)

const result = nacl.sign.detached.verify(
  message,
  signature,
  KeyPair.publicKey.toBytes()
)

console.log(result)

