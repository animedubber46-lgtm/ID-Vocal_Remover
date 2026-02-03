
import mongoose from "mongoose";
import { storage } from "./storage";

export async function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) return;

  try {
    await mongoose.connect(uri);
    await storage.createLog({
        level: "info",
        message: "Connected to MongoDB",
    });
  } catch (err: any) {
    await storage.createLog({
        level: "error",
        message: `MongoDB connection error: ${err.message}`,
    });
  }
}
