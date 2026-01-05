import { Keypair } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";

// this is a private key generated using solana-keygen cli
// and it automatically generate the this mnemonic
// "rail unique humble truck divert tide hub jungle vendor advance crucial fun"
const privateKey = new Uint8Array([
  63, 201, 192, 248, 41, 146, 106, 67, 32, 168, 217, 215, 181, 136, 87, 154, 57,
  128, 148, 221, 76, 49, 102, 45, 102, 16, 241, 85, 82, 152, 138, 246, 90, 237,
  249, 124, 129, 215, 55, 193, 199, 27, 166, 82, 94, 45, 116, 239, 154, 185, 22,
  235, 145, 2, 235, 214, 237, 157, 194, 36, 59, 89, 206, 37,
]);

console.log("Original privateKey :", Buffer.from(privateKey).toString("hex"));

// generate public key from solana private key
const keypair = Keypair.fromSecretKey(privateKey);

console.log(keypair.publicKey.toBase58());

// lets try to generate the same public-private key using this seed phrase
const seedPhrase =
  "rail unique humble truck divert tide hub jungle vendor advance crucial fun";

// Get the seed buffer directly
const seedBuffer = mnemonicToSeedSync(seedPhrase);

// Try multiple derivation paths that Solana might use
const paths = [
  "m/44'/501'/0'/0'", // Standard Solana path
  "m/44'/501'/0'", // Alternative path
];

console.log("-------------------");
console.log("Original publicKey:", keypair.publicKey.toBase58());

paths.forEach((path) => {
  try {
    const derived = derivePath(path, seedBuffer.toString("hex")).key;
    // Use first 32 bytes for the seed
    const validateKeypair = Keypair.fromSeed(derived.slice(0, 32));

    console.log(`\nPath: ${path}`);
    console.log("Generated publicKey:", validateKeypair.publicKey.toBase58());

    // Check if keys match
    const match =
      validateKeypair.publicKey.toBase58() === keypair.publicKey.toBase58();
    console.log("Keys match:", match);
  } catch (error) {
    console.log(`Error with path ${path}:`, error.message);
  }
});

// This is the key to solving your problem - Solana uses a custom method
// First, generate the seed from the mnemonic (this is standard)
const seed = mnemonicToSeedSync(seedPhrase);

// For Solana's custom derivation:
// 1. Take only the first 32 bytes of the seed
const seedSlice = seed.slice(0, 32);

// 2. Use this as the seed for Ed25519 key generation
// The nacl.sign.keyPair.fromSeed() is equivalent to what solana-keygen does
const derivedKeypair = nacl.sign.keyPair.fromSeed(seedSlice);

// 3. Create a Solana keypair from this
const solanaDerivedKeypair = Keypair.fromSecretKey(derivedKeypair.secretKey);

console.log("\n--- Solana Custom Derivation ---");
console.log("Derived publicKey:", solanaDerivedKeypair.publicKey.toBase58());
console.log(
  "Keys match:",
  solanaDerivedKeypair.publicKey.toBase58() === keypair.publicKey.toBase58(),
);
// Print both secret keys to compare
console.log("\nOriginal secret key:", Buffer.from(privateKey).toString("hex"));
console.log(
  "Derived secret key:",
  Buffer.from(solanaDerivedKeypair.secretKey).toString("hex"),
);
