import { Keypair } from '@solana/web3.js'
import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import { derivePath } from 'ed25519-hd-key'
import { ethers } from 'ethers'

/**
 * Generates a cryptographically secure mnemonic phrase
 * @param strength - The entropy strength (128 for 12 words, 256 for 24 words)
 * @returns The mnemonic phrase as a string of words
 */
export function generateWalletMnemonic(strength: number = 256): string {
  return generateMnemonic(strength)
}

/**
 * Converts a mnemonic phrase to a seed
 * @param mnemonic - The mnemonic phrase
 * @returns The seed as a hex string
 */
export function mnemonicToSeed(mnemonic: string): string {
  return mnemonicToSeedSync(mnemonic).toString('hex')
}

/**
 * Generates a Solana keypair from a mnemonic phrase and account index
 * 
 * Uses BIP44 derivation path with Solana's coin type (501)
 * m/44'/501'/{account}'/0'
 * 
 * @param mnemonic - The mnemonic phrase
 * @param accountIndex - The account index (default: 0)
 * @returns Object containing the publicKey and secretKey
 */
export function generateSolanaKeypair(mnemonic: string, accountIndex: number = 0): {
  publicKey: string;
  secretKey: string;
} {
  // Convert mnemonic to seed
  const seed = mnemonicToSeedSync(mnemonic).toString('hex')

  // Define the derivation path for Solana (BIP44)
  // m/44'/501'/{accountIndex}'/0'
  const path = `m/44'/501'/${accountIndex}'/0'`

  // Derive the private key from the seed using the derivation path
  const derivedKey = derivePath(path, seed).key

  // Create a Solana keypair from the derived key
  const keypair = Keypair.fromSeed(new Uint8Array(derivedKey))

  return {
    // Convert public key to base58 string format
    publicKey: keypair.publicKey.toBase58(),
    // Convert secret key to hex string for storage
    secretKey: Buffer.from(keypair.secretKey).toString('hex')
  }
}

/**
 * Generates an Ethereum keypair from a mnemonic phrase and account index
 * 
 * Uses BIP44 derivation path with Ethereum's coin type (60)
 * m/44'/60'/{account}'/0/0
 * 
 * @param mnemonic - The mnemonic phrase
 * @param accountIndex - The account index (default: 0)
 * @returns Object containing the publicKey (address) and secretKey (private key)
 */
export function generateEthereumKeypair(mnemonic: string, accountIndex: number = 0): {
  publicKey: string;
  secretKey: string;
} {
  // Create an HD wallet from the mnemonic
  // ethers.js handles the conversion from mnemonic to seed
  const hdNode = ethers.HDNodeWallet.fromMnemonic(
    ethers.Mnemonic.fromPhrase(mnemonic),
    // First part of the path up to the account level
    `m/44'/60'/${accountIndex}'/0/0`
  )

  return {
    // The Ethereum address (public key)
    publicKey: hdNode.address,
    // The private key without the 0x prefix
    secretKey: hdNode.privateKey.slice(2)
  }
}

/**
 * Generates multiple Solana keypairs from a single mnemonic
 * @param mnemonic - The mnemonic phrase
 * @param count - Number of keypairs to generate
 * @returns Array of keypair objects
 */
export function generateMultipleSolanaKeypairs(mnemonic: string, count: number = 5): Array<{
  publicKey: string;
  secretKey: string;
}> {
  const keypairs: Array<{ publicKey: string; secretKey: string }> = []

  for (let i = 0; i < count; i++) {
    keypairs.push(generateSolanaKeypair(mnemonic, i))
  }

  return keypairs
}

/**
 * Generates multiple Ethereum keypairs from a single mnemonic
 * @param mnemonic - The mnemonic phrase
 * @param count - Number of keypairs to generate
 * @returns Array of keypair objects
 */
export function generateMultipleEthereumKeypairs(mnemonic: string, count: number = 5): Array<{
  publicKey: string;
  secretKey: string;
}> {
  const keypairs: Array<{ publicKey: string; secretKey: string }> = []

  for (let i = 0; i < count; i++) {
    keypairs.push(generateEthereumKeypair(mnemonic, i))
  }

  return keypairs
}