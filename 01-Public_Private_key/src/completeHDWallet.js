"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWalletMnemonic = generateWalletMnemonic;
exports.mnemonicToSeed = mnemonicToSeed;
exports.generateSolanaKeypair = generateSolanaKeypair;
exports.generateEthereumKeypair = generateEthereumKeypair;
exports.generateMultipleSolanaKeypairs = generateMultipleSolanaKeypairs;
exports.generateMultipleEthereumKeypairs = generateMultipleEthereumKeypairs;
var web3_js_1 = require("@solana/web3.js");
var bip39_1 = require("bip39");
var ed25519_hd_key_1 = require("ed25519-hd-key");
var ethers_1 = require("ethers");
/**
 * Generates a cryptographically secure mnemonic phrase
 * @param strength - The entropy strength (128 for 12 words, 256 for 24 words)
 * @returns The mnemonic phrase as a string of words
 */
function generateWalletMnemonic(strength) {
    if (strength === void 0) { strength = 256; }
    return (0, bip39_1.generateMnemonic)(strength);
}
/**
 * Converts a mnemonic phrase to a seed
 * @param mnemonic - The mnemonic phrase
 * @returns The seed as a hex string
 */
function mnemonicToSeed(mnemonic) {
    return (0, bip39_1.mnemonicToSeedSync)(mnemonic).toString('hex');
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
function generateSolanaKeypair(mnemonic, accountIndex) {
    if (accountIndex === void 0) { accountIndex = 0; }
    // Convert mnemonic to seed
    var seed = (0, bip39_1.mnemonicToSeedSync)(mnemonic).toString('hex');
    // Define the derivation path for Solana (BIP44)
    // m/44'/501'/{accountIndex}'/0'
    var path = "m/44'/501'/".concat(accountIndex, "'/0'");
    // Derive the private key from the seed using the derivation path
    var derivedKey = (0, ed25519_hd_key_1.derivePath)(path, seed).key;
    // Create a Solana keypair from the derived key
    var keypair = web3_js_1.Keypair.fromSeed(new Uint8Array(derivedKey));
    return {
        // Convert public key to base58 string format
        publicKey: keypair.publicKey.toBase58(),
        // Convert secret key to hex string for storage
        secretKey: Buffer.from(keypair.secretKey).toString('hex')
    };
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
function generateEthereumKeypair(mnemonic, accountIndex) {
    if (accountIndex === void 0) { accountIndex = 0; }
    // Create an HD wallet from the mnemonic
    // ethers.js handles the conversion from mnemonic to seed
    var hdNode = ethers_1.ethers.HDNodeWallet.fromMnemonic(ethers_1.ethers.Mnemonic.fromPhrase(mnemonic), 
    // First part of the path up to the account level
    "m/44'/60'/".concat(accountIndex, "'/0/0"));
    return {
        // The Ethereum address (public key)
        publicKey: hdNode.address,
        // The private key without the 0x prefix
        secretKey: hdNode.privateKey.slice(2)
    };
}
/**
 * Generates multiple Solana keypairs from a single mnemonic
 * @param mnemonic - The mnemonic phrase
 * @param count - Number of keypairs to generate
 * @returns Array of keypair objects
 */
function generateMultipleSolanaKeypairs(mnemonic, count) {
    if (count === void 0) { count = 5; }
    var keypairs = [];
    for (var i = 0; i < count; i++) {
        keypairs.push(generateSolanaKeypair(mnemonic, i));
    }
    return keypairs;
}
/**
 * Generates multiple Ethereum keypairs from a single mnemonic
 * @param mnemonic - The mnemonic phrase
 * @param count - Number of keypairs to generate
 * @returns Array of keypair objects
 */
function generateMultipleEthereumKeypairs(mnemonic, count) {
    if (count === void 0) { count = 5; }
    var keypairs = [];
    for (var i = 0; i < count; i++) {
        keypairs.push(generateEthereumKeypair(mnemonic, i));
    }
    return keypairs;
}
