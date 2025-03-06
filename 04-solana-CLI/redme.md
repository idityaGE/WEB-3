## Solana CLI

The Solana Command Line Interface (CLI) is a collection of command line tools to interact with the Solana blockchain.

> There are multiple binaries that are part of the Solana CLI. The most common ones are:
>
> - `solana` - The main binary that is used to interact with the Solana blockchain.
> - `solana-keygen` - A keypair generator for the Solana blockchain.
> - `solana-test-validator` - A validator that participates in the Solana network.
> - `solana-tokens` - A utility for managing tokens on the Solana blockchain.

1. `solana`: The main binary that is used to interact with the Solana blockchain

- `solana balance`: Check your balance
- `solana address`: Generate a new address
- `solana airdrop`: Request an airdrop of lamports into your account
- `solana config get`: Display the current configuration
- `solana config set`: Set a configuration variable

2. `solana-keygen`: A keypair generator for the Solana blockchain

- `solana-keygen new`: Generate a new keypair
- `solana-keygen recover`: Recover a keypair from a mnemonic seed phrase
- `solana-keygen verify`: Verify that a keypair matches a given address

3. `solana-test-validator`: A validator that participates in the Solana network

- `solana-test-validator`: Start a test validator on your local machine

> to check balance and other details of public address use https://explorer.solana.com/

#### JSON RPC API ==> `calling a remote procedure/function over HTTP using JSON as the data format`
these are the API that are used to interact with the Solana blockchain. The JSON RPC API is a set of HTTP endpoints that are used to interact with the Solana blockchain. The JSON RPC API is used by the Solana CLI and other tools to interact with the Solana blockchain.

### Mainet vs Devnet vs Testnet vs Localnet

- **Mainnet**: The main Solana network where real SOL tokens are used.
  - **Mainnet Beta**: The main Solana network where new features are tested before they are released to the mainnet.
  Link : https://api.mainet-beta.solana.com/

- **Devnet**: A development network that is used for testing and development purposes.
- **Testnet**: A test network that is used for testing and development purposes.
- **Localnet**: A local network that is used for testing and development purposes on your local machine.
