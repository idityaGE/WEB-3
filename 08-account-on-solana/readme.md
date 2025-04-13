# Accounts on Solana

## Introduction to Accounts

On Solana, all data is contained in what we call "accounts". You can think of data on Solana as a public database with a single "Accounts" table, where each entry in this table is an individual account with the same base Account type.

![Solana Accounts](https://solana.com/_next/image?url=%2Fassets%2Fdocs%2Fcore%2Faccounts%2Faccounts.png&w=1920&q=75)

## Key Points

- Accounts can store up to **10MiB** of data, which contain either executable program code or program state.
- Accounts require a **rent deposit** in lamports (SOL) that is proportional to the amount of data stored, which is fully refundable when the account is closed.
- Every account has a program **owner**. Only the program that owns an account can modify its data or deduct its lamport balance. However, anyone can increase the balance.
- **Sysvar accounts** are special accounts that store network cluster state.
- **Program accounts** store the executable code of smart contracts.
- **Data accounts** are created by programs to store and manage program state.

## Account Structure

![struct](https://solana.com/assets/docs/core/accounts/account-type.svg)

Every account on Solana has the following fields:

- **data**: A byte array that stores arbitrary data for an account. For non-executable accounts, this generally stores state that is meant to be read-only. For program accounts (smart contracts), this contains the executable program code.
- **executable**: This boolean flag used to indicate if an account was a program.
- **lamports**: The account's balance in lamports, the smallest unit of SOL (1 SOL = 1 billion lamports).
- **owner**: The program ID (public key) of the program that owns this account. Only the owner program can modify the account's data or deduct its lamports balance.
- **rent_epoch**: A legacy field from when Solana had a mechanism that periodically deducted lamports from accounts.

```rust
pub struct Account {
    /// lamports in the account
    pub lamports: u64,
    /// data held in this account
    #[cfg_attr(feature = "serde", serde(with = "serde_bytes"))]
    pub data: Vec<u8>,
    /// the program that owns this account. If executable, the program that loads this account.
    pub owner: Pubkey,
    /// this account's data contains a loaded program (and is now read-only)
    pub executable: bool,
    /// the epoch at which this account will next owe rent
    pub rent_epoch: Epoch,
}
```

## Account Address

![address](https://solana.com/assets/docs/core/accounts/account-address.svg)

Every account on Solana is identifiable by a unique 32 byte address, which is generally displayed as a base58 encoded string (e.g `14grJpemFaf88c8tiVb77W7TYg2W3ir6pfkKz3YjhhZ5`).

Most Solana accounts use an Ed25519 public key as their address. While public keys are commonly used as account addresses, Solana also supports a feature called Program Derived Addresses (PDAs).

## Rent

To store data on-chain, accounts must maintain a minimum lamport (SOL) balance that is proportional to amount of data stored on the account (in bytes). This minimum balance is called "rent", although it functions more like a deposit because the full amount can be recovered when an account is closed.

## Types of Accounts

### System Account

![sa](https://solana.com/assets/docs/core/accounts/system-account.svg)

All "wallet" accounts on Solana are simply accounts owned by the System Program. The lamport balance stored in these accounts represents the amount of SOL owned by the wallet. Only accounts owned by the System Program can be used as transaction fee payers.

### Sysvar Accounts

Sysvar accounts are special accounts located at predefined addresses that provide access to cluster state data. These accounts are dynamically updated with data about the network cluster.

### Program Account

![pa](https://solana.com/assets/docs/core/accounts/program-account-simple.svg)

For simplicity, you can think of the program account as the program itself. When invoking a program's instructions, you specify the program account's address (commonly referred to as the "Program ID").

### Buffer Account

Loader-v3 has a special account type for temporarily staging the upload of a program during deployment or redeployment / upgrades.

### Programdata Account

![pa](https://solana.com/assets/docs/core/accounts/program-account-expanded.svg)

Loader-v3 works differently from all other loaders as it has one indirection for each program. The program account only contains the address of the programdata account which then in turn holds the actual executable code.

### Data Account

![da](https://solana.com/assets/docs/core/accounts/data-account.svg)

On Solana the executable code of a program is stored in a different account than the state of the program is. This is comparable to how operating systems typically have separate files for programs themselves and their data.

## Program Ownership

On Solana, "smart contracts" are referred to as **programs**. Program ownership is a key aspect of the Solana Account Model. Every account has a designated program as its owner. Only the owner program can:
- Modify the account's `data` field
- Deduct lamports from the account's balance

## System Program

By default, all new accounts are owned by the System Program. The System Program performs several key tasks:
- **New Account Creation**: Only the System Program can create new accounts.
- **Space Allocation**: Sets the byte capacity for the data field of each account.
- **Transfer / Assign Program Ownership**: Once the System Program creates an account, it can reassign the designated program owner to a different program account.

## Creating Data Accounts

To maintain state, programs define instructions to create separate accounts that are owned by the program. Creating a data account for a custom program requires two steps:

1. Invoke the System Program to create an account, which then transfers ownership to the custom program
2. Invoke the custom program, which now owns the account, to then initialize the account data as defined by the program's instruction

This account creation process is often abstracted as a single step, but it's helpful to understand the underlying process.

## References

- [Official Solana Documentation](https://solana.com/docs/core/accounts)
- [Solana Program Derived Address](https://solana.com/docs/core/accounts/program-derived-address)
