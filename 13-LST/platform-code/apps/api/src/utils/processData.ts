import { PublicKey } from "@solana/web3.js";

export enum TransactionType {
  RECEIVED_SOL = "RECEIVED_SOL",
  RECEIVED_TOKEN = "RECEIVED_TOKEN",
  UNKNOWN = "UNKNOWN"
}

export interface ProcessedTransaction {
  type: TransactionType;
  amount: number;
  fromAddress?: string;
  toAddress?: string;
  signature: string;
  timestamp: number;
  mint?: string;
  isValid: boolean;
  validationMessage?: string;
}

export const processData = (data: any): ProcessedTransaction => {
  try {
    const result: ProcessedTransaction = {
      type: TransactionType.UNKNOWN,
      amount: 0,
      signature: data.signature || "",
      timestamp: data.timestamp || 0,
      isValid: false,
      validationMessage: "Unknown transaction type"
    };

    const userPublicKey = process.env.USER_PUBLIC_KEY;
    const mintAddress = process.env.MINT_ADDRESS;

    if (!userPublicKey) {
      result.validationMessage = "USER_PUBLIC_KEY not configured in environment";
      return result;
    }

    if (!data.signature) {
      result.validationMessage = "Transaction signature missing";
      return result;
    }

    if (
      data.type === "TRANSFER" &&
      data.nativeTransfers &&
      data.nativeTransfers.length > 0
    ) {
      const transfer = data.nativeTransfers[0];

      if (transfer.toUserAccount === userPublicKey) { // critical point webhook will send the the transcation that you make so make sure the rechived account is your not that fromUserAccount is yours
        result.type = TransactionType.RECEIVED_SOL;
        result.amount = transfer.amount;
        result.fromAddress = transfer.fromUserAccount;
        result.toAddress = transfer.toUserAccount;
        result.isValid = true;
        result.validationMessage = "Valid SOL transfer received";

        return result;
      } else {
        result.validationMessage = "SOL transfer not to our address";
        return result;
      }
    }

    if (
      data.type === "TRANSFER" &&
      data.tokenTransfers &&
      data.tokenTransfers.length > 0
    ) {
      const tokenTransfer = data.tokenTransfers[0];

      if (tokenTransfer.toUserAccount === userPublicKey) {
        if (mintAddress && tokenTransfer.mint === mintAddress) {
          result.type = TransactionType.RECEIVED_TOKEN;
          result.amount = tokenTransfer.tokenAmount;
          result.fromAddress = tokenTransfer.fromUserAccount;
          result.toAddress = tokenTransfer.toUserAccount;
          result.mint = tokenTransfer.mint;
          result.isValid = true;
          result.validationMessage = "Valid token transfer received";

          return result;
        } else {
          result.validationMessage = `Received token with mint ${tokenTransfer.mint} doesn't match expected mint ${mintAddress}`;
          return result;
        }
      } else {
        result.validationMessage = "Token transfer not to our address";
        return result;
      }
    }

    result.validationMessage = "Transaction format not recognized as SOL or token transfer";
    return result;

  } catch (error) {
    return {
      type: TransactionType.UNKNOWN,
      amount: 0,
      signature: data.signature || "",
      timestamp: data.timestamp || 0,
      isValid: false,
      validationMessage: `Error processing transaction: ${error}`
    };
  }
};

export const isValidPublicKey = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};
