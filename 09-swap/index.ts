import { Keypair, Connection, VersionedTransaction } from '@solana/web3.js';
import { buildUrlWithParams, getQuote, getSwapInstruction } from './utils';

/**
 * JUPITER SWAP EXECUTION SCRIPT
 * =============================
 * 
 * This script performs a token swap on Solana using Jupiter Aggregator API.
 * 
 * High-level process:
 * 1. Initialize connection to Solana devnet and load wallet from private key
 * 2. Define swap parameters (input token, output token, amount, etc.)
 * 3. Get a quote from Jupiter API (finds the best swap route)
 * 4. Submit the quote to get swap instructions
 * 5. Sign and send the transaction to Solana
 * 6. Confirm the transaction and display results
 * 
 * Prerequisites:
 * - PRIVATE_KEY environment variable must be set with wallet private key (as JSON array)
 * 
 * Reference: https://dev.jup.ag/docs/swap-api/get-quote
 */

try {
	// Step 1: Initialize connection and wallet
	// Connect to Solana devnet for testing swaps
	const connection = new Connection('https://api.mainnet-beta.solana.com');

	// Validate that private key is available in environment variables
	if (!process.env.PRIVATE_KEY) {
		throw new Error("PRIVATE_KEY is not defined in the environment variables");
	}

	// Convert private key from JSON array to Uint8Array format required by Solana
	const privateKeyArray = Uint8Array.from(
		JSON.parse(process.env.PRIVATE_KEY) as number[]
	);

	// Create a keypair from the private key for transaction signing
	const owner = Keypair.fromSecretKey(privateKeyArray);

	console.log("Public Key:", owner.publicKey.toBase58());

	// Step 2: Define swap parameters
	const queryParams = {
		// env: "devnet", // Uncomment if needed for specific API endpoints
		inputMint: "So11111111111111111111111111111111111111112", // SOL token mint address
		outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Target token mint address
		amount: "100000000", // Amount in lamports (0.1 SOL = 100,000,000 lamports)
		slippageBps: "50", // Slippage tolerance in basis points (0.5%)
		restrictIntermediateTokens: "true" // Limit intermediate tokens to improve safety
	};

	// Jupiter API endpoints for quote and swap execution
	const quoteUrl = "https://lite-api.jup.ag/swap/v1/quote";
	const swapUrl = "https://lite-api.jup.ag/swap/v1/swap";

	// Build the complete URL with query parameters for the quote request
	const fullQuoteUrl = buildUrlWithParams(quoteUrl, queryParams);
	console.log("Quote URL:", fullQuoteUrl);

	// Step 3-6: Main execution function
	const main = async () => {
		try {
			// Step 3: Get a quote from Jupiter API
			// This returns the optimal swap route based on our parameters
			const quoteResponse = await getQuote(fullQuoteUrl);

			// Step 4: Prepare data for swap instruction request
			const data = JSON.stringify({
				userPublicKey: owner.publicKey.toBase58(),
				quoteResponse,
				dynamicComputeUnitLimit: true, // Automatically adjust compute limits
				dynamicSlippage: true, // Adjust slippage based on market conditions
				prioritizationFeeLamports: { // Priority fee configuration for faster processing
					priorityLevelWithMaxLamports: {
						maxLamports: 1000000, // Maximum priority fee (1 SOL)
						priorityLevel: "veryHigh" // Priority level for transaction
					}
				}
			});

			// Get swap instructions from Jupiter API
			const swapResponse = await getSwapInstruction(swapUrl, data);

			// Validate that we received a transaction from the API
			if (!swapResponse.swapTransaction) {
				throw new Error("No swap transaction received from API");
			}

			// Extract and deserialize the transaction
			const transactionBase64 = swapResponse.swapTransaction;
			const transaction = VersionedTransaction.deserialize(Buffer.from(transactionBase64, 'base64'));

			// Step 5: Sign the transaction with our wallet
			transaction.sign([owner]);
			const transactionBinary = transaction.serialize();

			// Send the signed transaction to Solana
			const signature = await connection.sendRawTransaction(transactionBinary, {
				maxRetries: 2, // Retry up to 2 times if transaction fails
				skipPreflight: true // Skip preflight checks for higher success rate
			});

			// Step 6: Confirm the transaction was executed successfully
			const confirmation = await connection.confirmTransaction(signature, "finalized");

			// Check for errors in the transaction execution
			if (confirmation.value.err) {
				throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}\nhttps://solscan.io/tx/${signature}/`);
			}

			// Display success message with transaction explorer link
			console.log(`Transaction successful: https://solscan.io/tx/${signature}/`);
		} catch (error) {
			// Handle any errors during the swap execution process
			console.error("Swap execution failed:", error instanceof Error ? error.message : error);
			process.exit(1);
		}
	};

	// Execute the main function
	main();
} catch (error) {
	// Handle any errors during initialization (connection, wallet loading)
	console.error("Initialization error:", error instanceof Error ? error.message : error);
	process.exit(1);
}
