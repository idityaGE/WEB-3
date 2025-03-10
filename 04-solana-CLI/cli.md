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
