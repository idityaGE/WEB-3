require('dotenv').config();
import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { webhookHandler } from "./handler/webhook";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())

    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })

    .post("/webhook", webhookHandler)

  return app;
};
