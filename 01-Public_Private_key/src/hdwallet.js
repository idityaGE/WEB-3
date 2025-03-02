import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

// Derivation Path
// m / purpose' / coin_type' / account' / change / address_index
// Link : https://projects.100xdevs.com/tracks/public-private-keys/Public-Key-Cryptography-9#36eb900d15f0439a855ffd0e9fe73772

// Generate a mnemonic phrase
const mnemonic = generateMnemonic(256);

// Convert the mnemonic phrase to a seed
const seed = mnemonicToSeedSync(mnemonic);

for (let i = 0; i < 4; i++) {
  // Define the derivation path
  const path = `m/44'/${i}'/0'`;
  
  // Derive the key from the seed using the derivation path
  const derivedPath = derivePath(path, seed.toString('hex')).key;
  
  // Generate keypair from the derived path
  const keypair = Keypair.fromSeed(Uint8Array.from(derivedPath));

  // Get the private key (secret key)
  const privateKey = keypair.secretKey;

  // Get the public key in base58 format
  const publicKey = keypair.publicKey.toBase58();

  // Log the private key and public key
  console.log('Private Key:', Buffer.from(privateKey).toString('hex'));
  console.log('Public Key:', publicKey);
  console.log('------------------------');
}

/**
 * import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

const mnemonic = generateMnemonic();
const seed = mnemonicToSeedSync(mnemonic);
for (let i = 0; i < 4; i++) {
  const path = `m/44'/501'/${i}'/0'`; // This is the derivation path
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  console.log(Keypair.fromSecretKey(secret).publicKey.toBase58());
}
 */