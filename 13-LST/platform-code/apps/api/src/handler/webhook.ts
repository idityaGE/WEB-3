import { Request, Response } from "express";
import { sendToken } from "../utils/sendToken";

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

    let body;
    let data;

    try {
      if (typeof req.body === 'object' && req.body !== null) {
        data = req.body;
      } else {
        body = req.body();
        data = JSON.parse(body);
      }

      console.log("Received data:", data);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body format"
      });
    }

    if (!data.nativeTransfers[0] ||
      !data.nativeTransfers[0].nativeTransfers ||
      !data.nativeTransfers[0].amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: nativeTransfers.nativeTransfers or nativeTransfers.amount"
      });
    }

    const from = data.nativeTransfers[0].nativeTransfers;
    const amount = data.nativeTransfers[0].amount;

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number"
      });
    }

    const result = await sendToken(from, amount);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Token transfer successful",
        signature: result.signature
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Token transfer failed",
        error: result.error
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
