import { Request, Response } from "express";
import { sendToken } from "../utils/sendToken";
import { sendSol } from "../utils/sendSol";
import { processData, TransactionType } from "../utils/processData";

export const webhookHandler = async (req: Request, res: Response) => {
  try {
    const paramAuthHeader = req.headers['authorization'] as string;
    if (!paramAuthHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header missing'
      });
    }

    const authHeader = process.env.AUTH_HEADER as string;
    if (!authHeader) {
      console.error("AUTH_HEADER environment variable not set");
      return res.status(500).json({
        success: false,
        message: "Server configuration error"
      });
    }

    if (authHeader !== paramAuthHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized (Invalid authorization header)"
      });
    }

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Missing request body"
      });
    }

    const processedData = processData(req.body);

    if (!processedData.isValid) {
      return res.status(400).json({
        success: false,
        message: processedData.validationMessage
      });
    }

    switch (processedData.type) {
      case TransactionType.RECEIVED_SOL:
        if (processedData.fromAddress) {
          const result = await sendToken(processedData.fromAddress, processedData.amount);
          if (result.success) {
            return res.status(200).json({
              success: true,
              message: `Successfully processed SOL receipt and sent equivalent tokens`,
              transaction: {
                receivedAmount: processedData.amount,
                receivedType: "SOL",
                sender: processedData.toAddress,
                recipient: processedData.fromAddress,
                transferSignature: result.signature
              }
            });
          } else {
            return res.status(500).json({
              success: false,
              message: "Error sending tokens in response to SOL receipt",
              error: result.error
            });
          }
        } else {
          return res.status(400).json({
            success: false,
            message: "Invalid SOL amount or sender address"
          });
        }
        break;

      case TransactionType.RECEIVED_TOKEN:
        if (processedData.fromAddress) {
          const result = await sendSol(processedData.fromAddress, processedData.amount);
          if(result.success) {
            return res.status(200).json({
              success: true,
              message: `Successfully processed lSOL Token receipt and sent equivalent SOL`,
              transaction: {
                receivedAmount: processedData.amount,
                receivedType: "lSOl",
                mint: processedData.mint,
                sender: processedData.toAddress,
                recipient: processedData.fromAddress,
                transferSignature: result.signature
              }
            })
          } else {
            return res.status(500).json({
              success: false,
              message: "Error sending SOL in response to lSOL Token receipt",
              error: result.error
            });
          }
        } else {
          return res.status(400).json({
            success: false,
            message: "Invalid lSOL amount or sender address"
          });
        }
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Unrecognized transaction type"
        });
    }

  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error processing request",
      error: error
    });
  }
}
