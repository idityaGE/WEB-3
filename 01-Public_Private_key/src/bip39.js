import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from 'bip39'

// Mnemonic
const words = generateMnemonic(256)
console.log(words)

const isValid = validateMnemonic(words)
console.log(isValid)

// Seed
const seed = mnemonicToSeedSync(words)
console.log(seed)

const signseed = Buffer.from(seed).toString("hex")
console.log(signseed)

// Derivation Path
// m / purpose' / coin_type' / account' / change / address_index
// Link : https://projects.100xdevs.com/tracks/public-private-keys/Public-Key-Cryptography-9#36eb900d15f0439a855ffd0e9fe73772

