# Architecture of the Ethereum Virtual Machine (EVM)

The Ethereum Virtual Machine (EVM) is the runtime environment for smart contracts in Ethereum. It's a quasi-Turing complete machine - "quasi" because computations are limited by gas. Let me explain its architecture and operation.

## EVM Architecture

The EVM is a stack-based virtual machine with a simple yet powerful architecture:

![EVM Architecture](https://www.zaryabs.com/content/images/2023/01/image-10.png)

## Key Components of the EVM

### 1. Stack
- The primary data structure for computation
- 256-bit words (to accommodate Ethereum's 256-bit native data size)
- Maximum depth of 1024 elements
- Stack-based operations: PUSH, POP, DUP, SWAP, etc.

### 2. Memory
- Linear, byte-addressable temporary space
- Volatile (cleared after execution)
- Organized in 32-byte (256-bit) words
- Costs gas to expand (quadratically increasing)
- Accessed with MLOAD, MSTORE operations

### 3. Storage
- Persistent key-value store
- Maintained between contract calls
- Maps 256-bit keys to 256-bit values
- Most expensive resource in terms of gas
- Accessed with SLOAD, SSTORE operations

### 4. Execution Context
- Contains information about the current execution environment:
  - Program counter
  - Gas remaining
  - Contract address (executing code)
  - Call data (function inputs)
  - Caller address
  - Value sent (ETH)
  - Return data buffer

### 5. Instruction Set
The EVM has approximately 140 opcodes grouped into several categories:
- **Stack operations**: PUSH, POP, DUP, SWAP
- **Arithmetic operations**: ADD, MUL, SUB, DIV, EXP
- **Comparison operations**: LT, GT, EQ, ISZERO
- **Bitwise operations**: AND, OR, XOR, NOT
- **Memory operations**: MLOAD, MSTORE, MSTORE8
- **Storage operations**: SLOAD, SSTORE
- **Program flow**: JUMP, JUMPI, PC, JUMPDEST
- **Environmental information**: ADDRESS, BALANCE, CALLER
- **Block information**: TIMESTAMP, NUMBER, DIFFICULTY
- **Cryptographic operations**: SHA3 (Keccak-256)
- **Contract creation**: CREATE, CREATE2
- **Calls**: CALL, STATICCALL, DELEGATECALL, CALLCODE
- **Logging**: LOG0, LOG1, LOG2, LOG3, LOG4
- **System operations**: RETURN, REVERT, SELFDESTRUCT

### 6. Gas Accounting
- Each operation consumes a predetermined amount of gas
- More complex operations cost more gas
- Gas limit is set per transaction
- Execution halts if gas is exhausted (with state changes reverted)

## How the EVM Works

1. **Contract Deployment**:
   - Compiled bytecode is sent in a transaction
   - EVM allocates storage and assigns an address
   - Constructor code is executed once
   - Runtime bytecode is stored persistently

2. **Transaction Processing**:
   - Transaction contains:
     - Target contract address
     - Input data (encoded function call)
     - Gas limit & price
     - Value (ETH)
   - EVM initializes a new execution context

3. **Function Selection**:
   - First 4 bytes of input data identify the function (function selector)
   - Calculated as first 4 bytes of keccak256 hash of function signature
   - Remaining data contains encoded parameters

4. **Bytecode Execution**:
   - EVM starts executing bytecode from the beginning (or jumps to function entry point)
   - Program counter advances one instruction at a time
   - Each operation manipulates the stack, memory, or storage
   - Gas is deducted for each operation

5. **State Changes**:
   - During execution, contract can modify its storage
   - Can call other contracts (creating a new EVM instance)
   - Can emit events (logs)

6. **Execution Completion**:
   - Contract execution ends with RETURN (success) or REVERT (controlled failure)
   - If gas is exhausted or an error occurs, execution halts
   - On success, state changes are committed to the blockchain
   - On failure, state changes are reverted (but gas is still consumed)

## Security Features

1. **Sandboxed Execution**: Contracts can only access their own storage directly
2. **Gas Metering**: Prevents infinite loops and resource abuse
3. **Determinism**: Same input always produces same output across all nodes
4. **Isolation**: Contract execution cannot affect the EVM itself

This architecture enables the secure, deterministic execution of smart contracts on a global, decentralized network while maintaining consensus across all participating nodes.

Similar code found with 6 license types
