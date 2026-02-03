
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { startBot } from "./bot";
import { connectMongo } from "./mongo";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Connect to MongoDB if configured
  connectMongo().catch(console.error);

  // Logs API
  app.get(api.logs.list.path, async (req, res) => {
    const logs = await storage.getLogs();
    res.json(logs);
  });

  app.post(api.logs.create.path, async (req, res) => {
    const input = api.logs.create.input.parse(req.body);
    const log = await storage.createLog(input);
    res.status(201).json(log);
  });

  // Start the bot in the background
  startBot().catch(console.error);

  return httpServer;
}
