# Solana CLI Guide

## Introduction to Solana CLI

The Solana Command Line Interface (CLI) provides a set of tools to interact with the Solana blockchain directly from your terminal. It enables developers to manage wallets, deploy programs, create tokens, and interact with the Solana ecosystem.

## Basic Solana CLI Commands

### Solana CLI

```bash
# Check Solana version
solana --version

# Get the current cluster configuration
solana config get

# Set a specific RPC endpoint
solana config set --url https://api.devnet.solana.com

# Check your SOL balance
solana balance

# Request airdrop (on devnet or testnet)
solana airdrop 2

# Get account information
solana account <ADDRESS>

# Transfer SOL
solana transfer <RECIPIENT_ADDRESS> <AMOUNT> --allow-unfunded-recipient
```

### solana-keygen

```bash
# Generate a new keypair
solana-keygen new --outfile ~/my-wallet.json

# Display your public key
solana-keygen pubkey ~/my-wallet.json

# Recover a keypair from a seed phrase
solana-keygen recover -o ~/recovered-wallet.json

# Generate a vanity address (starts with specific characters)
solana-keygen grind --starts-with Ab123 --ignore-case
```

### spl-token

```bash
# Check token balance
spl-token balance <TOKEN_ADDRESS>

# Create a token
spl-token create-token

# Create a token account
spl-token create-account <TOKEN_ADDRESS>

# Mint tokens
spl-token mint <TOKEN_ADDRESS> <AMOUNT> <RECIPIENT_ACCOUNT>

# Transfer tokens
spl-token transfer <TOKEN_ADDRESS> <AMOUNT> <RECIPIENT_ADDRESS> --fund-recipient

# Display all tokens owned by your wallet
spl-token accounts
```

### solana-test-validator

```bash
# Start a local validator
solana-test-validator

# Start validator with custom program deployment
solana-test-validator --bpf-program <PROGRAM_ID> <PROGRAM_FILEPATH.so>

# Start with specific options
solana-test-validator --reset --quiet
```

## Creating a Token on Devnet: Step-by-Step Guide

### Step 1: Setup your environment

```bash
# Set CLI to devnet
solana config set --url https://api.devnet.solana.com

# Create a new wallet (or use existing one)
solana-keygen new --outfile ~/token-creator-wallet.json
solana config set -k ~/token-creator-wallet.json

# Fund your wallet
solana airdrop 2
```

### Step 2: Create your token

```bash
# Create the token mint
spl-token create-token --decimals 9
# Output: Creating token <TOKEN_ADDRESS>

# Note down the TOKEN_ADDRESS from the output
export TOKEN_ADDRESS=<TOKEN_ADDRESS>
```

### Step 3: Create a token account

```bash
# Create a token account to hold your tokens
spl-token create-account $TOKEN_ADDRESS
# Output: Creating account <ACCOUNT_ADDRESS>
```

### Step 4: Mint tokens

```bash
# Mint 1,000,000 tokens to your account
spl-token mint $TOKEN_ADDRESS 1000000
```

### Step 5: Set token metadata

```bash
# Install the Metaplex token metadata CLI
npm install -g @metaplex-foundation/mpl-token-metadata

# Create metadata for your token
metaplex upload --keypair ~/token-creator-wallet.json --name "My Token" --symbol "MTK" --description "My first Solana token" --image-url "https://example.com/token-image.png" --external-url "https://mytoken.com" --seller-fee-basis-points 0

# Attach metadata to your token
metaplex create-metadata --keypair ~/token-creator-wallet.json --mint $TOKEN_ADDRESS --uri "https://arweave.net/..." --update-authority <YOUR_WALLET_ADDRESS>
```

### Step 6: Create an Associated Token Account (ATA) for another user

```bash
# Create ATA for another wallet address
spl-token create-account $TOKEN_ADDRESS --owner <RECIPIENT_WALLET_ADDRESS>
```

### Step 7: Transfer tokens

```bash
# Transfer tokens to recipient's ATA
spl-token transfer $TOKEN_ADDRESS 1000 <RECIPIENT_ATA_ADDRESS> --allow-unfunded-recipient --fund-recipient
```

### Step 8: Configure token features (optional)

```bash
# Disable further minting (finalize supply)
spl-token authorize $TOKEN_ADDRESS mint --disable

# Enable token freezing (if needed)
spl-token authorize $TOKEN_ADDRESS freeze <FREEZE_AUTHORITY>
```

## Checking Your Token

```bash
# View token info
spl-token display $TOKEN_ADDRESS

# Check your token accounts
spl-token accounts

# Check token balance
spl-token balance $TOKEN_ADDRESS
```

## Tips for Token Management

1. Always keep your private keys secure
2. Consider using hardware wallets for production tokens
3. Test thoroughly on devnet before mainnet deployment
4. Create a backup of your wallet that has mint authority
5. Consider adding more verification details in metadata
6. For serious projects, use a multisig for mint authority

This guide covers the basics of creating a Solana token with metadata using the CLI. For more advanced features or production-ready tokens, consider additional security measures and possibly using frameworks like Anchor.
